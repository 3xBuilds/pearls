"use client"

import { useRouter } from 'next/navigation'

import React from 'react'
import Image from 'next/image'


const NavButton = ({upImage, downImage, selected , link}) =>{

    const router = useRouter()
    
    if(!selected)
    return(
        <a href={link}>
            <button className='group cursor-pointer'>
                <Image width={200} height={80} src={upImage} alt="home" className={"w-20 group-hover:hidden"}/>
                <Image width={200} height={80} src={downImage} alt="home" className={"w-20 hidden group-hover:block"}/>
            </button>
        </a>
    )

    else 
    return (
        <button onClick={()=>{
            router.push("/")
            }} className='cursor-pointer'>
            <Image width={200} height={80} src={downImage} alt="home" className={"w-20"}/>
        </button>
    )
}

export default NavButton