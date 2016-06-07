IF OBJECT_ID('dbo.sp_LoadScoreResult', 'P') IS NOT NULL
  DROP PROCEDURE [dbo].[sp_LoadScoreResult]
GO

IF OBJECT_ID('dbo.sp_LoadDemand', 'P') IS NOT NULL
  DROP PROCEDURE [dbo].[sp_LoadDemand]
GO

IF OBJECT_ID('dbo.sp_LoadHistorcialDemand', 'P') IS NOT NULL
  DROP PROCEDURE [dbo].[sp_LoadHistorcialDemand]
GO

IF TYPE_ID('dbo.DemandForecastHourlyType') IS NOT NULL
  DROP TYPE [dbo].[DemandForecastHourlyType]
GO

IF TYPE_ID('dbo.DemandRealHourlyType') IS NOT NULL
  DROP TYPE [dbo].[DemandRealHourlyType]
GO

IF OBJECT_ID('dbo.v_24HrsForecastPointError', 'V') IS NOT NULL
  DROP PROCEDURE [dbo].[v_24HrsForecastPointError]
GO

IF OBJECT_ID('dbo.v_24hrsForecastHorizonError', 'V') IS NOT NULL
  DROP PROCEDURE [dbo].[v_24hrsForecastHorizonError]
GO

IF OBJECT_ID('dbo.DemandRealHourly', 'U') IS NOT NULL
  DROP TABLE [dbo].[DemandRealHourly]
GO

IF OBJECT_ID('dbo.DemandForecastHourly', 'U') IS NOT NULL
  DROP TABLE [dbo].[DemandForecastHourly]
GO

CREATE TABLE [dbo].[DemandRealHourly] (
    [Timestamp] DATETIME   NOT NULL,
    [RegionId]      varchar(64)     NOT NULL,
    [Load]  FLOAT (53) NULL,
    CONSTRAINT [PK_DemandRealHourly] PRIMARY KEY CLUSTERED ( [Timestamp] ASC, [RegionId] ASC)
);
go

CREATE TABLE [dbo].[DemandForecastHourly] (
    [Timestamp] DATETIME   NOT NULL,
    [RegionId]      varchar(64)      NOT NULL,
    [Horizon]  smallint NULL,
    [Forecast]  FLOAT (53) NULL,
    [Hi95]  FLOAT (53) NULL,
    [Lo95]   FLOAT (53)     NULL,
    [Runtime] DATETIME   NOT NULL,
    CONSTRAINT [PK_DemandForecastHourly] PRIMARY KEY CLUSTERED ([Timestamp] ASC, [RegionId] ASC, RunTime ASC)
);
go

IF OBJECT_ID('dbo.Region', 'U') IS NOT NULL
  DROP TABLE [dbo].[Region]
GO

CREATE TABLE [dbo].[Region] (
    [RegionId]      varchar(64)      NOT NULL,
    [Name]      varchar(100)     NOT NULL,
    [TimeZone] varchar(100)    NOT NULL,
    [Latitude]  FLOAT (53) NULL,
    [Longitude]  FLOAT (53) NULL,
    [Unit]   varchar(64)     NULL,
    CONSTRAINT [PK_Region] PRIMARY KEY CLUSTERED ([RegionId] ASC)
);
GO

IF OBJECT_ID('dbo.Substation', 'U') IS NOT NULL
  DROP TABLE [dbo].[Substation]
GO

CREATE TABLE [dbo].[Substation] (
    [SubStationId]      varchar(64)      NOT NULL,
    [Name]      varchar(100)     NOT NULL,
    [TimeZone] varchar(100)    NOT NULL,
    [Layer]  INT NULL,
    [Unit]   varchar(64)     NULL,
    CONSTRAINT [PK_Substation] PRIMARY KEY CLUSTERED ([SubStationId] ASC)
);
Go

IF OBJECT_ID('dbo.Topology', 'U') IS NOT NULL
  DROP TABLE [dbo].[Topology]
GO

CREATE TABLE [dbo].[Topology] (
    [RegionId]      varchar(64)      NOT NULL,
    [SubStationId]      varchar(64)      NOT NULL,
    CONSTRAINT [PK_Topology] PRIMARY KEY CLUSTERED ([SubStationId] ASC)
);
go

IF OBJECT_ID('dbo.DataReadyHistorical', 'U') IS NOT NULL
  DROP TABLE [dbo].[DataReadyHistorical]
GO

