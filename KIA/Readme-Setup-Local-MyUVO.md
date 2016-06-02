
# [How To Setup Local UVO Dashboad] (https://stg.myuvo.com/)


## Overview

This guide is about installing the software needed to run UVO Dashboard on a local Windows development machine. This information is in Confluence Wiki section [???](???), the **Readme-** files in UVO Wiki section [???](???) and in filename **Readme-Setup-Local-Dashboard.md** in root directory of source code tree.

### Assumptions

* Instructions tested on Windows 7 and 8.1 Professional (with requirements.win.txt)
* Software is installed by person with Administrator privledges on the computer.
* User Account Control (UAC) is enabled.

### Using Bash Shell or Command Prompt

* Suggest running **npm**, **grunt** commands at **NodeJS DOS Command Prompt**
* Suggest running **git**, **bash** commands at **Git Bash Shell Prompt**


## Install NodeJS for Windows

### To Download Latest 10.x version

It is ok to get latest 10.x series version of NodeJS
Latest stable 10.x series can be found at
http://blog.nodejs.org/
Look for Node v0.10.36 (Stable) toward the bottom of page.
Select either
**Windows Installer: http://nodejs.org/dist/v0.10.36/node-v0.10.36-x86.msi**
**Windows x64 Installer: http://nodejs.org/dist/v0.10.36/x64/node-v0.10.36-x64.msi**

### Instructions

* Start the NodeJS installer
* Use all defaults

### Recreate Windows Icon

In certain cases an icon for the **NodeJS DOS Command Prompt** will not be created on your desktop.
The icon configuration would be as follows:

