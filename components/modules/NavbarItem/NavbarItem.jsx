import React, { useRef } from 'react'

function NavbarItem({ linkTitle , setPosition }) {
    let ref = useRef(null)
    return (
        <li 
            ref={ref}
            onMouseEnter={() => {
                if(!ref.current) return;

                // give us some infos about our Element
                const {width} = ref.current.getBoundingClientRect()
                
                setPosition({
                    // gives us the distance from the left part of the nearest parent which has non-static position which is the navbar wrapper
                    left : ref.current.offsetLeft,
                    width,
                    opacity : 1
                })
            }}
            className="relative z-10 block cursor-pointer py-1.5 text-white uppercase mix-blend-difference px-3 font-sans font-bold"
        >
            {linkTitle}
        </li>
    )
}

export default NavbarItem