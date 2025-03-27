import React , {useState , useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'


export default function EmployeeCard({employee}) {

  return (
    <Link href={`/employee/${employee._id}`}>
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4">
      <Image alt="employee Image" src={employee.gender.toLowerCase() === "male" ?"/images/Male.png" :"/images/female.png"} width={60} height={60} className="rounded-full" />
      <div>
        <h3 className="font-bold">{employee.name}</h3>
        <p className="text-sm text-gray-500">{employee.gender}</p>
        <p className="text-sm text-gray-500">{employee.phoneNumber}</p>
        
      </div>
    </div>
    </Link>
  );
};

