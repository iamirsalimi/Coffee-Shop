import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import { useAuth } from '@/Context/AuthContext';
import { useBasket } from '@/Context/BasketContext';
import Comment from '@/components/modules/Comment/Comment';

import PanelSideBar from '@/components/modules/PanelSideBar/PanelSideBar';

import { MdKeyboardArrowLeft } from "react-icons/md";


import Users from '@/src/Models/User'
import { verifyRefreshToken } from '@/src/utils/auth';

export async function getServerSideProps(context) {
    try {
        let { refreshToken } = context.req.cookies

        if (!refreshToken) {
            return {
                redirect: { destination: '/' }
            }
        }

        let tokenPayload = verifyRefreshToken(refreshToken)

        if (!tokenPayload) {
            return {
                redirect: { destination: '/' }
            }
        }
        let user = await Users.findOne({ _id: tokenPayload.userId })
        console.log(user, user.role)

        if (user.role == 'ADMIN') {
            return {
                redirect: { destination: '/p-admin' }
            }
        }

        return {
            props: {

            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function Comments({ }) {
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState(null)
    const [err, setErr] = useState(null)

    console.log('comments ', comments);

    const { user } = useAuth()

    useEffect(() => {
        let getComments = async () => {
            try {
                let res = await fetch(`/api/comments/username/${user.username}`)
                const resData = await res.json()

                console.log('comments res ', resData)
                setComments(resData.reverse())
            } catch (err) {
                setErr(err)
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        if (user) {
            console.log(user)
            getComments()
        }
    }, [user])

    return (
        <div className="flex gap-5 max-h-fit lg:max-h-screen overflow-hidden pb-20 md:pb-10 lg:pb-0">
            <PanelSideBar />
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Comments History</span>
                </div>

                <div className="flex flex-col gap-5 min-h-[80vh] max-h-[80vh] place-content-start lg:pr-5 p-5 rounded-3xl bg-black overflow-y-auto">
                    {!loading ? comments?.length > 0 ? comments.map(comment => (
                        <Comment key={comment.id} panelFlag {...comment} />
                    )) : (
                        <div className="flex flex-col items-center gap-2 my-auto">
                            <h2 className=" text-white text-center font-bold text-sm sm:text-base md:text-xl">you haven't left a comment yet</h2>

                        </div>
                    ) : (
                        <div className="text-white text-center font-bold text-sm sm:text-base md:text-xl my-auto">Loading Comments...</div>
                    )}
                </div>
            </div>
        </div>
    )
}

// export const getStaticProps = async () => {
//     try {
//         await connectToDB();

//         let comments = await commentsModel.find({})

//         // console.log(products)

//         return {
//             props: {
//                 comments: JSON.parse(JSON.stringify(comments))
//             }
//         }


//     } catch (err) {
//         return {
//             props: { err: "there is an unknown err" }
//         }
//     }
// }


Comments.noLayout = true

export default Comments