/// <reference path="../../../References.d.ts" />

interface JQueryPosition {
    my: string; 
    offset: string; 
    at: string; 
    of: any; 
    collision: string;
}

interface JQuery {
    // This file is a temporary extension to the existing TypeScript jquery.str, until it is updated with the most recent jquery APIs
    live(eventType: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
    position(JQueryPosition): { top: number; left: number; };
}
