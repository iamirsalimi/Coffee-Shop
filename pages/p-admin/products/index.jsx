import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';
import DeleteModal from '@/components/modules/deleteModal/DeleteModal'

import Users from '@/src/Models/User';
import Products from '@/src/Models/Product';
import { verifyRefreshToken } from '@/src/utils/auth';
import {autoFetch} from '@/utils/autoFetch';

import { PiEyeBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { useRouter } from 'next/router';
import { LuTrash2 } from "react-icons/lu";

let toastId = null;

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
        let products = await Products.find({}).populate('comments').lean();

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                products: JSON.parse(JSON.stringify(products)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AllProducts({ user, products }) {
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [search, setSearch] = useState('') // username or email
    const [filterType, setFilterType] = useState('title') // title or isAvailable or is not available or category
    const [filterProductsCategory, setFilterProductsCategory] = useState('COLD') // COLD or HOT or SPECIAL
    const [showModal, setShowModal] = useState(false)
    const [productObj, setProductObj] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [getProducts, setGetProducts] = useState(false)
    const [isPending, setIsPending] = useState(null) // at first when it's just loaded the value is "null" but after that id it requires updating table it will be changed into "true" or "false"

    const getMonth = date => {
        // console.log(date)
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        let hours = registerDate.getHours() < 10 ? `0${registerDate.getHours()}` : registerDate.getHours();
        let minute = registerDate.getMinutes() < 10 ? `0${registerDate.getMinutes()}` : registerDate.getMinutes();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year} ${hours}:${minute}`
    }

    const deleteHandler = async () => {
        try {
            setIsDeleting(true)
            setShowModal(true)
            toastId = toast.loading('deleting product')

            let res = await autoFetch(`/api/products/${productObj._id}`, {
                method: "DELETE"
            })

            if (res.status == 200) {
                setIsPending(true)
                setGetProducts(prev => !prev)
                toast.dismiss(toastId)
                toast.success('product deleted successfully')
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error(err.message)
            console.log(err)
        } finally {
            setIsDeleting(false)
            setShowModal(false)
            setIsPending(false)
        }
    }

    const getProductsHandler = async () => {
        try {
            let res = await autoFetch('/api/products')

            let productsData = await res.json()
            
            if (res.status == 200) {
                setFilteredProducts(productsData.products)
            }

        } catch (err) {
            console.log(err)
        } finally {
            setIsPending(false)
        }
    }

    useEffect(() => {
        switch (filterType) {
            case "title": {
                if (search.trim()) {
                    setFilteredProducts(products.filter(product => product.title.toLowerCase().includes(search.toLowerCase())))
                } else {
                    setFilteredProducts(products)
                }
                break;
            }

            case "available": {
                setFilteredProducts(products.filter(product => product.isAvailable))
                break;
            }

            case "notAvailable": {
                setFilteredProducts(products.filter(product => !product.isAvailable))
                break;
            }

            case "category": {
                setFilteredProducts(products.filter(product => product.category == filterProductsCategory))
                break;
            }

            default: {
                setFilteredProducts(products)
            }
        }
    }, [search, filterType, filterProductsCategory])

    useEffect(() => {
        if (isPending != null) {
            setIsPending(true)
            getProductsHandler()
        }
    }, [getProducts])

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | Products</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Products</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">

                    <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-9 md:gap-2 w-full border border-[#1f1f1f] p-4 pt-10 rounded-3xl bg-black">
                        <Link href='/p-admin/products/addProduct' className="p-3 w-full md:w-fit rounded-2xl cursor-pointer bg-amber-500 hover:bg-amber-600 transition-colors text-black font-bold self-start text-nowrap -mt-5 md:mt-0">Add New Product</Link>
                        {filterType != 'category' ? (
                            <div className="w-full relative select-none">
                                <input
                                    type="text"
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                    value={search}
                                    onChange={e => setSearch(e.target.value.trim())}
                                    placeholder={['available', 'notAvailable'].includes(filterType) ? `${filterType} products ...` : ` product's ${filterType}...`}
                                    disabled={['available', 'notAvailable'].includes(filterType)}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500">Search</span>
                            </div>
                        ) : (
                            <div className="relative w-full">
                                <select
                                    id="filterProductsCategory"
                                    className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f]"
                                    value={filterProductsCategory}
                                    onChange={e => setFilterProductsCategory(e.target.value)}
                                >
                                    <option value="COLD">cold</option>
                                    <option value="HOT">hot</option>
                                    <option value="SPECIAL">special</option>
                                </select>
                                <label
                                    htmlFor='filterProductsCategory'
                                    className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                                >category</label>
                            </div>
                        )}

                        <div className="relative w-full md:w-fit">
                            <select
                                id="filterSelect"
                                className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f]"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="title">title</option>
                                <option value="available">isAvailable</option>
                                <option value="notAvailable">is not Available</option>
                                <option value="category">category</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                            >Filter Type</label>
                        </div>
                    </div>
                    <div className="w-full min-h-[65vh] max-h-[65vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto">

                        <table className="w-full">
                            <thead className="min-w-full">
                                <tr className="py-1 px-2">
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">index</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">title</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">type</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">slug</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">isAvailable</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">comments</th>
                                    <th className="py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center pt-4">
                                {!isPending && filteredProducts?.length > 0 && filteredProducts.map((product, index) => (
                                    <tr key={product?._id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{product?.title}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{product?.category == 'COLD' ? 'Cold' : product.category == 'HOT' ? 'Hot' : 'Special'}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{product?.slug}</td>
                                        <td className={`text-nowrap py-1 pb-3 px-2 text-sm ${product?.isAvailable ? 'text-green-500' : 'text-red-500'}`}>{product?.isAvailable ? 'true' : 'false'}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{product.comments.length}</td>
                                        <td className="py-1 pb-3 px-2 text-sm flex items-center justify-center gap-1">
                                            <a
                                                href={`/p-admin/products/editProduct/${product?.slug}`}
                                                className="inline-flex items-center gap-1 p-1 rounded-md cursor-pointer bg-sky-500/10 hover:bg-sky-500/25 transition-colors group"
                                            >
                                                <MdEdit className="text-sky-500 group-hover:text-white transition-all" />
                                                <span className="text-sky-500 group-hover:text-white transition-colors ">edit</span>
                                            </a>
                                            <a
                                                href={`/p-admin/products/${product?.slug}`}
                                                className="inline-flex items-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-green-500/10 hover:bg-green-500/25 transition-colors group"
                                            >
                                                <FaEye className="text-green-500 group-hover:text-white transition-all" />
                                                <span className="text-green-500 group-hover:text-white transition-colors ">details</span>
                                            </a>

                                            <button
                                                className="inline-flex items-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-red-500/10 hover:bg-red-500/25 transition-colors group"
                                                onClick={e => {
                                                    setProductObj(product);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <LuTrash2 className="text-red-500 group-hover:text-white transition-all" />
                                                <span className="text-red-500 group-hover:text-white transition-colors">Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!isPending && filteredProducts?.length == 0 && (
                            <div className="text-center text-white my-auto mt-36">there is no product with {filterType == 'title' ? `"${search}" ${filterType}` : `${filterType == 'type' ? `${filterType} ${filterProductsCategory}` : `${filterType} property`}`} </div>
                        )}

                        {isPending && (
                            <div className="text-center text-white my-auto mt-36">loading new Products data ...</div>
                        )}
                    </div>
                </div >
            </div >
            <DeleteModal showModal={showModal} setShowModal={setShowModal} title={productObj?.title} deleteHandler={deleteHandler} isDeleting={isDeleting} />
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div >
    )
}

AllProducts.noLayout = true

export default AllProducts