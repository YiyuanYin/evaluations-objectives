import { useRef, useEffect } from 'react'

export function usePrevious (value) {
  const previousRef = useRef()
  const previousValue = previousRef.current
  useEffect(() => {
    previousRef.current = value
  }, [value])

  return previousValue
}