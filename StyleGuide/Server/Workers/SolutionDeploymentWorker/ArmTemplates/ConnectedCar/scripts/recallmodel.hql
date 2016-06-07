set hive.input.dir.recursive=true;
set hive.mapred.supports.subdirectories=true;
set hive.supports.subdirectories=true;
set mapred.input.dir.recursive=true;

DROP TABLE IF EXISTS CarEventsAnomaly; 
CREATE EXTERNAL TABLE CarEventsAnomaly 
(
            			vin						string,
				model						string,
				gendate						string,
				outsidetemperature				string,
				enginetemperature				string,
				speed						string,
				fuel						string,
				engineoil					string,
				tirepressure					string,
				odometer					string,
				city						string,
				accelerator_pedal_position			string,
				parking_brake_status				string,
				headlamp_status					string,
				brake_pedal_status				string,
				transmission_gear_position			string,
				ignition_status					string,
				windshield_wiper_status				string,
				abs  						string,
				maintenanceLabel				string,
				maintenanceProbability				string,
				RecallLabel					string,
				RecallProbability				string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:ANOMALYOUTPUT}';

DROP TABLE IF EXISTS RecallModel; 
CREATE EXTERNAL TABLE RecallModel 
(

				vin						string,
				model						string,
				city						string,
				outsidetemperature				string,
				enginetemperature				string,
				speed						string,
            			Year						string,
				Month						string				
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:RECALLMODELOUTPUT}';



INSERT OVERWRITE TABLE RecallModel
select
vin,
model,
city,
outsidetemperature,
enginetemperature,
speed,
"${hiveconf:Year}" as Year,
"${hiveconf:Month}" as Month
from CarEventsAnomaly
where RecallLabel = '1' AND RecallProbability >= '0.60'


