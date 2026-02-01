import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BiMoviePlay } from "react-icons/bi";

import Users from '@/src/Models/User';
import { verifyRefreshToken } from '@/src/utils/auth';
import {autoFetch} from '@/utils/autoFetch';

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
        // console.log(user, user.role)

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user))
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AddProduct({ user }) {
    const [ingredientText, setIngredientText] = useState('')
    const [ingredients, setIngredients] = useState([])
    const [file, setFile] = useState(null)
    const [isAdding, setIsAdding] = useState(false)

    const schema = yup.object().shape({
        title: yup.string().required('title is mandatory'),
        slug: yup.string().required('slug is mandatory'),
        summary: yup.string().required('summary is mandatory'),
        description: yup.string().required('description is mandatory'),
        smallPrice: yup
            .number()
            .min(0, 'smallPrice should be more than 0')
            .required('smallPrice is mandatory')
        ,
        mediumPrice: yup
            .number()
            .min(0, 'mediumPrice should be more than 0')
            .required('mediumPrice is mandatory')
        ,
        largePrice: yup
            .number()
            .min(0, 'largePrice should be more than 0')
            .required('largePrice is mandatory')
        ,
        category: yup
            .string()
            .oneOf(['HOT', "COLD", "SPECIAL"], "category only can have 'HOT' , 'COLD' and 'SPECIAL'")
            .required(),
        ingredients: yup.array().min(1, 'ingredient should have at least 1 item').required()
    })

    let {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        default: {
            smallPrice: 0,
            mediumPrice: 0,
            largePrice: 0,
            category: 'HOT'
        },
        resolver: yupResolver(schema),
    });

    const errorNotify = text => {
        toast.error(text)
    }

    const addIngredient = e => {
        e.preventDefault();
        let allIngredients = new Set(ingredients)
        allIngredients.add(ingredientText)
        setIngredientText('')
        setIngredients([...allIngredients])
        setValue('ingredients', [...ingredients, ingredientText], { shouldValidate: true })
    }

    const removeIngredient = (e, ingredient) => {
        e.preventDefault();
        let allIngredients = new Set(ingredients)
        allIngredients.delete(ingredient)

        setIngredients(allIngredients)

        setIngredients([...allIngredients])
        setValue('ingredients', [...allIngredients], { shouldValidate: true })
    }

    const addProductHandler = async (data) => {
        let newProduct = new FormData();

        toastId = toast.loading('adding product')
        setIsAdding(true)

        if (!file) {
            toast.error('product image file is mandatory')
            return false;
        }

        newProduct.append('title', data.title)
        newProduct.append('slug', data.slug.split(' ').join('-'))
        newProduct.append('summary', data.summary)
        newProduct.append('description', data.description)
        newProduct.append('smallPrice', data.smallPrice)
        newProduct.append('mediumPrice', data.mediumPrice)
        newProduct.append('largePrice', data.largePrice)
        newProduct.append('category', data.category)
        newProduct.append('ingredients', JSON.stringify([...data.ingredients]))
        newProduct.append('image', file)

        console.log(data, newProduct)
        try {
            let res = await autoFetch('/api/products', {
                method: "POST",
                body: newProduct
            } , true)

            let resData = await res.json();

            if (res.status == 400) {
                toast.dismiss(toastId)
                toast.error(resData.message)
            }

            if (res.status == 201) {
                toast.dismiss(toastId)
                toast.success('product has added successfully')

                setValue('title', '')
                setValue('slug', '')
                setValue('summary', '')
                setValue('description', '')
                setValue('smallPrice', '')
                setValue('mediumPrice', '')
                setValue('largePrice', '')
                setValue('category', 'HOT')
                setValue('ingredients', '')
                setValue('ingredients', '')
                setFile('')
                setIngredients([])
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error(err.message)
            console.log(err)
        } finally {
            setIsAdding(false)
        }
    }



    return (
        <div className="w-full lg:w-3/4 min-h-screen pb-20 md:pb-10 lg:pb-0 flex flex-col gap-7 bg-[#0f0f0f] ml-auto p-4 pb-32">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | Add Product</title>
            </Head>

            <div className="w-full flex flex-row items-center justify-between">
                <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                    <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                    <span className="text-xs xs:text-sm">Return to Home Page</span>
                </Link>
                <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Add Product</span>
            </div>

            {/* Update Profile guideLines */}
            <ul className="flex flex-col gap-2 text-sm p-5 rounded-2xl border border-[#1f1f1f] bg-black text-gray-400 list-disc pl-5">
                <li>
                    all fields are required
                </li>
                <li>
                    slug mist be unique
                </li>
                <li>
                    product should at least have 1 ingredient
                </li>
            </ul>

            <form className="min-h-screen h-full mb-16 grid grid-cols-1 md:grid-cols-2 gap-y-9 gap-x-3 border border-[#1f1f1f] bg-black px-5 pt-12 pb-4 rounded-3xl" onSubmit={handleSubmit(addProductHandler)}>
                {/* title */}
                <div className="w-full relative select-none">
                    <input
                        type="text"
                        className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                        {...register('title')}
                    />
                    <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">title</span>
                    {errors?.title && (
                        <span className="text-red-500 text-sm">{errors.title.message}</span>
                    )}
                </div>

                {/* slug */}
                <div className="w-full relative select-none">
                    <input
                        type="text"
                        className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                        {...register('slug')}
                    />
                    <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">slug</span>
                    {errors?.slug && (
                        <span className="text-red-500 text-sm">{errors.slug.message}</span>
                    )}
                </div>

                {/* description */}
                <div className="w-full relative select-none">
                    <textarea
                        className="w-full min-h-28 resize-none rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                        {...register('description')}
                    ></textarea>
                    <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">description</span>
                    {errors?.description && (
                        <span className="text-red-500 text-sm">{errors.description.message}</span>
                    )}
                </div>

                {/* summary */}
                <div className="w-full relative select-none">
                    <textarea
                        className="w-full min-h-28 resize-none rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                        {...register('summary')}
                    ></textarea>
                    <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">summary</span>
                    {errors?.summary && (
                        <span className="text-red-500 text-sm">{errors.summary.message}</span>
                    )}
                </div>

                {/* prices */}
                <div className="col-start-1 col-end-3 md:col-start-1 md:col-end-3 grid grid-cols-1 md:grid-cols-3 gap-y-9 gap-4">
                    {/* smallPrice */}
                    <div className="w-full relative select-none">
                        <input
                            type="number"
                            className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            step={0.1}
                            {...register('smallPrice')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">smallPrice</span>
                        {errors?.smallPrice && (
                            <span className="text-red-500 text-sm">{errors.smallPrice.message}</span>
                        )}
                    </div>
                    {/* mediumPrice */}
                    <div className="w-full relative select-none">
                        <input
                            type="number"
                            className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            step={0.1}
                            {...register('mediumPrice')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">mediumPrice</span>
                        {errors?.mediumPrice && (
                            <span className="text-red-500 text-sm">{errors.mediumPrice.message}</span>
                        )}
                    </div>
                    {/* largePrice */}
                    <div className="w-full relative select-none">
                        <input
                            type="number"
                            className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            step={0.1}
                            {...register('largePrice')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">largePrice</span>
                        {errors?.largePrice && (
                            <span className="text-red-500 text-sm">{errors.largePrice.message}</span>
                        )}
                    </div>
                </div>

                {/* category */}
                <div className="w-full relative select-none">
                    <select
                        type="text"
                        className="w-full rounded-xl p-4 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                        {...register('category')}
                    >
                        <option value="HOT">HOT</option>
                        <option value="COLD">COLD</option>
                        <option value="SPECIAL">SPECIAL</option>
                    </select>
                    <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">category</span>
                    {errors?.category && (
                        <span className="text-red-500 text-sm">{errors.category.message}</span>
                    )}
                </div>

                {/* ingredients */}
                <div className="w-full relative select-none">
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            value={ingredientText}
                            onChange={e => setIngredientText(e.target.value)}
                        />
                        <button
                            className="text-black bg-amber-500 hover:bg-amber-600 transition-colors font-bold rounded-xl py-3 px-4 cursor-pointer"
                            onClick={addIngredient}
                        >Add</button>
                    </div>
                    <div className=" w-full flex items-center gap-1 flex-wrap">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="pl-1 py-1 mt-2 w-fit flex items-center justify-center gap-2 rounded-xl text-white border border-white text-sm">
                                <span>{ingredient}</span>
                                <button
                                    onClick={e => removeIngredient(e, ingredient)}
                                    className="cursor-pointer p-1 rounded-xl hover:bg-white/5 transition-colors duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6 text-white text-sm"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.55, duration: 0.4 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18 18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">ingredients</span>
                    {errors?.ingredients && (
                        <span className="text-red-500 text-sm">{errors.ingredients.message}</span>
                    )}
                </div>

                {/* files */}
                <div className="md:col-start-1 md:col-end-3 w-full relative select-none">
                    <input
                        type="file"
                        // ref={fileRef}
                        id="productImageFile"
                        className="hidden"
                        // value={file}
                        onChange={e => setFile(e.target.files[0])}
                        required
                    />

                    <label htmlFor="productImageFile" className="w-full min-h-52 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-3xl border-2 border-dashed border-[#1f1f1f] bg-[#0f0f0f]">
                        <div className="flex items-center justify-center gap-1">
                            <BiMoviePlay className="text-white text-xl" />
                            <h2 className="text-white font-bold">Import Image</h2>
                        </div>
                        {file && (
                            <div className="text-gray-400">{file.name}</div>
                        )}
                    </label>
                </div>

                <button
                    className="col-start-1 col-end-3 py-2 rounded-2xl bg-amber-500 disabled:bg-amber-300 hover:bg-amber-600 font-semibold transition-colors text-black  cursor-pointer"
                    disabled={isAdding}
                >{isAdding ? 'Adding...' : 'Add Product'}</button>
            </form>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    )
}

AddProduct.noLayout = true

export default AddProduct