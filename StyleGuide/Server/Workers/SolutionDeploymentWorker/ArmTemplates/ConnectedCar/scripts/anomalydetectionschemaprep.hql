set hive.input.dir.recursive=true;
set hive.mapred.supports.subdirectories=true;
set hive.supports.subdirectories=true;
set mapred.input.dir.recursive=true;

DROP TABLE IF EXISTS RawCarEvents; 
CREATE EXTERNAL TABLE RawCarEvents 
(
            	vin								string,
				model						string,
				timestamp					string,
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
				gendate						string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:PARTITIONEDINPUT}';

DROP TABLE IF EXISTS CarEventsAnomaly; 
CREATE EXTERNAL TABLE CarEventsAnomaly 
(
            	vin								string,
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
				abs  						string
                                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:PREPOUTPUT}';



INSERT OVERWRITE TABLE CarEventsAnomaly
select
	vin,			
	model,
	gendate,
	outsidetemperature,
	enginetemperature,
	speed,
	fuel,
	engineoil,
	tirepressure,
	odometer,
	city,
	accelerator_pedal_position,
	parking_brake_status,
	headlamp_status,
	brake_pedal_status,
	transmission_gear_position,
	ignition_status,
	windshield_wiper_status,
	abs
from RawCarEvents


