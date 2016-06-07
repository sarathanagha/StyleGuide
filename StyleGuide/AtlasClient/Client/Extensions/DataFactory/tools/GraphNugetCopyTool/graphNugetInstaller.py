# Current version of graph nuget 5.0.1.1803
# Since atlas shell and Ibiza use different versions of common library, there are chances that each upgrade to a newer version will require quite some effort.

import sys, shutil, os, os.path

def copyFiles(src, dest):
    srcLength = len(src)
    for root, srcDirs, srcFiles in os.walk(src):
        commonPath = root[srcLength:]
        for srcFile in srcFiles:
            destPath = dest + commonPath + "\\" + srcFile
            shutil.copyfile(root + "\\" + srcFile, destPath)

def main():
    if len(sys.argv) < 3:
        print "Usage <script> <location of graph control nuget> <location of VivaGraphControl folder>"
        sys.exit(1)

    nugetLocation = sys.argv[1]
    destination = sys.argv[2]

    nugetContentLocation = nugetLocation + "\Content"
    destinationContent = destination + "\Content"
    supportFolderLocation = ".\supportFiles"

    # Copy the entire structure
    if os.path.isdir(destination):
        shutil.rmtree(destination)
    shutil.copytree(nugetContentLocation, destinationContent)

    # Custom edits to files

    # 1. Instead of removing .azc-light-theme from the css file, just add it in top level of graph control.

    # 2. Replace some of the files directly. These files represent conflict resolutions, additional styling changes etc.
    copyFiles(supportFolderLocation, destination)

    # 3. Graph control needs to be loaded at two endpoints, VivaGraphControl (the top-level) and Viva.Controls (an internal path)
    #    Viva.Controls is required for handling js files, while the CSS files will have to be loaded via VivaGraphControl.

    # 5. Edit GraphViewModel.d.ts to instead use type JQueryPromise<any> instead of JQueryPromise (needed because atlas's JQueryPromise if of generic type)
    graphViewModelPath = destinationContent + "\\Scripts\\Viva.Controls\\Controls\\Visualization\\Graph\\GraphViewModel.d.ts"
    if not os.path.isfile(graphViewModelPath):
        raise Exception("Cannot find GraphViewModel.d.ts")
    fileContents = None
    with open(graphViewModelPath, "r") as reader:
        fileContents = reader.read().replace("JQueryPromise", "JQueryPromise<any>")
    if fileContents:
        with open(graphViewModelPath, "w") as writer:
            writer.write(fileContents)

if __name__ == "__main__":
    main()
