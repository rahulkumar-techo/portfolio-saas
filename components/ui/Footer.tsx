"use client"

/**
 * Footer Component
 * Portfolio SaaS
 * Mobile First + Green Premium Theme
 */

export default function Footer() {
  return (
    <footer className="bg-[#04140F] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-4">

          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">
              Portfolio SaaS
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered platform that converts resumes into professional
              portfolio websites instantly.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Features
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Pricing
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Templates
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer transition">
                About
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Blog
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-medium mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition cursor-pointer">
                <span className="text-sm">T</span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition cursor-pointer">
                <span className="text-sm">L</span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition cursor-pointer">
                <span className="text-sm">G</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Portfolio SaaS. All rights reserved.
        </div>

      </div>
    </footer>
  )
}