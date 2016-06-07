module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ILoggingService {
        start: () => void;
        stop: () => void;
        flush: () => void ;
        activityId(activityId?: string): string;
        setSearchActivityId(activityId: string): void;
        info(message: () => string, data?: any): void;  
        debug(message: () => string, data?: any): void; 
        warn(message: () => string, data?: any): void; 
        error(message: () => string, data?: any): void; 
        fatal(message: () => string, data?: any): void; 
    }
}