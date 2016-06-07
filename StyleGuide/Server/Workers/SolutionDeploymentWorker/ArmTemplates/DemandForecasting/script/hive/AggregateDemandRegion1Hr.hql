SET hive.exec.dynamic.partition=true;
SET hive.exec.dynamic.partition.mode = nonstrict;
set hive.cli.print.header=true;

DROP TABLE IF EXISTS TopologyGeo; 
CREATE EXTERNAL TABLE TopologyGeo
(
	RegionId					string,	
	SubStationId					string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:TOPOLOGYREFINPUT}'
tblproperties ("skip.header.line.count"="1");

DROP TABLE IF EXISTS PartitionedEnergyDemand30Sec; 
CREATE EXTERNAL TABLE PartitionedEnergyDemand30Sec
(
	Timestamp				timestamp,
	SubStationId				string,
	Load					string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' STORED AS TEXTFILE 
LOCATION '${hiveconf:PARTITIONEDINPUT}/date=${hiveconf:CurrDate}/hour=${hiveconf:CurrHour}'
tblproperties ("skip.header.line.count"="1");

DROP TABLE IF EXISTS AggregatedEnergyDemandRegion1hr; 
CREATE EXTERNAL TABLE AggregatedEnergyDemandRegion1hr
(
	Timestamp				timestamp,
	RegionId				string,
	Load						string
) 
partitioned by (date string, hour string) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:AGGREGATEDOUTPUT}';

INSERT OVERWRITE TABLE AggregatedEnergyDemandRegion1hr PARTITION (date, hour)
select A.Timestamp,B.RegionId,Sum(Load),
	'${hiveconf:CurrDate}' as date,  
	lpad('${hiveconf:CurrHour}', 2, '0') as hour
from 
   (
	SELECT substationid,
		concat(to_date(Timestamp),' ', lpad(Hour(Timestamp), 2, '0') ,':00:00') as Timestamp,
		avg(load) as Load
	FROM PartitionedEnergyDemand30Sec 
	WHERE to_date(Timestamp) =  '${hiveconf:CurrDate}' 
		AND Hour(Timestamp) = ${hiveconf:CurrHour}
	group by substationid,concat(to_date(Timestamp),' ', lpad(Hour(Timestamp), 2, '0') ,':00:00') 
	) as A, TopologyGeo B
WHERE A.substationId = b.substationId 
Group by A.Timestamp, B.RegionId;