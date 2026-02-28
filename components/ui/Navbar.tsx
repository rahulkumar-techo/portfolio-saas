"use client"

import { useState } from "react"

/**
 * Premium Navbar
 * Mobile Slide From Left
 * Smooth Off-Canvas Animation
 */

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#04140F] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="text-lg font-semibold text-emerald-400">
              Portfolio SaaS
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
              <a href="#" className="hover:text-emerald-400 transition">Features</a>
              <a href="#" className="hover:text-emerald-400 transition">Pricing</a>
              <a href="#" className="hover:text-emerald-400 transition">Reviews</a>
              <button className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition text-white">
                Get Started
              </button>
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden flex flex-col gap-1"
            >
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </button>

          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Slide Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#04140F] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">

          <div className="text-lg font-semibold text-emerald-400">
            Portfolio SaaS
          </div>

          <a href="#" className="text-gray-300 hover:text-emerald-400 transition">
            Features
          </a>

          <a href="#" className="text-gray-300 hover:text-emerald-400 transition">
            Pricing
          </a>

          <a href="#" className="text-gray-300 hover:text-emerald-400 transition">
            Reviews
          </a>

          <button className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition text-white">
            Get Started
          </button>

        </div>
      </div>
    </>
  )
}