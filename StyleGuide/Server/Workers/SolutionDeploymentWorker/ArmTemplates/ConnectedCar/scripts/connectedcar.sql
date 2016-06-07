--Create Tables
IF (EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_NAME = 'AggresiveDrivingModelReport'))
begin
drop Table [dbo].[AggresiveDrivingModelReport]
end
GO

CREATE TABLE [dbo].[AggresiveDrivingModelReport](
	[Id]    [int] IDENTITY(1,1) NOT NULL,
	[vin]   [nvarchar](256) NULL,
	[model] [nvarchar](256) NULL,
	[timestamp] [nvarchar](256) NULL,
	[city]  [nvarchar](256) NULL,
	[speed] [int]  NULL,
	[transmission_gear_position] [nvarchar](256) NULL,
	[brake_pedal_status] [int] 	       NULL,
	[Year] [int] NULL,
	[Month] [int] NULL
 CONSTRAINT [PK_AggresiveDrivingModelReport] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO

IF (EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_NAME = 'FuelEfficientDrivingModelReport'))
begin
drop Table [dbo].[FuelEfficientDrivingModelReport]
end
GO

CREATE TABLE [dbo].[FuelEfficientDrivingModelReport](
	[Id]    [int] IDENTITY(1,1) NOT NULL,
	[vin]   [nvarchar](256) NULL,
	[model] [nvarchar](256) NULL,
	[city]  [nvarchar](256) NULL,
	[speed] [int]  NULL,
	[transmission_gear_position] [nvarchar](256) NULL,
	[brake_pedal_status] [int] 	       NULL,
	[accelerator_pedal_position] [int] NULL,
	[Year] [int] NULL,
	[Month] [int] NULL
 CONSTRAINT [PK_FuelEfficientDrivingModelReport] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO

IF (EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_NAME = 'RecallModelReport'))
begin
drop Table [dbo].[RecallModelReport]
end
GO

CREATE TABLE [dbo].[RecallModelReport](
	[Id]    [int] IDENTITY(1,1) NOT NULL,
	[vin]   [nvarchar](256)  NULL,
	[model] [nvarchar](256) NULL,
	[city] [nvarchar](256) NULL,
	[outsidetemperature]  [int] NULL,
	[enginetemperature] [int]  NULL,
	[speed] [int] NULL,
	[year] [int] NULL,
	[month] [int] NULL
 CONSTRAINT [PK_RecallModelReport] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO

IF (EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_NAME = 'RealTimeVehicleHealthReport'))
begin
drop Table [dbo].[RealTimeVehicleHealthReport]
end
GO

CREATE TABLE [dbo].[RealTimeVehicleHealthReport](
	[Id]    [int] IDENTITY(1,1) NOT NULL,
	[model] [nvarchar](256) NULL,
	[city]  [nvarchar](256) NULL,
	[cars]  [nvarchar](256) NULL,
	[engineTemperature]  [decimal] NULL,
	[Speed]  [decimal] NULL,
	[Fuel]  [decimal] NULL,
	[EngineOil] [decimal] NULL,
	[TirePressure] [decimal] NULL,
	[Odometer] [decimal] NULL
 CONSTRAINT [PK_RealTimeVehicleHealthReport] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
