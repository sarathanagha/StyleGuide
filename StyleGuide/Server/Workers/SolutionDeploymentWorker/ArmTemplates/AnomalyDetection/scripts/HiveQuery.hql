SET hive.exec.dynamic.partition.mode=nonstrict;
SET skip.header.line.count = 1;
SET hive.exec.max.dynamic.partitions=100000;
SET hive.exec.max.dynamic.partitions.pernode=100000;

CREATE EXTERNAL TABLE IF NOT EXISTS HiveIn 
(
    hostname string,
    metricname string,
    value double, 
    time string
) 
PARTITIONED BY (datetimeid string) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' 
LOCATION '${hiveconf:Input}';

MSCK REPAIR TABLE HiveIn;

CREATE EXTERNAL TABLE IF NOT EXISTS HiveOut 
(    
    Time   string, 
    Data    double
)
PARTITIONED BY (hostmetricname string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'
STORED AS TEXTFILE LOCATION '${hiveconf:Output}';

INSERT OVERWRITE TABLE HiveOut PARTITION (hostmetricname)
Select HiveIn.time, HiveIn.value, CONCAT(regexp_replace(hostname, '[^a-zA-Z0-9]+', '') , '-', regexp_replace(metricname, '[^a-zA-Z0-9]+', '')) as hostmetricname FROM HiveIn
WHERE datetimeid >= '${hiveconf:StartTime}' AND datetimeid <= '${hiveconf:EndTime}'
    AND unix_timestamp(CONCAT(SUBSTR(HiveIn.time,1, 10), ' ',SUBSTR(HiveIn.time,12, 19))) > unix_timestamp('${hiveconf:StartTimeInMin}')
    AND unix_timestamp(CONCAT(SUBSTR(HiveIn.time,1, 10), ' ',SUBSTR(HiveIn.time,12, 19))) <= unix_timestamp('${hiveconf:EndTimeInMin}') 
ORDER BY HiveIn.time
;