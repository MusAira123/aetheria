'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)

    // ✅ FIX: removed .order('created_at')
    const { data, error } = await supabase
      .from('products')
      .select('*')

    console.log("PRODUCTS:", data)
    console.log("ERROR:", error)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setProducts(data ?? [])
    setLoading(false)
  }

  const buyOnWhatsApp = (product: any) => {
    const message = `Hi, I want to buy:
Product: ${product.name}
Price: ₹${product.price}`

    const url = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return <div className="p-6">Loading products...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow">

            {/* IMAGE SAFE */}
            {p.image_url ? (
              <img
                src={p.image_url}
                className="h-40 w-full object-cover rounded"
              />
            ) : (
              <div className="h-40 w-full bg-gray-200 flex items-center justify-center rounded">
                No Image
              </div>
            )}

            <h2 className="text-xl font-semibold mt-2">
              {p.name}
            </h2>

            <p className="text-gray-600">
              {p.description}
            </p>

            <p className="font-bold mt-2">
              ₹{p.price}
            </p>

            <button
              onClick={() => buyOnWhatsApp(p)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Buy on WhatsApp
            </button>

          </div>
        ))}

      </div>
    </div>
  )
}