SET hive.exec.dynamic.partition=true;
SET hive.exec.dynamic.partition.mode = nonstrict;
set hive.cli.print.header=true;


DROP TABLE IF EXISTS RawCarEvents; 
CREATE EXTERNAL TABLE RawCarEvents 
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
                
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:RAWINPUT}'; 

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
) partitioned by (YearNo int, MonthNo int) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:PARTITIONEDOUTPUT}';

DROP TABLE IF EXISTS Stage_RawCarEvents; 
CREATE TABLE IF NOT EXISTS Stage_RawCarEvents 
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
				YearNo 						int,
				MonthNo 					int) ROW FORMAT delimited fields terminated by ',' LINES TERMINATED BY '10';

INSERT OVERWRITE TABLE Stage_RawCarEvents
SELECT
	vin,			
	model,
	timestamp,
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
	abs,
	gendate,
	Year(gendate),
	Month(gendate)

FROM RawCarEvents WHERE Year(gendate) = ${hiveconf:Year} AND Month(gendate) = ${hiveconf:Month}; 

INSERT OVERWRITE TABLE PartitionedCarEvents PARTITION(YearNo, MonthNo) 
SELECT
	vin,			
	model,
	timestamp,
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
	abs,
	gendate,
	YearNo,
	MonthNo
FROM Stage_RawCarEvents WHERE YearNo = ${hiveconf:Year} AND MonthNo = ${hiveconf:Month};
