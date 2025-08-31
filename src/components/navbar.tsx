"use client";
import { User } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

function Navbar() {
    const {data:session,status}=useSession();
    if(status==='loading'){
        return <p>Loading...</p>
    }

    const user:User=session?.user as User
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a href="#" className="text-xl font-bold mb-4 md:mb-0">TrueFeedback</a>
            {
            session ?(
            <>
            <span>
                Welcome, {user?.username || user?.email}
                <Button onClick={()=>signOut() } className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>LogOut</Button>
            </span>
            </>
            ):
            (
            <>
            <Link  href={'/sign-in'}>
            <Button className="w-full md:w-auto cursor-pointer bg-slate-100 text-black" variant={'outline'}>
                Login
            </Button>
            </Link>
            </>
            )
            }
        </div>
    </nav>
  )
}

export default Navbar