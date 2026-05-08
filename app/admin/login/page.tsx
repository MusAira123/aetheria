'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-6 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-white/5 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* LOGIN CARD */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[32px] p-8 md:p-10"
      >

        {/* TITLE */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white tracking-wide">
            Admin Login
          </h1>

          <p className="text-white/60 mt-3 text-sm">
            Access your Aetheria dashboard
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-2xl px-4 py-3 mb-5">

            {error}

          </div>
        )}

        {/* EMAIL */}
        <div className="mb-5">

          <label className="block text-sm text-white/70 mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 rounded-2xl outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-300 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </div>

        {/* PASSWORD */}
        <div className="mb-7">

          <label className="block text-sm text-white/70 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-4 rounded-2xl outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-300 text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:scale-[1.02] hover:bg-gray-100 transition-all duration-300 shadow-xl"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* FOOTER */}
        <div className="mt-8 text-center text-white/40 text-sm">
          Aetheria Admin Panel
        </div>

      </form>

    </div>
  )
}
