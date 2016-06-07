DROP TABLE IF EXISTS CarEventsAnomaly; 
CREATE EXTERNAL TABLE CarEventsAnomaly 
(
            	vin							string,
				model						string,
				timestamp					string,
				outsidetemperature			string,
				enginetemperature			string,
				speed						string,
				fuel						string,
				engineoil					string,
				tirepressure				string,
				odometer					string,
				city						string,
				accelerator_pedal_position	string,
				parking_brake_status		string,
				headlamp_status				string,
				brake_pedal_status			string,
				transmission_gear_position	string,
				ignition_status				string,
				windshield_wiper_status		string,
				abs  						string,
				gendate						string,
				enginetempanomaly			string,
				speedanomaly				string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:ANOMALYINPUT}';

DROP TABLE IF EXISTS CarEventsAnomalyagg; 
CREATE EXTERNAL TABLE CarEventsAnomalyagg 
(
                Year						string,
				Month						string,
    			model						string,
				enginetempanomalyagg		string,
				speedanomalyagg				string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:ANOMALYAGGOUTPUT}';

INSERT OVERWRITE TABLE CarEventsAnomalyagg 
select
"${hiveconf:Year}" as Year,
"${hiveconf:Month}" as Month,
model,
count(case when enginetempanomaly = 1 then 1 ELSE NULL END) as enginetempanomalyagg,
count(case when speedanomaly = 1 then 1 ELSE NULL END) as speedanomaly
from CarEventsAnomaly
group by model;