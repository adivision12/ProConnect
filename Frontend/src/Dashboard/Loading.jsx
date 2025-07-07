import React from 'react'

export default function Loading() {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
  </div>
  )
}
