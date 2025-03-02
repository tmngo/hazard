import {
  Children as C,
  CSSProperties,
  forwardRef as fr,
  HTMLAttributes as Attr,
  ReactNode,
} from 'react'

export namespace BaseLayout {
  const Grain = 4
  type TDiv = HTMLDivElement

  export const RawDiv = fr<TDiv, Attr<TDiv>>((p, ref) => (
    <div ref={ref} {...p} />
  ))

  interface Children {
    children?: ReactNode
  }
  export const StyledDiv = fr<TDiv, CSSProperties & Children>((p, ref) => (
    <RawDiv style={p} ref={ref}>
      {p.children}
    </RawDiv>
  ))

  interface ViewProps {
    inset?: number | [number, number]
    borderWidth?: number
    borderColor?: string
    outline?: string
    outlineOffset?: number
    borderRadius?: number
    background?: string
    textColor?: string
    fillHeight?: boolean
    fillWidth?: boolean
    fixedWidth?: number
    collapseWidth?: boolean
    /** Note: This should eventually default to true */
    hideOverflow?: boolean
    rawStyles?: CSSProperties
  }

  function getViewStyles({
    inset,
    borderWidth,
    borderColor,
    outline,
    outlineOffset,
    borderRadius,
    background,
    textColor,
    fillHeight,
    fillWidth,
    fixedWidth,
    collapseWidth,
    hideOverflow,
    rawStyles,
  }: ViewProps): CSSProperties {
    return {
      padding: typeof inset === 'number' ? inset * Grain : undefined,
      ...(Array.isArray(inset) && {
        paddingTop: inset[0] * Grain,
        paddingBottom: inset[0] * Grain,
        paddingLeft: inset[1] * Grain,
        paddingRight: inset[1] * Grain,
      }),
      outline,
      outlineOffset,
      border: borderWidth
        ? `${borderWidth}px solid ${borderColor ?? 'black'}`
        : undefined,
      overflow: hideOverflow ? 'hidden' : undefined,
      borderRadius: borderRadius ? borderRadius * Grain : undefined,
      background,
      color: textColor,
      height: fillHeight ? '100%' : undefined,
      width:
        fixedWidth ??
        (fillWidth ? '100%' : collapseWidth ? 'fit-content' : undefined),
      minWidth: fixedWidth,
      ...rawStyles,
    }
  }

  export const View = fr<TDiv, ViewProps & Children>((p, ref) => (
    <StyledDiv {...getViewStyles(p)} ref={ref}>
      {p.children}
    </StyledDiv>
  ))

  interface StackProps {
    orientation: 'vertical' | 'horizontal'
    gap?: number
    justify?: 'between' | 'start' | 'end' | 'center' | 'around'
    align?: 'center' | 'start' | 'end' | 'stretch' | 'baseline'
    view?: ViewProps
  }

  export const Stack = fr<TDiv, StackProps & Children>((p, ref) => {
    const {
      orientation,
      justify = 'start',
      align = orientation === 'vertical' ? undefined : 'center',
      gap = orientation === 'horizontal' && justify === 'between'
        ? 4
        : undefined,
      view,
      children,
    } = p

    if (!ref && !view && C.toArray(children).length <= 1) {
      return <>{children}</>
    } else {
      return (
        <div
          ref={ref}
          style={{
            ...getViewStyles({
              fillWidth: orientation === 'vertical' && !view?.collapseWidth,
              ...view,
            }),
            display: 'flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            gap: gap ? gap * Grain : undefined,
            justifyContent:
              justify === 'between'
                ? 'space-between'
                : justify === 'around'
                  ? 'space-around'
                  : justify === 'start'
                    ? 'start'
                    : justify === 'end'
                      ? 'end'
                      : justify === 'center'
                        ? 'center'
                        : undefined,
            alignItems: !align
              ? undefined
              : align === 'center'
                ? 'center'
                : align === 'start'
                  ? 'start'
                  : align === 'end'
                    ? 'end'
                    : align === 'stretch'
                      ? 'stretch'
                      : align === 'baseline'
                        ? 'baseline'
                        : undefined,
          }}
        >
          {children}
        </div>
      )
    }
  })

  export const HStack = fr<TDiv, Omit<StackProps & Children, 'orientation'>>(
    (p, ref) => <Stack {...p} ref={ref} orientation="horizontal" />,
  )

  export const VStack = fr<TDiv, Omit<StackProps & Children, 'orientation'>>(
    (p, ref) => <Stack {...p} ref={ref} orientation="vertical" />,
  )

  export const RawSpan = fr<HTMLSpanElement, Attr<HTMLSpanElement>>(
    (props, ref) => <span ref={ref} {...props} />,
  )

  export function Screen({ children }: Children) {
    return (
      <VStack
        view={{ rawStyles: { position: 'absolute', inset: 0, width: '100%' } }}
      >
        {children}
      </VStack>
    )
  }
}
