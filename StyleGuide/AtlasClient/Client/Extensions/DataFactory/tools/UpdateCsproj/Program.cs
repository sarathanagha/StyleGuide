
using Microsoft.Build.Evaluation;
using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.VersionControl.Client;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace UpdateCsproj
{
    public class Program
    {
        public static string tfsServer = @"http://sqlbuvsts01:8080/Main";
        public static string serverProjectPath = @"$/Data Studio/CAMain/Product/Source/DataStudioPOC/AtlasClient/Client/Extensions/DataFactory/src/";
        public static string serverSrcPath = serverProjectPath;
        public static string localCsprojPath = @"..\..\..\..\src\DataFactory.csproj";
        public static string contentItemType = "Content";
        public static string typescriptItemType = "TypeScriptCompile";
        public static string typescriptDefinitionItemType = "Typescript";
        public static string compileItemType = "Compile";

        static void Main(string[] args)
        {
            var csprojObject = new Project(localCsprojPath);
            bool csprojModified = false;
            var currentProjItems = new Dictionary<string, ProjectItem>();
            foreach (ProjectItem pi in csprojObject.Items)
            {
                if (pi.ItemType.Equals(contentItemType) || pi.ItemType.Equals(typescriptItemType) || pi.ItemType.Equals(compileItemType) || pi.ItemType.Equals(typescriptDefinitionItemType))
                {
                    if (!currentProjItems.ContainsKey(pi.UnevaluatedInclude))
                    {
                        currentProjItems.Add(pi.UnevaluatedInclude, pi);
                    }
                }
            }

            var teamProjectCollection = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(new Uri(tfsServer));
            var versionControlServer = teamProjectCollection.GetService<VersionControlServer>();
            var workspace = versionControlServer.GetWorkspace(localCsprojPath);

            var filesToAdd = new Dictionary<string, string>();      // where key is lower case, and value is case is actual value.
            var filesToRemove = new Dictionary<string, string>();    // same as above
            var existingPaths = new Dictionary<string, IDictionary<string, IList<string>>>(); // where key is lower case path partial path, and value is current directory -> original full path

            // Try to add files that are being added in the current pending change.
            foreach (PendingChange pc in workspace.GetPendingChanges())
            {
                if (pc.ServerItem.StartsWith(serverSrcPath) && pc.ItemType.HasFlag(ItemType.File)) {
                    if (pc.ChangeType.HasFlag(ChangeType.Add))
                    {
                        Program.AddFile(pc.ServerItem, filesToAdd, existingPaths);
                    }
                    else if (pc.ChangeType.HasFlag(ChangeType.Rename) && pc.SourceServerItem != null)
                    {
                        Program.AddFile(pc.ServerItem, filesToAdd, existingPaths);
                        filesToRemove.Add(pc.SourceServerItem, pc.SourceServerItem);
                    }
                    else if (pc.ChangeType.HasFlag(ChangeType.Delete))
                    {
                        filesToRemove.Add(pc.ServerItem, pc.ServerItem);
                    }
                }
            }

            // Try to add files that are currently checked in.
            UpdateFilesToInclude(versionControlServer, serverSrcPath, filesToAdd, filesToRemove, existingPaths);

            // Add the new files to proj object.
            foreach (KeyValuePair<string, string> fileObj in filesToAdd)
            {
                string localPath = fileObj.Value.Replace(serverProjectPath, "").Replace("/", @"\");
                string localPathLowerCase = localPath;
                // Compare in lowercase.
                if (!currentProjItems.ContainsKey(localPathLowerCase) && !localPathLowerCase.EndsWith("proj"))
                {
                    // But add objects with proper names.
                    if (localPath.EndsWith(".d.ts"))
                    {
                        csprojObject.AddItem(typescriptDefinitionItemType, localPath);
                    } else if (localPath.EndsWith(".ts"))
                    {
                        csprojObject.AddItem(typescriptItemType, localPath);
                    }
                    else if (localPath.EndsWith(".cs"))
                    {
                        csprojObject.AddItem(compileItemType, localPath);
                    }
                    else
                    {
                        csprojObject.AddItem(contentItemType, localPath);
                    }
                    csprojModified = true;
                    Console.WriteLine("Added file: " + localPath);
                }
            }

            // Delete from csproj if the path is not present in current change or if it is not checked in.
            foreach (KeyValuePair<string, ProjectItem> item in currentProjItems)
            {
                string serverPath = (serverProjectPath + item.Key.Replace(@"\", "/"));
                // make sure the item could have been in our project
                if (serverPath.StartsWith(serverSrcPath) && new Regex(@"\.[^\.]+$").IsMatch(serverPath))
                {
                    if (!filesToAdd.ContainsKey(serverPath))
                    {
                        csprojObject.RemoveItem(item.Value);
                        csprojModified = true;
                        Console.WriteLine("Removed file: " + item.Key);
                    }
                }
            }

            Dictionary<string, List<Replacement>> badPaths = new Dictionary<string, List<Replacement>>();

            foreach(KeyValuePair<string, IDictionary<string, IList<string>>> item in existingPaths){
                if (item.Value.Keys.Count > 1)
                {
                    Console.Error.WriteLine("\nERROR: Inconsistencies with paths like: " + item.Key);

                    var keys = new List<string>(item.Value.Keys);

                    keys.Sort(delegate(string s1, string s2)
                    {
                        return item.Value[s2].Count - item.Value[s1].Count;
                    });

                    string firstKey = keys[0];
                    keys.RemoveAt(0);

                    Console.Error.WriteLine("\tNormalizing to most common ending ({0} paths end with {1})", item.Value[firstKey].Count, firstKey);

                    foreach(string key in keys){
                        IList<string> paths = item.Value[key];

                        Console.Error.WriteLine("\t\t{0} paths that end with {1}: ", paths.Count, key);

                        foreach (string path in paths)
                        {
                            if (!badPaths.ContainsKey(path))
                            {
                                badPaths.Add(path, new List<Replacement>());
                            }

                            badPaths[path].Add(new Replacement(item.Key.Length - firstKey.Length, firstKey));
                        }
                    }
                }
            }

            // Save the project object.
            if (csprojModified)
            {
                workspace.PendEdit(localCsprojPath);
                csprojObject.Save();
            }

            if (badPaths.Count > 0)
            {
                Console.Error.WriteLine("\nPending renames for {0} files...", badPaths.Count);

                foreach (KeyValuePair<string, List<Replacement>> item in badPaths)
                {
                    string newPath = item.Key;
                    while (item.Value.Count > 0)
                    {
                        newPath = item.Value[0].Replace(newPath);
                        item.Value.RemoveAt(0);
                    }

                    Console.Error.WriteLine("\tOld path: " + item.Key);
                    Console.Error.WriteLine("\tNew path: " + newPath);

                    workspace.PendRename(item.Key, newPath);
                }

                // return failing error code
                Environment.Exit(1);
            }
        }

        private static void UpdateFilesToInclude(VersionControlServer versionControlServer, string serverPath, IDictionary<string, string> filesToAdd, IDictionary<string, string> filesToRemove, IDictionary<string, IDictionary<string, IList<string>>> existingPaths)
        {
            ItemSet projectFiles = versionControlServer.GetItems(serverPath, RecursionType.Full);
            foreach (Item item in projectFiles.Items)
            {
                if (item.ItemType.HasFlag(ItemType.File))
                {

                    if (!filesToRemove.ContainsKey(item.ServerItem))
                    {
                        Program.AddFile(item.ServerItem, filesToAdd, existingPaths);
                    }
                }
            }
        }

        private static void AddFile(string originalPath, IDictionary<string, string> filesToAdd, IDictionary<string, IDictionary<string, IList<string>>> existingPaths)
        {
            filesToAdd.Add(originalPath, originalPath);

            string path = Program.GoUpDirectory(originalPath);
            do
            {
                string lowerPath = path.ToLowerInvariant();
                string currentDir = Program.CurrentDirectory(path);

                if (!existingPaths.ContainsKey(lowerPath))
                {
                    existingPaths.Add(lowerPath, new Dictionary<string, IList<string>>());
                }

                if(!existingPaths[lowerPath].ContainsKey(currentDir)){
                    existingPaths[lowerPath].Add(currentDir, new List<string>());
                }

                existingPaths[lowerPath][currentDir].Add(originalPath);

                path = Program.GoUpDirectory(path);
            } while (path.Length > 0);
        }

        private static string GoUpDirectory(string path)
        {
            var lastDir = path.LastIndexOf("/");

            if(lastDir < 0){
                return "";
            }

            return path.Substring(0, lastDir);
        }

        private static string CurrentDirectory(string path)
        {
            var lastDir = path.LastIndexOf("/");

            if (lastDir < 0)
            {
                return path;
            }

            return path.Substring(lastDir);
        }
    }

    public class Replacement
    {
        private int _start;
        private string _str;

        public Replacement(int start, string str)
        {
            this._start = start;
            this._str = str;
        }

        public string Replace(string other)
        {
            return other.Remove(_start, _str.Length).Insert(_start, _str);
        }
    }
}
