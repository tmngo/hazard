import { Typography } from 'utils/typography'
import { BaseLayout } from 'utils/layouts/BaseLayout'
import { Children } from 'utils/core'
import { ReactNode } from 'react'

export namespace AppLayout {
  export function Metric({ k, v }: { k: string; v: ReactNode }) {
    return (
      <BaseLayout.VStack gap={1}>
        <Typography variant="label">{k}</Typography>
        {typeof v === 'string' ? (
          <Typography variant="bodybold">{v}</Typography>
        ) : (
          v
        )}
      </BaseLayout.VStack>
    )
  }

  export function Module({
    title,
    metrics = [],
    children,
  }: Partial<Children> & {
    title: string
    metrics?: { k: string; v: string | number }[]
  }) {

    return (
      <BaseLayout.VStack
        gap={5}
        view={{
          inset: 5,
          rawStyles: {
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 1000,
          },
        }}
      >
        <BaseLayout.View inset={[0, 5]}>
            <Typography variant="header">{title}</Typography>
        </BaseLayout.View>
        {metrics.length > 0 && (
          <BaseLayout.HStack
            gap={4}
            view={{
              inset: 5,
              background: "white",
              borderRadius: 1,
              rawStyles: { flexWrap: 'wrap' },
            }}
          >
            {metrics.map((m) => (
              <Metric key={m.k} {...m} />
            ))}
          </BaseLayout.HStack>
        )}
        {children}
      </BaseLayout.VStack>
    )
  }

  export function Section({
    title,
    children,
  }: Children & {
    title: string
  }) {
    return (
      <BaseLayout.VStack gap={2} view={{ inset: 5, background: "white" }}>
        <Typography variant="title">{title}</Typography>
        {children}
      </BaseLayout.VStack>
    )
  }
}