CREATE TABLE [dbo].[DataReadyHistorical] (
    [id]        int not null,
    [historicaldata_ready]      int      NOT NULL
    CONSTRAINT [PK_DataReadyHistorical] PRIMARY KEY CLUSTERED ([Id] ASC)
);
go

IF OBJECT_ID('dbo.DataReady', 'U') IS NOT NULL
  DROP TABLE [dbo].[DataReady]
GO

CREATE TABLE [dbo].[DataReady] (
    [id]        int not null,
    [PrevHour_ready]      int      NOT NULL,
    CONSTRAINT [PK_DataReady] PRIMARY KEY CLUSTERED ([Id] ASC)
);
go

CREATE TYPE [dbo].[DemandForecastHourlyType] 
AS TABLE(
    [Timestamp] DATETIME   NOT NULL,
    [RegionId]      varchar(64)      NOT NULL,
    [Horizon]  FLOAT (53) NULL,
    [Forecast]  FLOAT (53) NULL,
    [Hi95]  FLOAT (53) NULL,
    [Lo95]   FLOAT(53)     NULL,
    [Runtime] DATETIME   NOT NULL
);
GO

CREATE PROCEDURE [dbo].[sp_LoadScoreResult]
      @DemandForecastHourly DemandForecastHourlyType READONLY
AS
BEGIN
	SET NOCOUNT ON;
	INSERT into DemandForecastHourly (timestamp, Regionid, Horizon, forecast, hi95, lo95,runtime)
	SELECT source.timestamp,source.Regionid, source.Horizon,  source.forecast, source.hi95, source.lo95,source.runtime from @DemandForecastHourly as source;
END;
Go

CREATE TYPE [dbo].[DemandRealHourlyType] 
AS TABLE(
    [Timestamp] DATETIME   NOT NULL,
    [RegionId]      varchar(64)      NOT NULL,
    [Load]  FLOAT (53) NULL
);
GO


CREATE PROCEDURE [dbo].[sp_LoadDemand]
      @DemandRealHourly DemandRealHourlyType READONLY
AS
BEGIN
	SET NOCOUNT ON;
	delete DataReady;
	MERGE DemandRealHourly AS target
		USING (SELECT * from @DemandRealHourly) AS source
		ON (target.RegionId = source.Regionid and target.timestamp=source.timestamp)
		WHEN MATCHED THEN 
			UPDATE SET load= source.load
		WHEN NOT MATCHED THEN
			INSERT (Regionid, timestamp, Load)
			VALUES (source.Regionid, source.timestamp, source.Load);

	insert into DataReady values(1,1);

END;
Go

CREATE PROCEDURE [dbo].[sp_LoadHistorcialDemand]
      @DemandRealHourly DemandRealHourlyType READONLY
AS
BEGIN
	SET NOCOUNT ON;
	delete from DataReadyHistorical;
	delete from DemandRealHourly;
	insert into DemandRealHourly SELECT * from @DemandRealHourly;

	insert into DataReadyHistorical values(1,1);
	insert into DataReady values(1,1);
END;
Go

CREATE VIEW [dbo].[v_24hrsForecastHorizonError]
	AS (
select a.TimeStamp, a.RunTime, a.RegionId, c.Name, a.Forecast, a.Horizon, b.Load as Demand, 
	  a.Hi95, a.Lo95, abs(b.Load-a.Forecast)/b.Load*100 as APE, (b.Load-a.Forecast) as Error 
from 
(select TimeStamp, RegionId, Forecast, Horizon, RunTime, Hi95, Lo95 from DemandForecastHourly) a
left join
(select * from DemandRealHourly) b
on a.TimeStamp = b.TimeStamp and a.RegionId=b.RegionId
join Region c
on a.RegionId = c.RegionId
);
go

CREATE VIEW [dbo].[v_24HrsForecastPointError]
	AS 
select  a.TimeStamp, a.RegionId, a.Demand, a.Forecast, a.RunTime, a.Horizon, a.Hi95, a.Lo95, a.APE, a.Error, a.Name, b.Latitude,b.Longitude from 
(
	SELECT TimeStamp, RegionId, Name, Demand, Forecast, RunTime, Horizon, Hi95, Lo95, APE, Error 
	FROM (
		SELECT *, ROW_NUMBER() OVER (PARTITION BY TimeStamp, RegionId ORDER BY RunTime DESC) AS RowNum
		FROM v_24hrsForecastHorizonError
		where convert(varchar(10),TimeStamp,110)>=convert(varchar(10), DATEADD(day, -2, GETDATE()), 110)
	) a
	WHERE RowNum=1
) a
join Region b
on a.RegionId= b.RegionId;
go
