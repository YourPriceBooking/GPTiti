import React from 'react'
import Link from "next/link";

export default function Home () {
  return (
   <>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
        <Link href = '/sign-in'>Sign in</Link>
        <Link href= '/our-mission'>Our Mission</Link>
        </div>
   </>
  )
}
