'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddProduct() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [qty, setQty] = useState('') // ✅ NEW
  const [loading, setLoading] = useState(false)

  const uploadProduct = async () => {
    if (!file) {
      alert('Please upload image')
      return
    }

    setLoading(true)

    try {
      // ✅ Check auth
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Please login first ❌')
        setLoading(false)
        return
      }

      // 📦 Generate safe filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      // 📦 Upload image
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('UPLOAD ERROR FULL:', uploadError)
        alert(uploadError.message)
        setLoading(false)
        return
      }

      // 🔗 Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      const imageUrl = publicUrlData.publicUrl

      // 🧠 Insert product (with qty)
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name,
          price: Number(price),
          description,
          image_url: imageUrl,
          qty: Number(qty) // ✅ NEW
        })

      if (insertError) {
        console.error('INSERT ERROR:', insertError)
        alert(insertError.message)
        setLoading(false)
        return
      }

      alert('Product added 🎉')
      router.push('/admin/dashboard')

    } catch (err: any) {
      console.error('UNKNOWN ERROR:', err)
      alert(err.message || 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-sm">

        <h1 className="text-2xl font-semibold mb-6">
          Add Product
        </h1>

        {/* Product Name */}
        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Price */}
        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* ✅ Quantity */}
        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Quantity"
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* File Upload */}
        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {/* Submit */}
        <button
          onClick={uploadProduct}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>

      </div>
    </div>
  )
}