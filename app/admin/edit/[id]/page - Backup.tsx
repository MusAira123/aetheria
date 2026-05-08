'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()

  const productId = Array.isArray(params.id)
    ? params.id[0]
    : params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [qty, setQty] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (data) {
      setName(data.name || '')
      setPrice(data.price || '')
      setDescription(data.description || '')
      setQty(data.qty || '')
      setCategory(data.category || '')
      setImage(
        data.images?.length > 0
          ? data.images[0]
          : data.image_url || ''
      )
    }
  }

  const updateProduct = async () => {
    setLoading(true)

    let imageUrl = image

    // UPLOAD NEW IMAGE
    if (newImage) {

      const fileExt = newImage.name.split('.').pop()

      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, newImage)

      if (uploadError) {
        alert(uploadError.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const { error } = await supabase
      .from('products')
      .update({
        name,
        price: Number(price),
        description,
        qty: Number(qty),
        category,
        image_url: imageUrl,
        images: [imageUrl],
      })
      .eq('id', productId)

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Product updated successfully 🎉')

    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">

      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Edit Product
          </h1>

          <p className="text-white/60 mt-2">
            Update your product details
          </p>

        </div>

        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-white/10 border border-white/10 backdrop-blur-md text-white px-5 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
        >
          Back to Dashboard
        </button>

      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT - FORM */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

          {/* PRODUCT NAME */}
          <div className="mb-6">

            <label className="block text-sm text-white/70 mb-3">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 rounded-2xl outline-none focus:border-white/50 transition-all duration-300"
            />

          </div>

          {/* PRICE */}
          <div className="mb-6">

            <label className="block text-sm text-white/70 mb-3">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 rounded-2xl outline-none focus:border-white/50 transition-all duration-300"
            />

          </div>

          {/* QUANTITY */}
          <div className="mb-6">

            <label className="block text-sm text-white/70 mb-3">
              Available Quantity
            </label>

            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Enter quantity"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 rounded-2xl outline-none focus:border-white/50 transition-all duration-300"
            />

          </div>

          {/* CATEGORY */}
          <div className="mb-6">

            <label className="block text-sm text-white/70 mb-3">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white px-5 py-4 rounded-2xl outline-none focus:border-white/50 transition-all duration-300"
            >
              <option className="text-black">Earrings</option>
              <option className="text-black">Rings</option>
              <option className="text-black">Bracelets</option>
              <option className="text-black">Gift Hampers</option>
              <option className="text-black">Hair Accessories</option>
              <option className="text-black">Necklace</option>
            </select>

          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">

            <label className="block text-sm text-white/70 mb-3">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Enter product description"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 rounded-2xl outline-none focus:border-white/50 transition-all duration-300 resize-none"
            />

          </div>

          {/* IMAGE UPDATE */}
          <div className="mb-8">

            <label className="block text-sm text-white/70 mb-3">
              Update Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]

                if (file) {
                  setNewImage(file)
                  setImage(URL.createObjectURL(file))
                }
              }}
              className="w-full bg-white/10 border border-white/20 text-white file:bg-white file:text-black file:border-0 file:px-4 file:py-2 file:rounded-xl file:mr-4 px-5 py-4 rounded-2xl"
            />

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex-1 border border-white/20 bg-white/10 backdrop-blur-md text-white py-4 rounded-2xl font-medium hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>

            <button
              onClick={updateProduct}
              disabled={loading}
              className="flex-1 bg-white text-black py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-xl"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>

          </div>

        </div>

        {/* RIGHT - LIVE PREVIEW */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl">

          {/* IMAGE */}
          <div className="relative h-[420px] overflow-hidden">

            {image ? (
              <img
                src={image}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
                No Image
              </div>
            )}

            {/* CATEGORY BADGE */}
            <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">

              {category || 'Category'}

            </div>

          </div>

          {/* CONTENT */}
          <div className="p-8">

            <h2 className="text-4xl font-bold text-gray-900">
              {name || 'Product Name'}
            </h2>

            <p className="text-3xl font-semibold mt-4">
              ₹{price || '0'}
            </p>

            <div className="mt-5 inline-block bg-gray-100 px-5 py-3 rounded-2xl text-gray-700 font-medium">

              Available Qty: {qty || '0'}

            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
              {description || 'Product description will appear here...'}
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}