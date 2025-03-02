import * as R from 'react'

export function useRerender() {
    const [_, setN] = R.useState(1)
    return R.useCallback(() => setN((n) => (n + 1) % 12345678), [])
}

/**
 * Wraps `val` in a ref to provide a stable reference to the mutable object.
 */
export function useStabilized<T>(val: T) {
    const ref = R.useRef(val)
    ref.current = val
    return ref
}

export function useOnMount(fn: Parameters<typeof R.useEffect>[0]) {
    const stableFn = useStabilized(fn)
    R.useEffect(() => stableFn.current(), [stableFn])
}