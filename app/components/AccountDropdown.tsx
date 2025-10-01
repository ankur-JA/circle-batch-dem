// "use client";
// import React from 'react';

// import { useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AccountDropdown() {
  
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

  


//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (!session?.user) return null;

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-gray-100 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium shadow hover:bg-gray-200 transition w-fit"
//       >
//         {displayName}
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
//           <button
//             onClick={handleSignOut}
//             className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-red-500 hover:bg-gray-100"
//           >
//             Sign Out
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
