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
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaDownload
} from 'react-icons/fa'

// ==================== ATTRACTIVE LIGHTBOX MODAL (FIXED ZOOM ISSUE) ====================
function ImageLightbox({
  images,
  initialIndex,
  onClose,
  productName
}: {
  images: string[]
  initialIndex: number
  onClose: () => void
  productName: string
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [animate, setAnimate] = useState(false)

  // Animate on mount
  useEffect(() => {
    setAnimate(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false) // Reset zoom when changing image
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev()
      else goNext()
    }
    setTouchStart(0)
  }

  const handleDownload = async () => {
    const link = document.createElement('a')
    link.href = images[currentIndex]
    link.download = `${productName.replace(/\s+/g, '_')}_${currentIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsZoomed(!isZoomed)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        animate ? 'bg-black/95 backdrop-blur-md' : 'bg-black/0 backdrop-blur-0'
      }`}
      onClick={onClose}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/80 to-gold-500/10 pointer-events-none" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 backdrop-blur-md transition-all duration-300 z-20 hover:scale-110"
      >
        <FaTimes className="text-xl md:text-2xl" />
      </button>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-20 md:top-6 md:right-24 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 backdrop-blur-md transition-all duration-300 z-20 hover:scale-110"
      >
        <FaDownload className="text-lg md:text-xl" />
      </button>

      {/* Product name */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm md:text-base font-medium z-20 whitespace-nowrap max-w-[80vw] truncate shadow-lg">
        {productName}
      </div>

      {/* Main Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image wrapper with zoom toggle */}
        <div
          className={`transition-all duration-300 ease-out cursor-zoom-in ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onClick={toggleZoom}
          style={{ willChange: 'transform' }}
        >
          <img
            src={images[currentIndex]}
            alt={`${productName} view ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-3 md:p-5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-glow group"
            >
              <FaChevronLeft className="text-xl md:text-3xl group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-3 md:p-5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-glow group"
            >
              <FaChevronRight className="text-xl md:text-3xl group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-mono tracking-wide">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                  setIsZoomed(false)
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-3 h-3 bg-white scale-100'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70 hover:scale-110'
                }`}
              />
            ))}
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none">
          Click image to zoom
        </div>
      </div>

      <style jsx>{`
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px rgba(255,215,0,0.5);
        }
      `}</style>
    </div>
  )
}

// ==================== PRODUCT CARD ====================
function ProductCard({ product }: any) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image_url]

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const openLightbox = () => {
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-2">
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 overflow-hidden">
          <div className="absolute inset-[-200%] animate-snake-border bg-[conic-gradient(from_0deg,_transparent,_transparent,_#d4af37,_transparent,_transparent)]"></div>
        </div>

        <div className="relative bg-white overflow-hidden rounded-3xl z-10 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col">
          {/* Image area */}
          <div
            className="relative w-full h-[190px] md:h-[360px] overflow-hidden flex items-center justify-center bg-black cursor-pointer group/image"
            onClick={openLightbox}
          >
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-300 z-20 opacity-0 group-hover/image:opacity-100"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-300 z-20 opacity-0 group-hover/image:opacity-100"
                >
                  ›
                </button>
              </>
            )}

            {images.length > 1 && (
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrent(index)
                    }}
                    className={`transition-all duration-300 rounded-full
                    ${
                      index === current
                        ? 'w-4 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover/image:opacity-100 transition-opacity z-20 pointer-events-none">
              <FaExpand className="text-white text-xs" />
            </div>
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
              <p className="font-bold text-base md:text-2xl">₹{product.price}</p>
              <p className="text-[10px] md:text-sm mt-1 md:mt-2 text-gray-700">
                Available Qty: {product.qty}
              </p>
              <a
                href={`https://wa.me/918055100913?text=Hi, I want ${product.name}`}
                className="inline-block mt-3 md:mt-6 bg-green-600 text-white px-4 py-2 md:py-3 rounded-2xl w-full text-center text-[11px] md:text-base transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
              >
                Buy on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={current}
          onClose={() => setLightboxOpen(false)}
          productName={product.name}
        />
      )}
    </>
  )
}

// ==================== MAIN HOME PAGE ====================
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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
              <a href="#shop" className="flex flex-col items-center hover:text-yellow-400 transition">
                <span>Products</span>
                <FaBoxOpen className="text-sm mt-1" />
              </a>
              <div
                className={`absolute left-0 top-full pt-2 min-w-[220px] z-50 transition-all duration-200 ${
                  dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        const element = categoryRefs.current[cat]
                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

      <section className="px-6 md:px-12 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <div className="w-full flex justify-start ml-[40px] md:ml-[-120px]">
            <img src="/logo.png" className="h-56 md:h-64 lg:h-80 object-contain" />
          </div>
          <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl px-6 py-3 shadow-md w-[340px] md:w-[420px] h-[60px] flex items-center">
            <p className="text-sm md:text-base font-semibold tracking-wide">{quotes[currentQuote]}</p>
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            Premium Jewelry
            <br />
            Built for Everyday Luxury
          </h2>
          <p className="text-gray-600 text-lg">Waterproof • Anti-Tarnish • Modern Minimal Designs</p>
          <div className="flex gap-4">
            <a href="#shop" className="bg-black text-white px-6 py-3 rounded-lg">
              Shop Now
            </a>
            <a href="https://wa.me/918055100913" className="flex items-center gap-2 border px-6 py-3 rounded-lg">
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

      <section id="shop" className="px-6 md:px-12 py-20">
        <h3 className="text-3xl font-bold mb-14">Shop By Categories</h3>
        {categories.map((category) => {
          const filteredProducts = products.filter((p) => p.category === category)
          if (filteredProducts.length === 0) return null
          return (
            <div
              key={category}
              ref={(el) => { categoryRefs.current[category] = el }}
              className="mb-20"
            >
              <h4 className="text-2xl font-bold mb-8">{category}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )
        })}
      </section>

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
