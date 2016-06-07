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

DROP TABLE IF EXISTS FuelEfficientDriving; 
CREATE EXTERNAL TABLE FuelEfficientDriving
(
               	vin 						string, 
				model						string,
               	city						string,
				speed 			 			string,
				transmission_gear_position	string,
				brake_pedal_status			string,
				accelerator_pedal_position	string,
				Year						string,
				Month						string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:FUELEFFICIENTOUTPUT}';

INSERT OVERWRITE TABLE FuelEfficientDriving
select
vin,
model,
city,
speed,
transmission_gear_position,
brake_pedal_status,
accelerator_pedal_position,
"${hiveconf:Year}" as Year,
"${hiveconf:Month}" as Month
from PartitionedCarEvents
where transmission_gear_position IN ('fourth', 'fifth', 'sixth', 'seventh', 'eight') AND parking_brake_status = '0' AND brake_pedal_status = '0' AND speed <= '60' AND accelerator_pedal_position >= '50'