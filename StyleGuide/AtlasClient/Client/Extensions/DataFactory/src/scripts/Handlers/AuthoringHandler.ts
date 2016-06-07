export class AuthoringHandler {
    // Used to generate unique id for activity nodes
    public nodeTypes: StringMap<number> = {};

    public addNodeType = (type: string): number => {
        if (this.nodeTypes[type]) {
            this.nodeTypes[type]++;
        } else {
            this.nodeTypes[type] = 1;
        }

        return this.nodeTypes[type];
    };
}
