import React , {useState , useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Navbar() {
    return (
      <nav className="bg-white shadow p-4 flex justify-normal items-start">
       <Link className='pl-2' href="/employees"> <h1 className="text-xl font-bold hover:text-gray-600">Employees</h1></Link>
       <Link className='pl-4' href="/department"> <h1 className="text-xl font-bold hover:text-gray-600">Department</h1></Link>
       <Link className='pl-4' href="/attendance"> <h1 className="text-xl font-bold hover:text-gray-600">Attendance</h1></Link>
      </nav>
    );
  };
  
