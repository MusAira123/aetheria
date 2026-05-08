'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddProduct() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [qty, setQty] = useState('')
  const [category, setCategory] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const uploadProduct = async () => {
    if (files.length === 0) {
      alert('Please upload images')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('Please login first ❌')
        setLoading(false)
        return
      }

      const uploadedUrls: string[] = []

      // Upload max 3 images
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

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

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrlData.publicUrl)
      }

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name,
          price: Number(price),
          description,
          qty: Number(qty),
          category,
          images: uploadedUrls,
          image_url: uploadedUrls[0],
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

        {/* Quantity */}
        <input
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Quantity"
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {/* Category */}
        <select
          className="w-full border p-3 rounded-lg mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option>Earrings</option>
          <option>Rings</option>
          <option>Bracelets</option>
          <option>Gift Hampers</option>
          <option>Hair Accessories</option>
          <option>Necklace</option>
        </select>

        {/* Description */}
        <textarea
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Multiple Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="mb-4"
          onChange={(e) => {
            const selectedFiles = e.target.files
              ? Array.from(e.target.files).slice(0, 3)
              : []

            setFiles(selectedFiles)
          }}
        />

        <p className="text-sm text-gray-500 mb-4">
          Maximum 3 images allowed
        </p>

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
