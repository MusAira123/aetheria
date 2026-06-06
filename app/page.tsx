'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/app/lib/supabase'
import {
  FaWhatsapp,
  FaInstagram,
  FaHome,
  FaBoxOpen,
  FaBookOpen,
  FaPhone,
  FaSearch,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaArrowUp
} from 'react-icons/fa'

function ProductCard({ product }: any) {
  const [current, setCurrent] = useState(0)

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image_url]

  const nextImage = () => {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 overflow-hidden">
        <div className="absolute inset-[-200%] animate-snake-border bg-[conic-gradient(from_0deg,_transparent,_transparent,_#d4af37,_transparent,_transparent)]"></div>
      </div>
      <div className="relative bg-white overflow-hidden rounded-3xl z-10 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col">
        <div className="relative w-full h-[190px] md:h-[360px] overflow-hidden flex items-center justify-center bg-black">
          {images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110
              ${
                index === current
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-110 z-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-300 z-20"
            >
              ‹
            </button>
          )}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-300 z-20"
            >
              ›
            </button>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_: any, index: number) => (
                <div
                  key={index}
                  className={`transition-all duration-300 rounded-full
                  ${
                    index === current
                      ? 'w-4 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between p-3 md:p-8 text-center">
          <div>
            <h4 className="font-semibold text-[13px] md:text-2xl leading-snug">
              {product.name}
            </h4>
            <p className="text-gray-600 text-[10px] md:text-sm mt-1 md:mt-3 leading-relaxed px-1 md:px-2">
              {product.description}
            </p>
          </div>
          <div className="mt-3 md:mt-6">
            <p className="font-bold text-base md:text-2xl">
              ₹{product.price}
            </p>
            <p className="text-[10px] md:text-sm mt-1 md:mt-2 text-gray-700">
              Available Qty: {product.qty}
            </p>
            <a
              href={`https://wa.me/918055100913?text=Hi, I want ${product.name}`}
              className="inline-block mt-3 md:mt-6 bg-green-600 text-white px-4 py-2 md:py-3 rounded-2xl w-full text-center text-[11px] md:text-base transition-all duration-300 hover:bg-green-700"
            >
              Buy on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [currentImage, setCurrentImage] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const categoryRefs = useRef<any>({})

  const heroImages = [
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d"
  ]

  const quotes = [
    "✨ BUY 3 PRODUCTS & GET FREE SHIPPING",
    "💎 Jewelry that speaks elegance",
    "🌟 Designed for everyday luxury",
    "💖 Wear confidence, wear Aetheria"
  ]

  useEffect(() => {
    fetchProducts()

    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 7000)

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 4000)

    return () => {
      clearInterval(imageInterval)
      clearInterval(quoteInterval)
    }
  }, [])

  useEffect(() => {
    if (!search.trim()) return

    const matchingProduct = products.find(
      (p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    )

    if (matchingProduct?.category) {
      const element = categoryRefs.current[matchingProduct.category]

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }, [search, products])

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  const categories = [
    "Earrings",
    "Rings",
    "Bracelets",
    "Gift Hampers",
    "Hair Accessories",
    "Necklace"
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md text-white px-6 md:px-12 py-4 rounded-b-3xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <nav className="flex flex-wrap gap-6 text-[11px] md:text-sm font-semibold tracking-[0.18em] uppercase">
            <a href="#" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Home</span>
              <FaHome className="text-sm mt-1" />
            </a>
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <a
                href="#shop"
                className="flex flex-col items-center hover:text-yellow-400 transition"
              >
                <span>Products</span>
                <FaBoxOpen className="text-sm mt-1" />
              </a>
              <div
                className={`absolute left-0 top-full pt-2 min-w-[220px] z-50 transition-all duration-200 ${
                  dropdownOpen
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible'
                }`}
              >
                <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        const element = categoryRefs.current[cat]
                        if (element) {
                          element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                        }
                        setDropdownOpen(false)
                      }}
                      className="w-full text-left px-5 py-3 text-sm hover:bg-white/10 transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <a href="#story" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Our Story</span>
              <FaBookOpen className="text-sm mt-1" />
            </a>
            <a href="#contact" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Contact</span>
              <FaPhone className="text-sm mt-1" />
            </a>
          </nav>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 backdrop-blur-md w-full md:w-[280px]">
            <FaSearch className="text-white/70 mr-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder:text-white/50 w-full"
            />
          </div>
        </div>
      </header>

      {/* TRUST STRIP */}
      <section className="sticky top-[72px] z-40 overflow-hidden bg-gradient-to-r from-yellow-50 via-white to-yellow-50 py-6">
        <div className="flex animate-marquee whitespace-nowrap gap-16 text-sm md:text-base font-semibold text-gray-800">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              <span>✨ Waterproof</span>
              <span>✨ Anti-Tarnish</span>
              <span>✨ Premium Finish</span>
              <span>✨ Fast Shipping</span>
              <span>✨ Hypoallergenic</span>
              <span>✨ Lifetime Shine</span>
              <span>✨ Handmade Jewelry</span>
            </div>
          ))}
        </div>
      </section>

      {/* HERO */}
      <section className="px-6 md:px-12 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <div className="w-full flex justify-start ml-[40px] md:ml-[-120px]">
            <img
              src="/logo.png"
              className="h-56 md:h-64 lg:h-80 object-contain"
            />
          </div>
          <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl px-6 py-3 shadow-md w-[340px] md:w-[420px] h-[60px] flex items-center">
            <p className="text-sm md:text-base font-semibold tracking-wide">
              {quotes[currentQuote]}
            </p>
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            Premium Jewelry
            <br />
            Built for Everyday Luxury
          </h2>
          <p className="text-gray-600 text-lg">
            Waterproof • Anti-Tarnish • Modern Minimal Designs
          </p>
          <div className="flex gap-4">
            <a
              href="#shop"
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Shop Now
            </a>
            <a
              href="https://wa.me/918055100913"
              className="flex items-center gap-2 border px-6 py-3 rounded-lg"
            >
              <FaWhatsapp className="text-green-500 text-lg" />
              WhatsApp Us
            </a>
          </div>
        </div>
        <div className="relative w-full h-[480px] md:h-[560px] lg:h-[700px]">
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              onError={(e) => (e.currentTarget.src = heroImages[0])}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-1000 ${index === currentImage ? 'opacity-100 z-10' : 'opacity-0'}`}
            />
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="shop" className="px-6 md:px-12 py-20">
        <h3 className="text-3xl font-bold mb-14">
          Shop By Categories
        </h3>
        {categories.map((category) => {
          const filteredProducts = products.filter(
            (p) => p.category === category
          )
          if (filteredProducts.length === 0) return null
          return (
            <div
              key={category}
              ref={(el) => {
                categoryRefs.current[category] = el
              }}
              className="mb-20"
            >
              <h4 className="text-2xl font-bold mb-8">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-black text-white/80 pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <div>
              <img src="/logo.png" className="h-16 mb-4 object-contain" />
              <p className="text-sm text-white/60 leading-relaxed">
                Aetheria brings you premium, waterproof, anti-tarnish jewelry designed for everyday luxury. Handcrafted with love and precision.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-yellow-400 transition text-xl">
                  <FaInstagram />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-yellow-400 transition text-xl">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-yellow-400 transition text-xl">
                  <FaTwitter />
                </a>
                <a href="https://wa.me/918055100913" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-yellow-400 transition text-xl">
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
                <li><a href="#shop" className="hover:text-yellow-400 transition">Shop</a></li>
                <li><a href="#story" className="hover:text-yellow-400 transition">Our Story</a></li>
                <li><a href="#contact" className="hover:text-yellow-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">FAQs</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        const element = categoryRefs.current[cat]
                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="hover:text-yellow-400 transition"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div id="contact">
              <h4 className="text-white font-semibold text-lg mb-4">Get in Touch</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <FaWhatsapp className="text-green-500 mt-0.5" />
                  <a href="https://wa.me/918055100913" className="hover:text-yellow-400 transition">+91 80551 00913</a>
                </li>
                <li className="flex items-start gap-3">
                  <FaEnvelope className="text-white/60 mt-0.5" />
                  <a href="mailto:hello@aetheria.com" className="hover:text-yellow-400 transition">hello@aetheria.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-white/60 mt-0.5" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} Aetheria Jewelry. All rights reserved.</p>
            <p className="mt-1">Waterproof • Anti-Tarnish • Handcrafted with care</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes snake-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-snake-border {
          animation: snake-border 3s linear infinite;
        }
      `}</style>
    </main>
  )
}
