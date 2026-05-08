'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/admin/login')
      }
    }

    checkUser()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">

        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/add-product')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Add Product
          </button>

          <button
            onClick={logout}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

      </div>

      {/* TITLE */}
      <h2 className="text-lg font-medium mb-4 text-gray-700">
        Products
      </h2>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {products.length === 0 ? (
          <p className="text-gray-500">No products yet</p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
            >

              <img
                src={p.image_url}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">

                <h3 className="font-semibold text-lg">
                  {p.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  ₹{p.price}
                </p>

                {/* ✅ NEW: QTY DISPLAY */}
                <p className="text-sm mt-1">
                  Qty: {p.qty}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => router.push(`/admin/edit/${p.id}`)}
                    className="flex-1 bg-blue-500 text-white py-1.5 rounded-md text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      const confirmDelete = confirm('Delete this product?')
                      if (!confirmDelete) return

                      await supabase.from('products').delete().eq('id', p.id)
                      fetchProducts()
                    }}
                    className="flex-1 bg-red-500 text-white py-1.5 rounded-md text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}