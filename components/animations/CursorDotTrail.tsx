'use client'

import { useEffect, useRef } from 'react'

export function CursorDotTrail() {
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const canUseFinePointer = window.matchMedia('(any-pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!dot || !canUseFinePointer || reduceMotion) return

    let frame = 0
    let visible = false
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const render = () => {
      current.x += (target.x - current.x) * 0.23
      current.y += (target.y - current.y) * 0.23
      dot.style.transform = `translate3d(${current.x - 3}px, ${current.y - 3}px, 0)`

      if (Math.abs(target.x - current.x) > 0.15 || Math.abs(target.y - current.y) > 0.15) {
        frame = window.requestAnimationFrame(render)
      } else {
        frame = 0
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) {
        current.x = target.x
        current.y = target.y
        dot.style.opacity = '1'
        visible = true
      }
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    const hide = () => {
      dot.style.opacity = '0'
      visible = false
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', hide)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', hide)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <span ref={dotRef} aria-hidden="true" className="cursor-dot-trail" />
}
