import React from 'react'

function Comment({ username, date, description }) {
    return (
        <div className="p-4 border border-[#1f1f1f] rounded-2xl bg-[#0c0c0c] space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-300">Amir</span>
                <span>2 days ago</span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
                The coffee was rich and well-balanced. I especially loved the aroma and the smooth finish.
            </p>
        </div>
    )
}

export default Comment