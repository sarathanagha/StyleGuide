DROP TABLE IF EXISTS PartitionedCarEvents; 
CREATE EXTERNAL TABLE PartitionedCarEvents
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
				gendate						string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:PARTITIONEDINPUT}';

DROP TABLE IF EXISTS CarEventsAggresive; 
CREATE EXTERNAL TABLE CarEventsAggresive
(
               	vin 						string, 
				model						string,
                timestamp					string,
				city						string,
				speed 			 			string,
				transmission_gear_position	string,
				brake_pedal_status			string,
				Year						string,
				Month						string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:AGGRESIVEOUTPUT}';

INSERT OVERWRITE TABLE CarEventsAggresive
select
vin,
model,
timestamp,
city,
speed,
transmission_gear_position,
brake_pedal_status,
"${hiveconf:Year}" as Year,
"${hiveconf:Month}" as Month
from PartitionedCarEvents
where transmission_gear_position IN ('fourth', 'fifth', 'sixth', 'seventh', 'eight') AND brake_pedal_status = '1' AND speed >= '50'