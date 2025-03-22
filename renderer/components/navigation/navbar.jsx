import React , {useState , useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Navbar() {
    return (
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Employees</h1>
        <input type="text" placeholder="Search..." className="border px-3 py-1 rounded" />
      </nav>
    );
  };
  
