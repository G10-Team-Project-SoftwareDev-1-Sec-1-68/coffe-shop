import React from 'react'
import Header from '../components/Header'

const page = () => {
  return (
    <div>page
        <Header />
        <div className="flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Order
                </h1>
            </div>
        </div>
    </div>
  )
}

export default page