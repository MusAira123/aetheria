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
  FaSearch
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

      {/* BORDER */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 overflow-hidden">
        <div className="absolute inset-[-200%] animate-snake-border bg-[conic-gradient(from_0deg,_transparent,_transparent,_#d4af37,_transparent,_transparent)]"></div>
      </div>

      {/* CARD */}
      <div className="relative bg-white overflow-hidden rounded-3xl z-10 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col">

        {/* IMAGE */}
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

          {/* PREV */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-300 z-20"
            >
              ‹
            </button>
          )}

          {/* NEXT */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-300 z-20"
            >
              ›
            </button>
          )}

          {/* DOTS */}
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

        {/* CONTENT */}
        <div className="flex flex-col justify-between p-3 md:p-8 text-center flex-1">

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

          {/* NAV */}
          <nav className="flex flex-wrap gap-6 text-[11px] md:text-sm font-semibold tracking-[0.18em] uppercase">

            <a href="#" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Home</span>
              <FaHome className="text-sm mt-1" />
            </a>

            {/* PRODUCTS DROPDOWN */}
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

              {/* DROPDOWN */}
              <div
                className={`absolute left-0 top-full bg-black border border-white/10 rounded-2xl overflow-hidden min-w-[220px] shadow-2xl z-50 transition-all duration-200 ${
                  dropdownOpen
                    ? 'opacity-100 visible translate-y-2'
                    : 'opacity-0 invisible translate-y-0'
                }`}
              >

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

            <a href="#story" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Our Story</span>
              <FaBookOpen className="text-sm mt-1" />
            </a>

            <a href="#contact" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Contact</span>
              <FaPhone className="text-sm mt-1" />
            </a>

          </nav>
        </div>
      </header>
    </main>
  )
}
