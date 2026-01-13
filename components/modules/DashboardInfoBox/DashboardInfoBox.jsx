import React from 'react'

function DashboardInfoBox({title , value , color , children}) {
    return (
        <div className="py-3 px-4 flex items-center justify-between panel-box border border-[#1f1f1f] bg-[#0f0f0f] text-gray-400 rounded-xl">
            <div className="flex flex-col justify-center gap-1">
                <h2 className="text-gray-500 text-xs xl:text-sm">{title}</h2>
                <span className="text-white font-bold text-sm xl:text-base">{value}</span>
            </div>
            <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${color} hover:scale-110 transition-transform`}>
                {children}
            </div>
        </div>
    )
}

export default DashboardInfoBox