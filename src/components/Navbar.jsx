import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span  className="text-2xl font-bold">YouClone</span>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 border rounded">Upload</span>
        </div>
      </div>
    </header>
  )
}