Label:
```NodeJS 10.36```
Target:
```C:\Windows\System32\cmd.exe /k "C:\Users\HIS?????\Software\nodejs\nodevars.bat"```
Start in local development source code branch:
```C:\Users\HIS?????\devel\src\myuvo-responsive\ccw-responsive\pl```
Or start in %HOME% directory:
```C:\Users\HIS?????\```
Or...

### Configure Command Prompt

* Start **NodeJS DOS Command Prompt** (double click NodeJS 10.36 desktop icon)
* Click on command prompt icon at upper, left corner of window
* Click on Defaults
* In Layout Tab, set Screen Buffer Size, Width: 120, Height: 9999; set Width: 120, Height: 25
* In Options Tab, set Buffer Size: 999, and Select (e.g., check) all the Edit Options
* Can Paste via right click
* Can Copy by hightlight, then Enter key

### Un-Hide Local AppData Folder

It is not a simple task to either list globally installed NodeJS packages or to update those globally installed all at once. In general, it is recommended that you run `npm cache clear` prior to any global updates, and only update global packages individually. To find globally installed packages it is easyest to simply view folders in C:\Users\HIS?????\AppData\Roaming\npm\node_modules.

#### Viewing Global NPM Packages in AppData

Show hidden files, folders
  Open Windows Explorer
  Click on Organize -> Folder and search options
  In Folder Options dialog click on View Tab, then
  Click Show hidden files, folders and drives radio button, then
  Click Ok button
Un-Hide AppData folder
  Right click on C:\Users\HIS?????\AppData
  Select Properties
  In AppData Properties dialog un-check Hidden in Attributes: section
  Click Ok button
Hide hidden files, folders
  Open Windows Explorer
  Click on Organize -> Folder and search options
  In Folder Options dialog click on View Tab, then
  Click Don't show hidden files, folders and drives radio button, then
  Click Ok button

### Updating npm Example

Verify npm is global by looking in %HOME%\AppData\Roaming\npm\node_modules

```
npm cache clear
npm install -g grunt-cli
```

Note: npm is only package that requires usage of **install** rather than **update**, and after updating npm it is recommended other global package are updated as well. It has been the authors experience npm updates can mess bower installs in particular.

### Installing bower, grunt-cli Example

[Grunt](http://gruntjs.com/) is a JavaScript Task Runner, with preforms registered tasks in **Gruntfile.coffee**. We use it to convert **SASS** into **CSS** and convert **Handlebars** into **HTML**
[Bower](http://bower.io/) works by fetching and installing packages from all over, taking care of hunting, finding, downloading, and saving the stuff you’re looking for. Bower keeps track of these packages in a manifest file, **bower.json**

Start **NodeJS Command Prompt** (double click NodeJS icon) and type in DOS command:

```
$ npm install -g bower
$ npm install -g grunt-cli
```

If Error: ENOENT, stat 'C:\Users\HIS?????\AppData\Roaming\npm, then create the npm directory

### Updating bower, grunt-cli Example

Verify grunt-cli, bower is global by looking in AppData\Roaming\npm\node_modules

```
$ npm cache clear
$ m update -g bower
$ m cache clear
$ m update -g grunt-cli
```

### Upgrading NodeJS

It is ok to download the latest version of NodeJS, and install it right over the top of an existing install (install in same directory as last NodeJS install). Will need to manually update Icon properties with correct version number.



## Install Ruby for Windows

Ruby 2.x install failed on my Kia devel box both over VPN and on-site over wireless because all gem update/install would fatal error with SSL related message.

Suggested that all development software be placed in C:\Users\HIS?????\Software\... such as \TortiseSVN, \NodeJS, \Ruby193 \Git (for its MSys bash shell) as well as stuff \Emacs24 and \WinMerge. You milage my vary...

Ruby install dir cannot have spaces...

### Ruby 1.9.3 install

Visit: http://rubyinstaller.org/downloads/
Select latest 1.x installer, for example
1.9.3-p551
Download, Run rubyinstaller-1.9.3-p551.exe
Click Browse... button and install in:
C:\Users\HIS?????\Software\Ruby193
In Dialog Installation Destination and Optional Task
Check option Add Ruby Executable to your PATH
Check option Associate .rb and .rbw files with this Ruby installation
After install Path and PATHEXT Windows Environment User Variables would look like
C:\Users\HIS?????\Software\Ruby193
PATHEXT %PATHEXT%;.RB;.RBW

### Ruby Build Tools install

Find detailed instructions just below, but brief instructions follow
https://github.com/oneclick/rubyinstaller/wiki/Development-Kit
Visit site below and in section DEVELOPMENT KIT select .exe under "For use with Ruby 1.8.7 and 1.9.3"
http://rubyinstaller.org/downloads/
Run DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe and extract to
C:\Users\HIS?????\Software\Ruby193-DevKit
Change Path, of Windows Environment User Variables for HIS????? by adding
C:\Users\HIS?????\Software\Ruby193-DevKit
Start new Ruby Cmd Shell, and Run commands to build

```
ruby dk.rb init
ruby dk.rb install
```

After install Path Windows Environment User Variable would look like

```
C:\Users\HIS?????\Software\Ruby193
C:\Users\HIS?????\Software\Ruby193-DevKit
```

### SASS, Compass install (Compass will get appropriate SASS version for itself)
```
gem update
gem update --system
ruby -rubygems -e "require 'json'; puts JSON.load('[42]').inspect"
gem install compass
```

### Windows Environment User Variables

A complete Windows Environment User Variables (not System Variables) might look like:

```
HOME          C:\Users\HIS93301
Path          C:\Users\HIS93301\Software\NodeJS\;C:\Users\HIS93301\AppData\Roaming\npm;C:\Users\HIS93301\Software\Ruby193\bin;C:\Users\HIS93301\Software\Ruby193-DevKit;C:\GTMS\Java\jdk1.6.0_25_x64\bin;C:\GTMS\apache-maven-3.2.1\bin;C:\Users\HIS93301\Software\TortoiseSVN\bin;C:\Users\HIS93301\Software\Git\cmd;C:\Users\HIS93301\Software\Git\bin;C:\Users\HIS93301\Software\Emacs24\bin;C:\Users\HIS93301\bin
PATHEXT       %PATHEXT%;.RB;.RBW
```

### Using sass-convert



## Install Git for Windows

### To Download Latest

Note: it is ok to get latest version of Git
Visit website: http://git-scm.com/download/win
Save the .exe file to your computer

### Instructions

* Start the Git installer
* When Adjust your PATH environment appears, select Use Git and optional Unix tools from the Windows Command Prompt
* When Configuring the line ending conversions appears, select Checkout Windows-style, commit Unix-style line endings
* If Choosing the SSH executable appears, you have installed OpenSSH, so select Use OpenSSH
* After installation, create a Windows environment, User variable named HOME with value like C:\Users\MyName

### Configure Git Shell

* Start **Git Bash Shell** (double click Git 1.9.5 desktop icon)
* Click on Git desktop icon at upper, left corner of window
* Click on Defaults...
* In Layout Tab, set Screen Buffer Size, Width: 120, Height: 9999; set Width: 120, Height: 25
* In Options Tab, set Buffer Size: 999, Check (e.g., select) all Edit Options
* Can Paste via right click
* Can Copy by hightlight, then Enter key

### Enabling Bash Command History

Files ~/.profile, ~/.bashrc, ~/.bash_history must be unix files like utf-8-auto-unix, iso-latin-1-unix

### Upgrading

It is ok to download the latest version of Git, and install it right over the top of an existing install (install in same directory as last Git install). Will need to manually update desktop icon properties (right click) with correct version number.


