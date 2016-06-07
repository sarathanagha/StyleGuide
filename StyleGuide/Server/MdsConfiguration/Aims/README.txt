This directory has AIMS rules (xml files) that we upload to the MDS production instance for Atlas MDS account

Use these MDS commands for dealing with the AIMS rules,

Listing all rules:
	mds config https://production.diagnostics.monitoring.core.windows.net -mdsaccount:AtlasMdsProdAccess -configkind:aimsruleconfig -command:list

Uploading a rule:
	mds config https://production.diagnostics.monitoring.core.windows.net -mdsaccount:AtlasMdsProdAccess -configkind:aimsruleconfig -command:upload -configfile:<path to your AIMS xml file>

Deleting a rule:
	mds config https://production.diagnostics.monitoring.core.windows.net -mdsaccount:AtlasMdsProdAccess -configkind:aimsruleconfig -command:delete -configid:<the id of the config as displayed in list command>

Downloading a rule:
	mds config https://production.diagnostics.monitoring.core.windows.net -mdsaccount:AtlasMdsProdAccess -configkind:aimsruleconfig -command:listone -configid:<the id of the config as displayed in list command> -includeContent -outputDir:<directory to download the xml rule>
