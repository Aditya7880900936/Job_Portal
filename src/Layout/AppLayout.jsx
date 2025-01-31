import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
      <div className='grid-background'></div>
      <main className='min-h-screen container mx-auto'>
         <Header/>
         <Outlet/>
      </main>
      <div className='p-5 text-center bg-gray-800 mt-5'>
        Made With 💗 By Aditya
      </div>
    </div>
  )
} 

export default AppLayout
 