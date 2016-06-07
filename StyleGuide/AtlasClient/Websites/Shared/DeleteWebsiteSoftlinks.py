import os;

def main():
    websitesDir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir));
    os.chdir(websitesDir);

    for link in os.popen("DIR /S /B /AL").readlines():
        link = link.rstrip('\n');
        print "Removing soft link \"{0}\"".format(link);
        os.system("RMDIR \"{0}\"".format(link));

    return;

if __name__ == "__main__":
    main();
