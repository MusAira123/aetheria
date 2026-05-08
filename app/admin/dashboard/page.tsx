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
    const { data } = await supabase
      .from('products')
      .select('*')

    setProducts(data || [])
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">

      {/* HEADER */}
      <div className="bg-black text-white rounded-3xl shadow-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

        <div>

          <h1 className="text-3xl font-bold tracking-wide">
            Admin Dashboard
          </h1>

          <p className="text-white/60 mt-2 text-sm">
            Manage your products, inventory & categories
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => router.push('/admin/add-product')}
            className="bg-white text-black px-5 py-3 rounded-2xl font-medium hover:scale-105 transition-all duration-300 shadow-lg"
          >
            + Add Product
          </button>

          <button
            onClick={logout}
            className="border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            Logout
          </button>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        {/* TOTAL PRODUCTS */}
        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500 text-sm">
            Total Products
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {products.length}
          </h2>

        </div>

        {/* CATEGORIES */}
        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500 text-sm">
            Categories
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {
              [...new Set(products.map((p) => p.category))]
                .length
            }
          </h2>

        </div>

        {/* TOTAL INVENTORY */}
        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500 text-sm">
            Total Inventory
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {
              products.reduce(
                (acc, p) => acc + (p.qty || 0),
                0
              )
            }
          </h2>

        </div>

        {/* TOTAL AMOUNT */}
        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500 text-sm">
            Total Amount (All Available Products)
          </p>

          <h2 className="text-4xl font-bold mt-2">
            ₹
            {
              products.reduce(
                (acc, p) =>
                  acc + ((p.price || 0) * (p.qty || 0)),
                0
              )
            }
          </h2>

        </div>

      </div>

      {/* TITLE */}
      <div className="flex items-center justify-between mb-8">

        <h2 className="text-2xl font-bold text-gray-800">
          Products
        </h2>

        <p className="text-gray-500 text-sm">
          {products.length} items available
        </p>

      </div>

      {/* PRODUCTS BY CATEGORY */}
      <div className="space-y-14">

        {[
          "Earrings",
          "Rings",
          "Bracelets",
          "Gift Hampers",
          "Hair Accessories",
          "Necklace"
        ].map((category) => {

          const categoryProducts = products.filter(
            (p) => p.category === category
          )

          if (categoryProducts.length === 0) return null

          return (
            <div key={category}>

              {/* CATEGORY HEADER */}
              <div className="flex items-center justify-between mb-6">

                <div>

                  <h3 className="text-3xl font-bold text-gray-900">
                    {category}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {categoryProducts.length} Products
                  </p>

                </div>

                <div className="h-[2px] flex-1 bg-gradient-to-r from-black/20 to-transparent ml-6 rounded-full"></div>

              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {categoryProducts.map((p) => (

                  <div
                    key={p.id}
                    className="group bg-white rounded-[32px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >

                    {/* IMAGE */}
                    <div className="relative overflow-hidden">

                      <img
                        src={
                          p.images?.length > 0
                            ? p.images[0]
                            : p.image_url
                        }
                        className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* CATEGORY BADGE */}
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs tracking-wide">

                        {p.category || 'No Category'}

                      </div>

                      {/* IMAGE COUNT */}
                      <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-xs font-medium">

                        {p.images?.length || 1} Photos

                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-6">

                      {/* NAME */}
                      <h3 className="font-bold text-2xl text-gray-900">
                        {p.name}
                      </h3>

                      {/* PRICE */}
                      <p className="text-2xl font-semibold mt-3 text-black">
                        ₹{p.price}
                      </p>

                      {/* QTY */}
                      <div className="mt-4 flex items-center justify-between">

                        <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium text-gray-700">

                          Available Qty: {p.qty}

                        </div>

                        <div className="text-sm text-gray-500">

                          ID: {p.id}

                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-3 mt-6">

                        <button
                          onClick={() => router.push(`/admin/edit/${p.id}`)}
                          className="flex-1 bg-black text-white py-3 rounded-2xl font-medium hover:opacity-90 transition-all duration-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            const confirmDelete = confirm(
                              'Delete this product?'
                            )

                            if (!confirmDelete) return

                            await supabase
                              .from('products')
                              .delete()
                              .eq('id', p.id)

                            fetchProducts()
                          }}
                          className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-medium hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}
