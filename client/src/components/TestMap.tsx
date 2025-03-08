import MercatorMap from 'gleo/src/MercatorMap.mjs'
import MercatorTiles from 'gleo/src/loaders/MercatorTiles.mjs'
import { useEffect, useRef } from 'react'

export const TestMap = () => {
  const mapRef = useRef<MercatorMap>(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      if (mapRef.current === null) {
        mapRef.current = new MercatorMap(containerRef.current)
      }
      const map = mapRef.current
      map.center = [37, -122]
      map.span = 4000000
      const tiles = new MercatorTiles('https://tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          "<a href='http://osm.org/copyright'>© OpenStreetMap contributors</a>",
      })
      tiles.addTo(map)
    }
  }, [])

  return (
    <div
      style={{ width: '100%', height: 500 }}
      ref={containerRef}
      id="gleocontainer"
    ></div>
  )
}
