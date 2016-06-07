/// <reference path="../../Definitions/hammer.d.ts" />
export = Main;
declare module Main {
    class DataTransfer2 {
        private _dataTransfer;
        private _prefixCode;
        constructor(dataTransfer: DataTransfer);
        dropEffect: string;
        effectAllowed: string;
        types: string[];
        files: FileList;
        /**
         * Returns true if the script detected that the transfer is using a legacy system.
         *
         * @return True if legacy is used.
         */
        static isLegacyDataTransfer(): boolean;
        setDragImage(image: Element, x: number, y: number): void;
        addElement(element: Element): void;
        getData(format: string): any;
        setData(format: string, data: string): void;
        clearData(format?: string): void;
        private _checkFormat(format);
        private _getLegacyData();
        private _stringifyLegacyData(allData);
        private _getLegacyDataTransfer(format);
        private _setLegacyDataTransfer(format, data);
        private _clearLegacyDataTransfer(format?);
    }
}
