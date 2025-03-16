import { TestMap } from 'components/TestMap'
import { TestPanel } from 'components/TestPanel'
import { TestDial } from 'components/TestDial'
import { TestMeter } from 'components/TestMeter'

export function App() {
  return (
    <>
      <div>
        <TestMap />
        <TestDial value={7} />
        <TestMeter value={7} />
        <TestPanel />
      </div>
    </>
  )
}
