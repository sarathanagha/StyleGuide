--set hive.cli.print.header=true;
SET skip.header.line.count = 1;


DROP TABLE IF EXISTS TopologyGeoHist; 
CREATE EXTERNAL TABLE TopologyGeoHist
(
	RegionId					string,	
	SubStationId					string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:TOPOLOGYREFINPUT}' 
tblproperties ("skip.header.line.count"="1");

DROP TABLE IF EXISTS RawEnergyDemandHistory; 
CREATE EXTERNAL TABLE RawEnergyDemandHistory
(
	Timestamp				timestamp,
	SubStationId				string,
	Load					string
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:RAWINPUT}'
tblproperties ("skip.header.line.count"="1"); 

DROP TABLE IF EXISTS AggregatedEnergyDemandRegion1hrHist; 
CREATE EXTERNAL TABLE AggregatedEnergyDemandRegion1hrHist
(
	Timestamp				timestamp,
	RegionId				string,
	Load						string
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '10' 
STORED AS TEXTFILE LOCATION '${hiveconf:AGGREGATEDOUTPUT}'; 

INSERT overwrite TABLE AggregatedEnergyDemandRegion1hrHist
SELECT
	Timestamp,
	B.RegionId,
	sum(load) as load
FROM RawEnergyDemandHistory A,TopologyGeoHist B
WHERE A.substationId = b.substationId 
group by Timestamp,B.RegionId ;
