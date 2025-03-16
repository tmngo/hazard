import { BaseLayout } from 'utils/layouts/BaseLayout'
import { FC } from 'react'

interface TestMeterProps {
  value: number
  min?: number
  max?: number
  startColor?: string
  middleColor?: string
  endColor?: string
  height?: number
  width?: number
  showMarker?: boolean
}

export const TestMeter: FC<TestMeterProps> = ({
  value,
  min = 1,
  max = 10,
  startColor = '#22c55e', // Green
  middleColor = '#ffeb3b', // Yellow
  endColor = '#ef4444', // Red
  height = 300,
  width = 60,
  showMarker = true,
}) => {
  // Clamp value within range
  const clampedValue = Math.min(Math.max(value, min), max)
  
  // Calculate percentage and position
  const percentage = (clampedValue - min) / (max - min)
  const markerPosition = height - (percentage * height) + 10
  
  // Interpolate between 3 colors based on factor (0-1)
  const interpolateColor = (color1: string, color2: string, color3: string, factor: number): string => {
    if (factor <= 0.5) {
      // First half of gradient
      return interpolateTwoColors(color1, color2, factor * 2)
    } else {
      // Second half of gradient
      return interpolateTwoColors(color2, color3, (factor - 0.5) * 2)
    }
  }
  
  // Blend two colors by factor (0-1)
  const interpolateTwoColors = (color1: string, color2: string, factor: number): string => {
    // Extract RGB values from hex
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)
    
    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)
    
    // Interpolate each component
    const r = Math.round(r1 + factor * (r2 - r1))
    const g = Math.round(g1 + factor * (g2 - g1))
    const b = Math.round(b1 + factor * (b2 - b1))
    
    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  
  // Get color at current value position
  const valueColor = interpolateColor(startColor, middleColor, endColor, percentage)
  
  return (
    <BaseLayout.View>
      <svg width={width + 80} height={height + 40} viewBox={`0 0 ${width + 80} ${height + 40}`}>
        <defs>
          <linearGradient id="meterGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="50%" stopColor={middleColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        
        {/* Meter background */}
        <rect
          x={60}
          y={10}
          width={width}
          height={height}
          fill="url(#meterGradient)"
          rx={5}
          ry={5}
        />
        
        {/* Marker line */}
        {showMarker && (
          <line
            x1={50} 
            y1={markerPosition}
            x2={60 + width + 10}
            y2={markerPosition}
            stroke="#333"
            strokeWidth={3}
          />
        )}
        
        {/* Value display */}
        <text
          x={40}
          y={markerPosition}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="20"
          fontWeight="bold"
          fill={valueColor}
        >
          {clampedValue.toFixed(1)}
        </text>
      </svg>
    </BaseLayout.View>
  )
}