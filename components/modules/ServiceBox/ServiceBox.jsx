import React from 'react'

function ServiceBox({children , title , description}) {
  return (
    <div className="border border-[#1f1f1f] bg-[#0f0f0f] flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-2 md:gap-5 rounded-4xl py-4 px-5">
            {children}
        <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start gap-2">
            <h3 className="text-white font-bold text-base xs:text-lg">{title}</h3>
            <p className="text-gray-400 text-sm text-center lg:text-justify">{description}</p>
        </div>
    </div>
  )
}

export default ServiceBox
