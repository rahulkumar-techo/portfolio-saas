/**
 * Animated number counter
 */

"use client"

import { useEffect, useRef, useState } from "react"

interface CounterProps {
  target: number
  suffix?: string
}

export default function Counter({
  target,
  suffix = ""
}: CounterProps) {

  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {

    const obs = new IntersectionObserver(([entry]) => {

      if (!entry.isIntersecting) return

      let n = 0

      const step = Math.ceil(target / 50)

      const timer = setInterval(() => {

        n = Math.min(n + step, target)
        setVal(n)

        if (n >= target) clearInterval(timer)

      }, 28)

      obs.disconnect()

    }, { threshold: 0.5 })

    if (ref.current) obs.observe(ref.current)

    return () => obs.disconnect()

  }, [target])

  return <span ref={ref}>{val}{suffix}</span>
}