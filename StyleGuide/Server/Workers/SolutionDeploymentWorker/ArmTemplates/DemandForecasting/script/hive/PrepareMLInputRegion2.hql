SET hive.exec.dynamic.partition=true;
SET hive.exec.dynamic.partition.mode = nonstrict;
set hive.cli.print.header=true;
SET hive.exec.max.dynamic.partitions=2048;
SET hive.exec.max.dynamic.partitions.pernode=256;

DROP TABLE IF EXISTS TopologyGeoRegion2; 
CREATE EXTERNAL TABLE TopologyGeoRegion2
(
	RegionId					string,	
	SubStationId					string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:TOPOLOGYREFINPUT}';

DROP TABLE IF EXISTS AggregatedEnergyDemandHistory1hrRegion2; 
CREATE EXTERNAL TABLE AggregatedEnergyDemandHistory1hrRegion2
(
	Timestamp				timestamp,
	RegionId				string,
	Load						string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:AGGHISTORYDEMANDINPUT}'; 

DROP TABLE IF EXISTS AggregatedEnergyDemand1hrRegion2; 
CREATE EXTERNAL TABLE AggregatedEnergyDemand1hrRegion2
(
	Timestamp				string,
	RegionId				string,
	Load						string
) 
partitioned by (date string, hour int) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:AGGDEMANDINPUT}';

MSCK REPAIR TABLE AggregatedEnergyDemand1hrRegion2;

DROP TABLE IF EXISTS IntermediateMLInputDataRegion2; 
CREATE EXTERNAL TABLE IntermediateMLInputDataRegion2
(
	Timestamp				string,
	RegionId				string,
	Load					string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:PREPOUTPUT}';

INSERT OVERWRITE TABLE IntermediateMLInputDataRegion2
	Select Timestamp, RegionId, Load from (
		select Timestamp, RegionId, Load, date, hour FROM AggregatedEnergyDemand1hrRegion2 
		UNION ALL
		select Timestamp, RegionId, Load, to_date(Timestamp) as date, Hour(Timestamp) as hour from AggregatedEnergyDemandHistory1hrRegion2
	) A 
	WHERE RegionId = ${hiveconf:RegionId} AND
		date >= DATE_ADD('${hiveconf:PrevDate}', -365*2) and date <= '${hiveconf:PrevDate}'
		