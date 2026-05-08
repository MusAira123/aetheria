'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import {
  FaWhatsapp,
  FaInstagram,
  FaHome,
  FaBoxOpen,
  FaBookOpen,
  FaPhone
} from 'react-icons/fa'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [currentImage, setCurrentImage] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(0)

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

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md text-white px-6 md:px-12 py-4 rounded-b-3xl">

        <div className="flex justify-start items-center">

          {/* NAV */}
          <nav className="flex gap-6 text-[11px] md:text-sm font-semibold tracking-[0.18em] uppercase">

            <a href="#" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Home</span>
              <FaHome className="text-sm mt-1" />
            </a>

            <a href="#shop" className="flex flex-col items-center hover:text-yellow-400 transition">
              <span>Products</span>
              <FaBoxOpen className="text-sm mt-1" />
            </a>

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

          {/* LOGO */}
          <div className="w-full flex justify-start ml-[-40px] md:ml-[-80px]">

            <img
              src="/logo.png"
              className="h-64 md:h-64 lg:h-80 object-contain"
            />

          </div>

          {/* QUOTE SLIDER */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl px-6 py-3 shadow-md w-[340px] md:w-[420px] h-[60px] flex items-center">

            <p className="text-sm md:text-base font-semibold tracking-wide">
              {quotes[currentQuote]}
            </p>

          </div>

          {/* HEADING */}
          <h2 className="text-5xl font-bold leading-tight">
            Premium Jewelry<br />
            Built for Everyday Luxury
          </h2>

          {/* SUBTEXT */}
          <p className="text-gray-600 text-lg">
            Waterproof • Anti-Tarnish • Modern Minimal Designs
          </p>

          {/* BUTTONS */}
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

        {/* HERO IMAGE */}
        <div className="relative w-full h-[480px] md:h-[560px] lg:h-[700px]">

          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              onError={(e) => (e.currentTarget.src = heroImages[0])}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-1000
              ${index === currentImage ? 'opacity-100 z-10' : 'opacity-0'}`}
            />
          ))}

        </div>

      </section>

      {/* PRODUCTS */}
      <section id="shop" className="px-6 md:px-12 py-20">

        <h3 className="text-3xl font-bold mb-10">
          Best Products
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

          {products.map((p) => (

            <div
              key={p.id}
              className="group relative overflow-hidden rounded-[72%_28%_58%_42%/38%_66%_34%_62%] p-[1px] transition-all duration-700 hover:-translate-y-6 hover:rotate-[-3deg]"
            >

              {/* SNAKE BORDER */}
              <div className="absolute inset-0 rounded-[72%_28%_58%_42%/38%_66%_34%_62%] opacity-0 group-hover:opacity-100 transition duration-500 overflow-hidden">

                <div className="absolute inset-[-200%] animate-snake-border bg-[conic-gradient(from_0deg,_transparent,_transparent,_#d4af37,_transparent,_transparent)]"></div>

              </div>

              {/* CARD CONTENT */}
              <div className="relative bg-white overflow-hidden rounded-[72%_28%_58%_42%/38%_66%_34%_62%] min-h-[620px] z-10 shadow-sm group-hover:shadow-[0_35px_90px_rgba(0,0,0,0.25)] transition-all duration-700 flex flex-col">

                {/* IMAGE */}
                <div className="relative w-full h-[360px] overflow-hidden flex items-center justify-center">

                  <img
                    src={p.image_url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col justify-between p-8 text-center">

                  <div>

                    <h4 className="font-semibold text-2xl leading-snug">
                      {p.name}
                    </h4>

                    <p className="text-gray-600 text-sm mt-3 leading-relaxed px-2">
                      {p.description}
                    </p>

                  </div>

                  <div className="mt-6">

                    <p className="font-bold text-2xl">
                      ₹{p.price}
                    </p>

                    <p className="text-sm mt-2 text-gray-700">
                      Qty: {p.qty}
                    </p>

                    <a
                      href={`https://wa.me/918055100913?text=Hi, I want ${p.name}`}
                      className="inline-block mt-6 bg-green-600 text-white px-4 py-3 rounded-2xl w-full text-center transition-all duration-300 hover:bg-green-700"
                    >
                      Buy on WhatsApp
                    </a>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* STORY */}
      <section id="story" className="px-6 md:px-12 py-20 bg-gray-50">

        <h3 className="text-3xl font-bold mb-6">
          Our Story
        </h3>

        <p className="text-gray-600 max-w-3xl leading-relaxed">
          Aetheria was created to bring everyday luxury into modern life.
          Jewelry should not be reserved for occasions — it should be worn daily.

          <br /><br />

          Our pieces are waterproof, anti-tarnish, and crafted to last.

          <br /><br />

          We create more than jewelry — we create confidence.
        </p>

      </section>

      {/* INSTAGRAM */}
      <section className="px-6 md:px-12 py-20 text-center">

        <h3 className="text-3xl font-bold mb-4">
          Follow Us on Instagram
        </h3>

        <p className="mb-6 text-gray-600">
          @_aetheria___
        </p>

        <div className="flex justify-center">

          <img
            src="/insta-qr.jpg"
            className="w-64 rounded-xl shadow-lg border"
          />

        </div>

      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="bg-black text-white px-6 md:px-12 py-10 mt-18 rounded-t-3xl"
      >

        <div className="grid md:grid-cols-4 gap-25">

          {/* BRAND */}
          <div>

            <img
              src="/logo.png"
              className="h-25 mb-1"
            />

            <p className="text-gray-400 text-sm leading-relaxed">
              Aetheria brings modern luxury jewelry designed for everyday wear.
              Durable, elegant, and timeless.
            </p>

          </div>

          {/* LINKS */}
          <div>

            <h4 className="text-lg font-semibold mb-4">
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#">Home</a></li>
              <li><a href="#shop">Products</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>

          </div>

          {/* WHY US */}
          <div>

            <h4 className="text-lg font-semibold mb-4">
              Why Choose Us
            </h4>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>✨ Waterproof Jewelry</li>
              <li>✨ Anti-Tarnish</li>
              <li>✨ Premium Quality</li>
              <li>✨ Hypoallergenic</li>
              <li>✨ Long Lasting Shine</li>
            </ul>

          </div>

          {/* CONTACT */}
          <div>

            <h4 className="text-lg font-semibold mb-4">
              Contact
            </h4>

            <p className="text-gray-400 text-sm">
              📞 +91 8055100913
            </p>

            <div className="flex gap-6 mt-4 items-center">

              <a
                href="https://www.instagram.com/_aetheria___"
                className="flex items-center gap-2 hover:text-pink-400"
              >
                <FaInstagram className="text-xl" />
                Instagram
              </a>

              <a
                href="https://wa.me/918055100913"
                className="flex items-center gap-2 hover:text-green-400"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp
              </a>

            </div>

          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
          © 2026 Aetheria. Crafted with elegance.
        </div>

      </footer>

    </main>
  )
}
