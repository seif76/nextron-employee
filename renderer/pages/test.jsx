"use client"
//import "../styles/globals.css"; 
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from "axios";
import Head from 'next/head'

export default function Login() {

    const router = useRouter();
    const [message, setMessage] = useState('');


    // ✅ Correct useEffect with async function inside
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/test");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // ✅ Empty dependency array means it runs only once
   
     const routerHandler =  () => {
       router.push("/home")
     };

    return(
      
     <React.Fragment>
         <Head>
        <title>Test - Nextron </title>
        {/* <link rel="stylesheet" href="/globals.css" />  */}
      </Head>
      <h1 className="text-red-600" >test page </h1>
      <button 
      className="w-full rounded-md bg-yellow-500 py-2 lg:py-3 px-4 text-base font-semibold text-white shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      onClick={routerHandler} >test Router</button>
      <Link 
      className="mt-6 text-blue-400"
      href="/home">test Link navigation</Link>
      <p>{message}</p>
      
      
      </React.Fragment>

    )
}