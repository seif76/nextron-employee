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
    //const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [data, setdata] = useState([]);
    const name = "John Doe";
    const code = "E1233";
    const hireDate = "2023-01-10";
    const nationalId = "98765432103";
    const phoneNumber = "0123456789";
    const address = "456 Elm St";
    const insuranceNumber = "INS567893";
    const department = "HR";
    const salary = 70000;

    // ✅ Correct useEffect with async function inside
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/employee");
        const test = await axios.post(
          "http://localhost:3000/api/add-employee", 
          {}, // No body, since we are using query params
          { 
            params: {  // ✅ Send data in query parameters
              name, 
              code, 
              hireDate, 
              nationalId, 
              phoneNumber, 
              address, 
              insuranceNumber, 
              department, 
              salary
            },
            headers: { "Content-Type": "application/json" }
          }
        )
        .then((res) => {
          alert(res.data);
        })
        .catch((error) => {
          setMessage('Invalid email or password: ' + (error.response?.data?.message || error.message));
        });
        //setName(response.data.name);
        setAge(response.data.age);
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

      <p className='p-4'>Name : {name}</p>
      <p className='p-4' >age : {salary}</p>
      <p className='mt-6 text-red-500' >error message : {message}</p>
      
      
      
      </React.Fragment>

    )
}