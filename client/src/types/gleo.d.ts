declare module 'gleo/src/Map.mjs' {
  declare class GleoMap {}
}

declare module 'gleo/src/MercatorMap.mjs' {
  declare class MercatorMap extends GleoMap {
    constructor(divID: string, options: any = {})
    center: [number, number]
    span: number
  }
  export default MercatorMap
}

declare module 'gleo/src/loaders/MercatorTiles.mjs' {
  declare class MercatorTiles {
    constructor(templateStr: string, options: { attribution: string })
    addTo(map: GleoMap)
  }
  export default MercatorTiles
}
