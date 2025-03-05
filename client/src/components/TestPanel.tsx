import { useState } from 'react'

export const TestPanel = () => {
  const [output, setOutput] = useState('<output>')
  const [geocodeLoading, setGeocodeLoading] = useState(false)
  const [geocodeQuery, setGeocodeQuery] = useState('Seattle')
  const [lat, setLat] = useState('37.69086827939584')
  const [lon, setLon] = useState('-122.43362129934872')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        padding: '1em',
        border: 'solid #d0d0d0 1px',
      }}
    >
      <h2>API</h2>
      <h3>1. Hello, server!</h3>
      <div style={{ display: 'flex', gap: '1em' }}>
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
      </div>

      <h3>2. Geocode using Nominatim</h3>
      <div style={{ display: 'flex', gap: '1em' }}>
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
      </div>

      <h3>3. Latitude/longitude to fire risk</h3>
      <div style={{ display: 'flex', gap: '1em' }}>
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
      </div>

      <textarea style={{ height: '20em' }} value={output} disabled />
      <div>
        <button
          onClick={() => {
            setOutput('')
          }}
        >
          Clear output
        </button>
      </div>
    </div>
  )
}
