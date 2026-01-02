import Header from '@/components/layouts/Menu/Header'
import MenuItems from '@/components/layouts/Menu/MenuItems'
import React from 'react'

function Menu() {
  return (
    <div className="w-full h-full flex flex-col">
        <Header />
        <MenuItems />

    </div>
  )
}

export default Menu