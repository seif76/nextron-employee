import React , {useState , useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

// export default function Sidebar({ departments, departmentCounts ,onDepartmentClick}) {
//   return (
//     <div className="w-full bg-gray-100 p-4 h-full">
//       <h2 className="text-lg font-bold mb-4">DEPARTMENTS</h2>
//       <ul className="space-y-2">
//         {departments.map((dept) => (
//           <li
//             key={dept._id}
//             className="flex justify-between items-center py-2 px-3 hover:bg-gray-300 cursor-pointer w-full rounded-md transition duration-200"
//             onClick={() => onDepartmentClick(dept._id)}
//           >
//             <span className="flex-1">{dept.name}</span>
//             <span className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm">
//               {departmentCounts[dept.name] || 0}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


export default function Sidebar({ departments, onDepartmentClick }) {
  return (
    <div className="w-full bg-gray-100 p-4 h-full">
      <h2 className="text-lg font-bold mb-4">DEPARTMENTS</h2>
      <ul className="space-y-2">
        {departments.map((dept) => (
          <li
            key={dept._id}
            className="flex justify-between items-center py-2 px-3 hover:bg-gray-300 cursor-pointer w-full rounded-md transition duration-200"
            onClick={() => onDepartmentClick(dept._id)}
          >
            <span className="flex-1">{dept.name}</span>
            <span className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm">
              {dept.employeeCount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
