import React from 'react'

function Title({ title }) {
    return (
        <h1 className="mx-auto sm:mx-0 relative z-20 w-fit text-2xl xs:text-3xl sm:text-4xl font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-1/3 after:w-full after:rounded-full after:bg-sky-900 after:-z-10">{title}</h1>
    )
}

export default Title
