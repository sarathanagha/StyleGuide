To compile me, you need to do the following:

Prerequisites:
1. npm
https://nodejs.org/download/

2. g i t

3. bower
From your command line:
>> npm install -g bower

4. typescript
http://www.typescriptlang.org/#Download
From your command line:
>> npm install -g typescript

5. Python 2.7
https://www.python.org/downloads/

6. Task Runner Explorer extension for Visual studio 2013

Compilation:
If you hve compiled the shell previously, you need to clean up the generated files.
It is best to run scorch from the root folder, however if you find issues running scorch then
delete the POCDataStudio folder and force resync from TFS

Now compile the shell as follows:

a. In the root folder, run the following script
install-packages
b. In the DataStudio\src folder, run:
gulp
c. In the DataStudio\src folder, run:
http-server -c1
Launch http://localhost:8080

To compile your module, do the following:

a. In "Modules\Blueprint" folder, open the solution and launch task runner and then do a build 
b. In "Modules\DataFactory" folder, open the solution and launch task runner and then do a build
c. In "Modules\MachineLearning" folder, open the solution and launch task runner and then do a build
d. In "Modules\StreamAnalytics" folder, open the solution and launch task runner and then do a build

If you want to change the code in your module, please run the following command e.g:
in the Modules\Blueprint folder, do:
atlas-attach-module.cmd
and now you can open solution and use VS for debugging

UPDATING THE TAR FILE FOR A MODULE:
* Go to Module\<name>\src folder
* Compile using gulp
* Run "npm pack", which would generate the tar file in same folder
* Update the version number in the filename
* Add it to the ./npm folder (sibling to DataStudio folder) and remove the older tar
* Update DatasStudio/src/package.json
* Run "npm unlink <module name>" in DataStudio/src/node_modules
* Run "gulp" in DataStudio/sr, which will reinstall the dependency.
* Verify.
