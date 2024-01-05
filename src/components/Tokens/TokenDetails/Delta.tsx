import { ArrowChangeDown } from 'components/Icons/ArrowChangeDown'
import { ArrowChangeUp } from 'components/Icons/ArrowChangeUp'
import styled from 'styled-components'

const StyledUpArrow = styled(ArrowChangeUp)<{ $noColor?: boolean }>`
  color: ${({ theme, $noColor }) => ($noColor ? theme.neutral2 : theme.success)};
`
const StyledDownArrow = styled(ArrowChangeDown)<{ $noColor?: boolean }>`
  color: ${({ theme, $noColor }) => ($noColor ? theme.neutral2 : theme.critical)};
`

function isValidDelta(delta: number | null | undefined): delta is number {
  // Null-check not including zero
  return delta !== null && delta !== undefined && delta !== Infinity && !isNaN(delta)
}

interface DeltaArrowProps {
  delta?: number | null
  noColor?: boolean
  size?: number
}

export function DeltaArrow({ delta, noColor = false, size = 16 }: DeltaArrowProps) {
  if (!isValidDelta(delta)) return null

  return Math.sign(delta) < 0 ? (
    <StyledDownArrow width={size} height={size} key="arrow-down" aria-label="down" $noColor={noColor} />
  ) : (
    <StyledUpArrow width={size} height={size} key="arrow-up" aria-label="up" $noColor={noColor} />
  )
}
