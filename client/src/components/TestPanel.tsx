import { useState } from 'react'
import { BaseLayout } from 'utils/layouts/BaseLayout'
import { AppLayout } from 'utils/layouts/AppLayout'

export const TestPanel = () => {
  const [output, setOutput] = useState('<output>')
  const [geocodeLoading, setGeocodeLoading] = useState(false)
  const [geocodeQuery, setGeocodeQuery] = useState('Seattle')
  const [lat, setLat] = useState('37.69086827939584')
  const [lon, setLon] = useState('-122.43362129934872')

  return (
    <AppLayout.Module title="API Testing">
      <AppLayout.Section title="1. Hello, server!">
        <BaseLayout.HStack gap={4}>
          <button
            onClick={() => {
              const fetchData = async () => {
                const response = await fetch('http://localhost:3001/api/hello')
                const text = await response.text()
                setOutput(output.concat('\n/hello: ', text))
                console.log(text)
              }
              fetchData()
            }}
          >
            Hello, server!
          </button>
        </BaseLayout.HStack>
      </AppLayout.Section>

      <AppLayout.Section title="2. Geocode using Nominatim">
        <BaseLayout.HStack gap={4}>
          <input
            type="text"
            value={geocodeQuery}
            onChange={(event) => setGeocodeQuery(event.target.value)}
          />
          <button
            disabled={geocodeLoading}
            onClick={() => {
              setGeocodeLoading(true)
              const params = new URLSearchParams({ q: geocodeQuery })
              fetch(
                `http://localhost:3001/api/geocode?${params.toString()}`,
              ).then((response) => {
                response.text().then((text) => {
                  setGeocodeLoading(false)
                  setOutput(output.concat('\n/geocode: ', text))
                  console.log(text)
                })
              })
            }}
          >
            Submit
          </button>
        </BaseLayout.HStack>
      </AppLayout.Section>

      <AppLayout.Section title="3. Latitude/longitude to fire risk">
        <BaseLayout.HStack gap={4}>
          <label>Lat:</label>
          <input
            type="text"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
          />
          <label>Lon:</label>
          <input
            type="text"
            value={lon}
            onChange={(event) => setLon(event.target.value)}
          />
          <button
            onClick={async () => {
              const params = new URLSearchParams({
                lon,
                lat,
              })
              const response = await fetch(
                `http://localhost:3001/api/fh?${params.toString()}`,
              )
              const text = await response.text()
              setOutput(output.concat('\n/fh: ', text))
              console.log(text)
            }}
          >
            Submit
          </button>
        </BaseLayout.HStack>
      </AppLayout.Section>

      <AppLayout.Section title="Output">
        <textarea style={{ height: '20em', width: '100%' }} value={output} disabled />
        <BaseLayout.View collapseWidth>
          <button
            onClick={() => {
              setOutput('')
            }}
          >
            Clear output
          </button>
        </BaseLayout.View>
      </AppLayout.Section>
    </AppLayout.Module>
  )
}
