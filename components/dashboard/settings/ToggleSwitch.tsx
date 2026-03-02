'use client'

import { motion } from 'framer-motion'

export default function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full ${
        checked ? 'bg-brand-600' : 'bg-white/10'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full"
      />
    </button>
  )
}