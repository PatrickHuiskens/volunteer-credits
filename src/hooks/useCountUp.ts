import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 800) {
  const [current, setCurrent] = useState<number>(0)
  const prevTarget = useRef(target)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const from = prevTarget.current === target ? 0 : prevTarget.current
    prevTarget.current = target

    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(from + (target - from) * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return current
}
