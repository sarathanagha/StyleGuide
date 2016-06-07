declare module "Hulljs" {
    function hull(coordinates: number[][]|{}[], concavity?: number, pointFormat?: string[]);
    export = hull;
}
