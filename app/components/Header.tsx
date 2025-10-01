'use client';

import Image from "next/image";
import Link from "next/link";
import {FaGithub, FaSignOutAlt} from "react-icons/fa";
import { useWallet } from "../context/WalletContext";

export const Header = () => {
    const { evmAddress, logout } = useWallet();

    return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="w-full py-6 px-8 bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.1)]">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="devspot paymaster" width={120} height={40} />
          </Link>
          <ul className="flex space-x-6 items-center">
            <li>
              <a
                href="https://github.com/ankur-JA/circle-batch-dem.git"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={24} />
              </a>
            </li>
            {evmAddress && (
              <li>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </div>
    )
}