import { BaseLayout } from 'utils/layouts/BaseLayout'
import { FC } from 'react'

interface TestDialProps {
  value: number
  min?: number
  max?: number
  startColor?: string
  middleColor?: string
  endColor?: string
  size?: number
  thickness?: number
  showMarker?: boolean
}

export const TestDial: FC<TestDialProps> = ({
  value,
  min = 1,
  max = 10,
  startColor = '#22c55e', // Green
  middleColor = '#ffeb3b', // Yellow
  endColor = '#ef4444', // Red
  size = 300,
  thickness = 30,
  showMarker = true,
}) => {
  // Clamp value within range
  const clampedValue = Math.min(Math.max(value, min), max)
  
  // Setup dial dimensions
  const radius = size / 2 - thickness / 2
  const centerX = size / 2
  const centerY = size / 2
  const startAngle = -180 // Left side
  const endAngle = 0      // Right side
  
  // Calculate value position
  const percentage = (clampedValue - min) / (max - min)
  const valueAngle = startAngle + percentage * (endAngle - startAngle)
  const valueRad = (valueAngle * Math.PI) / 180
  
  // Create arc path for dial
  const createArc = (startAngleRad: number, endAngleRad: number, r: number) => {
    const x1 = centerX + r * Math.cos(startAngleRad)
    const y1 = centerY + r * Math.sin(startAngleRad)
    const x2 = centerX + r * Math.cos(endAngleRad)
    const y2 = centerY + r * Math.sin(endAngleRad)
    
    const largeArcFlag = Math.abs(endAngleRad - startAngleRad) > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`
  }
  
  // Convert to radians
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180
  
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
  
  // Get the interpolated color for the current value
  const valueColor = interpolateColor(startColor, middleColor, endColor, percentage)
  
  // Calculate line marker coordinates
  const markerInnerX = centerX + (radius - thickness) * Math.cos(valueRad)
  const markerInnerY = centerY + (radius - thickness) * Math.sin(valueRad)
  const markerOuterX = centerX + (radius + thickness) * Math.cos(valueRad)
  const markerOuterY = centerY + (radius + thickness) * Math.sin(valueRad)
  
  return (
    <BaseLayout.View>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <defs>
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="50%" stopColor={middleColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        
        {/* Background track */}
        <path
          d={createArc(startRad, endRad, radius)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={thickness}
          strokeLinecap="round"
          transform={`translate(0, ${centerY / 2})`}
        />
        
        {/* Full gradient arc */}
        <path
          d={createArc(startRad, endRad, radius)}
          fill="none"
          stroke="url(#dialGradient)"
          strokeWidth={thickness}
          strokeLinecap="round"
          transform={`translate(0, ${centerY / 2})`}
        />
        
        {/* Line marker */}
        {showMarker && (
          <line
            x1={markerInnerX}
            y1={markerInnerY + centerY / 2}
            x2={markerOuterX}
            y2={markerOuterY + centerY / 2}
            stroke="#333"
            strokeWidth={3}
          />
        )}
        
        {/* Value display */}
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill={valueColor}
        >
          {clampedValue.toFixed(1)}
        </text>
      </svg>
    </BaseLayout.View>
  )
}