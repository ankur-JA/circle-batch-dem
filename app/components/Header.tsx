import Image from "next/image";
import Link from "next/link";
import {FaDiscord, FaGithub, FaTwitter, FaLightbulb} from "react-icons/fa";

export const Header = () => {
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
                href="https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLightbulb size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/coinbase-samples/cdp-sdk-mass-payments-ts"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/cdp"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord size={24} />
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    )
}