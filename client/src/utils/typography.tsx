import { BaseLayout } from 'utils/layouts/BaseLayout'
import '@fontsource/roboto/400.css'; // normal
import '@fontsource/roboto/500.css'; // medium
import '@fontsource/roboto/700.css'; // bold

const propsForVariant = {
    caption: { fontSize: 10, fontWeight: 500, fontFamily: 'Roboto, sans-serif' },
    label: { fontSize: 12, fontWeight: 500, fontFamily: 'Roboto, sans-serif' },
    body: { fontSize: 14, fontWeight: 500, fontFamily: 'Roboto, sans-serif' },
    bodybold: { fontSize: 14, fontWeight: 700, fontFamily: 'Roboto, sans-serif' },
    subtitle: { fontSize: 16, fontWeight: 600, fontFamily: 'Roboto, sans-serif' },
    title: { fontSize: 16, fontWeight: 700, fontFamily: 'Roboto, sans-serif' },
    header: { fontSize: 22, fontWeight: 700, fontFamily: 'Roboto, sans-serif' },
  }
  type Variant = keyof typeof propsForVariant
  
  export function Typography({
    variant = 'body',
    children,
  }: {
    variant?: Variant
    children: string
  }) {
    return (
      <BaseLayout.RawSpan style={{ ...propsForVariant[variant] }}>
        {children}
      </BaseLayout.RawSpan>
    )
  }
