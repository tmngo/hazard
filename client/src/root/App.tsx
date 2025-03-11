import { TestMap } from 'components/TestMap'
import { TestPanel } from 'components/TestPanel'
import { TestDial } from 'components/TestDial'

export function App() {
  return (
    <>
      <div>
        <TestMap />
        <TestDial value={7} />
        <TestPanel />
      </div>
    </>
  )
}
