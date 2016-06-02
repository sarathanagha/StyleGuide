(function (uvo) {
    var suppress = false;

    uvo.data = {};
    uvo.dataTypes = {};

    var com = uvo.common;
    var uData = uvo.data;
    var uTypes = uvo.dataTypes;

    function Model(raw) {
        this.load(raw);
        this._rawLoaded = raw;
        return this;
    }

    var momentWithFormat = function withFormat(formatStr) {
        var fn = moment;
        if (typeof formatStr === 'string') {
            fn = function (val) {
                return moment(val, formatStr);
            };
        }
        return fn;
    };

    var primitives = [String, Number, Boolean];

    function collectionOf(Type, raws) {
        var outArray = (raws instanceof Array && raws) || [];

        if (typeof Type !== 'function') {
            throw new Error("Type passed to CollectionOf must be a constructor function");
        }

        var mapFn = Type;

        if (primitives.indexOf(Type) === -1) {
            mapFn = function (val) {
                return new Type(val);
            };
        }

        return outArray.map(mapFn);
    }

    function zeroPadTranslator(count) {
        return function (val) {
            return com.leadZeroes(val, count);
        };
    }

    uTypes.collectionOf = collectionOf;
    uTypes.Model = (function () {

        Model.prototype = {
            load : function (raw) {
                throw new Error("Abstract method Model.load called, please override.");
            }
        };

        function doCasting(definition, value) {
            var outVal = value;

            if (definition.type === Array) {
                if (definition.of && typeof definition.of === 'function') {
                    outVal = collectionOf(definition.of, outVal);
                }
            } else {
                if (typeof definition.translator === 'function') {
                    outVal = definition.translator(outVal);
                }

                if (typeof definition.type === 'function') {
                    if (~primitives.indexOf(definition.type)) {
                        outVal = definition.type(outVal);
                    } else {
                        outVal = new definition.type(outVal);
                    }
                }
            }

            return outVal;
        }

        Model.make = function make(obj, fieldDefinitions) {

            obj.prototype = obj.prototype || Object.create(Model.prototype);

            for (var fld in fieldDefinitions) {
                if (fieldDefinitions.hasOwnProperty(fld)) {
                    if (typeof fieldDefinitions[fld] !== "function") {
                        obj.prototype[fld] = fieldDefinitions[fld].value;
                    } else {
                        obj.prototype[fld] = fieldDefinitions[fld];
                        delete fieldDefinitions[fld];
                    }

                }
            }

            var protoLoad;
            if (typeof obj.prototype.load === "function" && obj.prototype.load !== Model.prototype.load) {
                protoLoad = obj.prototype.load;
            }

            var fnName = (/function +(\w+)\(/i).exec(obj.toString());
            fnName = (fnName && fnName[1]) || obj;

            function load(rawData) {
                if (protoLoad) {
                    protoLoad.apply(this, arguments);
                }

                var i, names, rawVal, found, definition, raw = rawData || {};
                for (var fld in fieldDefinitions) {
                    if (fieldDefinitions.hasOwnProperty(fld)) {

                        definition = fieldDefinitions[fld];
                        names = Array.prototype.concat(fld, definition.names || []);
                        found = false;

                        try {
                            for (i = 0; i < names.length; i++) {
                                if (names[i] in raw) {
                                    rawVal = raw[names[i]];
                                    found = true;
                                    break;
                                }
                            }
                        }
                        catch (err) {
                            console.error("Error loading property: '" + fld + "' when loading object:", fnName);
                        }

                        if (!found && !suppress) {
                            console.warn("defaulting value for property: '" + fld + "' when loading object:", fnName);
                        }

                        this[fld] = doCasting(definition, found ? rawVal : definition.value);
                    }
                }
            }

            obj.prototype.load = load;

            return obj;
        };

        return Model;
    }());
    uTypes.Model.makeResponseModel = function (fieldDef) {
        return Model.make(function ResponseModel() {
            return Model.apply(this, arguments);
        }, fieldDef);
    };
    uTypes.Vehicle = (function () {
        var Vehicle = function () {
            Model.apply(this, arguments);
            return this;
        };

        Vehicle.prototype = Object.create(Model.prototype);

        Vehicle.prototype.uvoEnabled = function uvoEnabled() {
            var enabled = true;

            if (this.fuelType === 4) {
                enabled = this.enrVin === 'A';
            } else if(this.modelName === 'K900' && this.khVehicle === 'K900'){
            	enabled = this.enrVinKh === '4';
            } 
            else{
                if (this.actVin === 'Y') {
                    enabled = false;
                }
            }

            return enabled;
        };
        Vehicle.prototype.getGen = function getGen() {
            var gen = "GEN1";
            if (this.fuelType === 4) {
                gen = "PSEV";
            }else if(this.modelName === 'K900' && this.khVehicle === 'K900'){
            	gen = "KH";
            } 

            return gen;
        };

        Vehicle.prototype.isExpired = function () {
        	if(this.fuelType !== 4){
        		var exp = this.outOfWarranty;
                exp = exp || !this.endOfServiceDate.isAfter(moment(), "day");
                return exp;
        	} else {
        		return this.freeServiceEndDate.isBefore(moment(), "day");
        	}
        	
        };

        return Model.make(Vehicle, {
            "vin"                 : "",
            "modelName"           : {names : "mdlNm"},
            "modelYear"           : {names : "mdlYr" },
            "vehicleCode"         : {names : "vehicleCd"},
            "imageFileName"       : {names : "realImgFileNm", value : "failSafe.PNG"},
            "securityPin"		  : {names : "securityPin"},
            "launchType"		  : {names : "launchType"},
            "endOfServiceDate"    : {names : "endDate", type:moment},
            "scheduledInfoTimeStamp" : {type : moment},
            "vehicleStatusTimeStamp": {type:moment},
            "endOfServiceMileage" : {names : "endMile", type : Number},
            "nickname"            : {names : ["vehNick", "checkNameNull"]},
            "actVin"              : {names : "actVin"},
            "enrVin"              : {names : "enrVin"},
			"enrVinKh"            : {names : "enrVinKh"},
            "fuelType"            : {type : Number},
            "currentOdometer"     : {names : "odometer"},
            "outOfWarranty"       : {names : "wrrtEndMile", type : Boolean},
            "freeServiceStartDate": {names : "freeServiceStartDate", type:moment},
            "freeServiceEndDate"  : {names : "freeServiceEndDate", type:moment},
            "poiCount"            : {names : "poi", type : Number},
            "diagnosticIssues"    : {names : "dtcCnt", type: Number},
            "vehicleStatus"       : {names: "vehicleStatus"},
			"milesToNextService"  : {names : "nextServiceMile", type : Number},
            "odometerReadDate"    : {
                names : "odoUpdate",
                type  : momentWithFormat("MMM DD, YYYY hh:mm A")
            },
            "khVehicle"              : {names : "khVehicle"}

        });
    }());
    uTypes.VehiclesResponse = Model.makeResponseModel({
        "selectedVin" : {type : String },
        "vehicles"    : {type : Array, of : uTypes.Vehicle}
    });
    uTypes.AlertDetail = (function () {
        var AlertDetail = function AlertDetail() {
            Model.apply(this, arguments);

            this.alertPos = new google.maps.LatLng(this.lat, this.lng);
            this.startPos = new google.maps.LatLng(this.strtLat, this.strtLong);
            this.endPos = new google.maps.LatLng(this.stpLat, this.stpLong);

            return this;
        };

        AlertDetail.prototype = Object.create(Model.prototype);
        AlertDetail.prototype.selectedForDeletion = false;
        AlertDetail.prototype.violType = "";

        Model.make(AlertDetail, {
            headerTid       : {
                names : ["headerTid"],
                type  : String
            },
            "lat"           : {names : ["latitude"], type : Number },
            "lng"           : {names : ["longitude"], type : Number },
            "moment"        : {names : "alertDateTime", type : moment},
            "alertTypeCode" : {names : ["alertTypeCode"]},
            driveStart      : {names : ["driveStartTime"], type : moment, value : new Date()},
            driveEnd        : {names : ["driveEndTime"], type : moment, value : new Date()},
            trscSeq         : {names : ["trscSeq"], type : String},
            violSeq         : {names : ["violSeq"], type : String},
            strtLat         : {names : ["strtLat"], type : Number},
            strtLong        : {names : ["strtLong"], type : Number},
            stpLat          : {names : ["stpLat"], type : Number},
            stpLong         : {names : ["stpLong"], type : Number},
            alertHour		: {names : ["alertHour"], type : Number},
            alertMin		: {names : ["alertMin"], type : Number},
        });

        return AlertDetail;
    }());
    uTypes.CurfewAlertDetail = (function () {
        var AlertDetail = uTypes.AlertDetail;

        function CurfewAlertDetail() {
            return AlertDetail.apply(this, arguments);
        }

        CurfewAlertDetail.prototype = Object.create(AlertDetail.prototype);
        CurfewAlertDetail.prototype.violType = "C";

        Model.make(CurfewAlertDetail, {
            "headerTid"   : {names : ["headerTid"]},
            "hataAlertId" : {names : ["hataAlertId"]},
            "curfewId"    : {type : Number},
            "startDay"    : {names : ["startDay"]},
            "endDay"      : {names : ["endDay"]},
            "startTime"   : {
                type       : momentWithFormat("HHmm"),
                translator : zeroPadTranslator(4)
            },
            "endTime"     : {
                type       : momentWithFormat("HHmm"),
                translator : zeroPadTranslator(4)
            }
        });

        return CurfewAlertDetail;

    }());
    uTypes.SpeedAlertDetail = (function () {
        var AlertDetail = uTypes.AlertDetail;

        function SpeedAlertDetail() {
            return AlertDetail.apply(this, arguments);
        }

        SpeedAlertDetail.prototype = Object.create(AlertDetail.prototype);
        SpeedAlertDetail.prototype.violType = "S";
        Model.make(SpeedAlertDetail, {
            alertSpeed  : {names : ["alertSpeed"], type : Number},
            isActive    : {names : ["isActive"], type : Number},
            odometerUom : {names : ["odometerUom"], type : String},
            speed       : {names : ["speed"], type : String}
        });

        return SpeedAlertDetail;
    }());
    uTypes.GeofenceAlertDetail = (function () {
        var AlertDetail = uTypes.AlertDetail;

        function GeofenceAlertDetail() {
            AlertDetail.apply(this, arguments);
            switch(parseInt(arguments[0].radiusUom)){
    		case 0: // ft
    			this.radiusMeters = parseFloat(this.radius) * 0.3048;
    			break;
    		case 1: // km
    			this.radiusMeters = parseFloat(this.radius) * 1000;
    			break;
    		case 2: // m
    			this.radiusMeters = parseFloat(this.radius);
    			break;
    		case 3: // mi
    			this.radiusMeters = parseFloat(this.radius) * 1609.34;
    			break;
    		}
            
            //this.radiusMeters = parseFloat(this.radius) * 1609; //miles to meters. This will need to detect uom later.
            this.circleCenter = new google.maps.LatLng(this.circleCenterLat, this.circleCenterLon);

            return this;
        }

        GeofenceAlertDetail.prototype = Object.create(AlertDetail.prototype);
        GeofenceAlertDetail.prototype.violType = "G";
        return Model.make(GeofenceAlertDetail, {
            circleCenterLat  : {names : ["circleCenterLat"], type : String},
            circleCenterLon  : {names : ["circleCenterLon"], type : String},
            circleCenterAlt  : {names : ["circleCenterAlt"], type : String},
            circleCenterType : {names : ["circleCenterType"], type : String},
            radius           : {names : ["radius"], type : String},
            geoFenceId       : {names : ["geoFenceId"], type : Number}
        });

    }());
    uTypes.TimeUom = (function () {
        function TimeUom() {

        }

        var enumArray = ["minutes"];

        return TimeUom;
    }());
    uTypes.AlertSetting = (function () {
        var AlertSetting = function () {
            return Model.apply(this, arguments);
        };

        AlertSetting.prototype = Object.create(Model.prototype);

        return AlertSetting;
    }());
    uTypes.CurfewSetting = (function () {
        var AlertSetting = uTypes.AlertSetting;

        function CurfewSetting() {
            return AlertSetting.apply(this, arguments);
        }

        CurfewSetting.prototype = Object.create(AlertSetting.prototype);

        return Model.make(CurfewSetting, {
            curfewConfigId : {names : ["curfewConfigId"], type : Number},
            vin            : {names : ["vin"], type : String},
            curfewId       : {names : ["curfewId"], type : Number},
            active         : {names : ["active"], type : String},
            "startTime"    : {
                type       : momentWithFormat("HHmm"),
                value	   : "1200",
                translator : zeroPadTranslator(4)
            },
            "endTime"      : {
                type       : momentWithFormat("HHmm"),
                value	   : "1200",
                translator : zeroPadTranslator(4)
            },
            startDay       : {names : ["startDay"], type : String},
            endDay         : {names : ["endDay"], type : String},
            status         : {names : ["status"], type : String, value : "C"},
            action         : {names : ["action"], type : String, value : "insert"},
            curfewTime     : {names : ["curfewTime"], type : Number},
            curfewTimeUom  : {names : ["curfewTimeUom"], type : String},
            getFrequency   : function () {

            }
        });
    }());
    uTypes.CurfewSettingsResponse = Model.makeResponseModel({
        active          : {names : ["Active"], type : String},
        CurfewAlertList : {
            names : ["CurfewAlertList"],
            type  : Array,
            of    : uTypes.CurfewSetting
        }
    });
    uTypes.StatPeriod = (function () {
        function StatPeriod() {
            Model.apply(this, arguments);
            this.moment = moment(this.month + "/" + this.dayCount + "/" + this.year, "M/D/YYYY");
            return this;
        }

        return Model.make(StatPeriod, {
            year             : {names : ["year"], type : Number, value : moment().year()},
            month            : {names : ["month"], type : Number, value : moment().month() + 1},
            startOdometer    : {names : ["startOdometer"], type : Number, value : 0},
            endOdometer      : {names : ["endOdometer"], type : Number, value : 0},
            hrsIdle          : {
                names      : ["idleTime"],
                type       : Number,
                value      : 0,
                translator : function (val) {
                    return (val / 3600); //base value is in seconds
                }
            },
            efficientScore   : {names : ["efficientScore"], type : Number, value : 99},
            inefficientScore : {names : ["inefficientScore"], type : Number, value : 0},
            aveSpeed         : {names : ["aveSpeed"], type : Number, value : 0},
            awardCount       : {names : ["awardCount"], type : String, value : "0"},
            aveAccel         : {names : ["aveAccel"], type : Number, value : 0},
            hrsDriven        : {names : ["hrsDriven"], type : Number, value : 0},
            milesDriven      : {names : ["milesDriven"], type : Number, value : 0},
            aveMph           : {names : ["aveMph"], type : Number, value : 0},
            dayCount         : {names : ["dayCount"], type : Number, value : moment().day()}
        });

    }());
    uTypes.DrivingActivity = (function () {
        function DrivingActivity() {
            Model.apply(this, arguments);
            return this;
        }

        return Model.make(DrivingActivity, {
            monthlyStat    : {names : ["monthlyStat"], type : Array, of : uTypes.StatPeriod},
            currentMileage : {names : ["currentMileage"], type : Number},
            numAwards 	   : {names : ["numAwards"], type : Number}
        });
    }());

    uTypes.VehicleStatusDateTime = (function () {
        function VehicleStatusDateTime() {
            return Model.apply(this, arguments);
        }

        return Model.make(VehicleStatusDateTime, {
            utc    : {names : ["utc"], type : String, value : moment().format("YYYYMMDDHHmmss")},
            offset : {names : ["offset"], type : Number}
        });
    }());

    uTypes.VehicleStatus = (function () {
        function VehicleStatus() {
            Model.apply(this, arguments);
            this.moment = moment(this.dateTime.utc, "YYYYMMDDHHmmss");
            return this;
        }

        return Model.make(VehicleStatus, {
            dateTime     : {names : ["dateTime"], type : uTypes.VehicleStatusDateTime},
            airCtrlOn    : {names : ["airCtrlOn"], type : Boolean},
            engine       : {names : ["engine"], type : Boolean},
            doorLock     : {names : ["doorLock"], type : Boolean},
            doorOpen     : {names : ["doorOpen"]},
            trunkOpen    : {names : ["trunkOpen"], type : Boolean},
            airTemp      : {names : ["airTemp"]},
            defrost      : {names : ["defrost"], type : Boolean},
            lowFuelLight : {names : ["lowFuelLight"], type : Boolean},
            acc          : {names : ["acc"], type : Boolean}
        });
    }());
    
    uTypes.VehicleStatusReponse = (function (){
    	function VehicleStatusReponse() {
    		return Model.apply(this, arguments);
		}
	
		return Model.make(VehicleStatusReponse, {
			timeStampVO:{names:["timeStampVO"]},
			latestVehicleStatus:{names:["latestVehicleStatus"], type: uTypes.VehicleStatus}
		});
	}());
    

    (function () {
    	var dataRequests = uvo.namedDataRequests = {
            "drivingActivityKh" : {
            	url  : "/ccw/kh/drivingActivity.do",
                type : uvo.dataTypes.DrivingActivity
            },
            "drivingActivity" : {
            	url  : "/ccw/cp/drivingActivityInfo.do",
                type : uvo.dataTypes.DrivingActivity
            }
        };

        function DataRequestOptions(name, url, type, method) {
            if (typeof name === 'object') {
                $.extend(this, name);
            } else {
                this.name = name || DataRequestOptions.prototype.name;
                this.url = url || DataRequestOptions.prototype.url;
                this.type = type || DataRequestOptions.prototype.type;
                this.method = method || DataRequestOptions.prototype.method;
            }

            if (this.name) {
                uvo.namedDataRequests[this.name] = uvo.namedDataRequests[this.name] || this;
            }
        }

        DataRequestOptions.prototype = {
            method : "GET",
            url    : "",
            name   : "",
            type   : Object
        };

        uTypes.DataRequestOptions = DataRequestOptions;

        uvo.dataRequest = function (options) {
            if (!options) {
                throw new Error("No options provided to dataRequest");
            }

            var opts = {
                method : "GET",
                type   : Object
            };

            if (typeof options === 'string') {
                if (!dataRequests[options]) {
                    throw new Error("unknown dataRequest type: '" + options + "'");
                }
                opts.name = options;
                opts = $.extend(opts, dataRequests[options]);
            } else {
                opts = $.extend(opts, options);
            }

            var name = opts.name || false;
            if (name && uvo.data[name]) {
                return uvo.data[name];
            }

            var defer = new $.Deferred();

            if (name) {
                uvo.data[name] = defer.promise();
            }

            $.ajax({
                url  : opts.url,
                type : opts.method,
                cache: false
            }).done(function (respData) {
                var processedData = new opts.type(respData);
                defer.resolve(processedData);
            }).fail(function () {
                console.error("Failure response for " + opts.url, opts);
                defer.reject.apply(defer, arguments);
            });

            return name ? uvo.data[name] : defer.promise();
        };
    }());

    uvo.data.buildSchema = function (obj, objName) {

        var out;

        if (objName) {
            out = "uTypes.objName = (function (){\nfunction objName() {\n";
            out += "return Model.apply(this, arguments);\n";
            out += "}\n\n";
            out += "return Model.make(objName, {\n";
            out = out.replace(/objName/g, objName);
        } else {
            out = "Model.makeResponseModel({\n";
        }

        var type;
        for (var fld in obj) {
            if (obj.hasOwnProperty(fld)) {
                type = typeof obj[fld];
                out += fld + ":{names:[\"" + fld + "\"]";
                if (type !== "object" && type !== "function") {
                    out += ",type: " + type.charAt(0).toUpperCase() + type.slice(1) + "";
                } else if (obj[fld] instanceof Array) {
                    out += ",type: Array";
                }
                out += "},\n";
            }
        }
        out = out.slice(0, out.length - 2);

        if (objName) {
            out += "\n});\n}());";
        } else {
            out += "\n});";
        }

        $('<pre class="hide"></pre>').text(out).prependTo($("body"));

        return obj;
    };

}(window.uvo));