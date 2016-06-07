export interface IEncodableObject {
    type: EncodableType;
    data: Object;
}

export interface IEncodable {
    Encodable: Object;
}

export enum EncodableType {
    PIPELINE,
    ACTIVITY,
    TABLE,
    ACTIVITY_RUN,
    STRING,
    LINKED_SERVICE,
    GATEWAY,
    DATAFACTORY
}

export class BaseEncodable {
    public type: EncodableType;
    public id: string;

    constructor(newType: EncodableType, id: string) {
        this.type = newType;
        this.id = id;
    }

    public equals(other: BaseEncodable) {
        return other.type === this.type && other.id === this.id;
    }
}

export class StringEncodable extends BaseEncodable {
    constructor(idString: string) {
        super(EncodableType.STRING, idString);
    }
}

// constant time lookup for encodables
export class EncodableSet {
    private _typeMap: { [encodableType: number]: StringMap<BaseEncodable> } = {};

    constructor(encodables: BaseEncodable[] = []) {
        encodables.forEach(this.add);
    }

    public add(encodable: BaseEncodable) {
        let index: number = encodable.type;

        if (!(index in this._typeMap)) {
            this._typeMap[index] = {};
        }

        this._typeMap[index][encodable.id] = encodable;
    }

    public remove(encodable: BaseEncodable): void {
        let index: number = encodable.type;
        if (this._typeMap[index]) {
            delete this._typeMap[index][encodable.id];
        }
    }

    public clear(): void {
        this._typeMap = {};
    }

    public length(): number {
        let length = 0;

        for (let i in this._typeMap) {
            length += Object.keys(this._typeMap[i]).length;
        }

        return length;
    }

    // Removes encodables from set if they're not the type to keep
    public filterEncodables(typeToKeep: EncodableType): void {
        let copy = this._typeMap[typeToKeep];
        this._typeMap = {};
        this._typeMap[typeToKeep] = copy;
    }

    public clearByType(typeToClear: EncodableType): StringMap<BaseEncodable> {
        let clearedEncodable: StringMap<BaseEncodable> = {};

        for (let encodableType in EncodableType) {
            if (encodableType === typeToClear) {
                clearedEncodable = this._typeMap[encodableType];
                delete this._typeMap[typeToClear];
                return clearedEncodable;
            }
        }
    }

    public toTypeMap(type: EncodableType): StringMap<BaseEncodable> {
        return this._typeMap[type];
    }

    public contains(encodable: BaseEncodable): boolean {
        let index: number = encodable.type;

        return (index in this._typeMap) && (encodable.id in this._typeMap[index]);
    }

    // iterates over all encodables in the map
    public forEach(callback: (encodable: BaseEncodable) => void) {
        for (let i in this._typeMap) {
            let idMap = this._typeMap[i];

            for (let id in idMap) {
                callback(idMap[id]);
            }
        }
    }
}
