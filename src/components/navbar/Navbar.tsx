import { routes } from "@/constants/routes";
import Link from "next/link";
import React from "react";

export const Navbar: React.FC = () => (
  <nav className="bg-blue-400 border-gray-200">
    <div className="flex flex-wrap items-center justify-between mx-auto p-6">
      <Link href={routes.home()}>
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          {"<AppName>"}
        </span>
      </Link>
      <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
          <li>
            <Link
              href={routes.home()}
              className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700  md:p-0"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={routes.patients()}
              className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700  md:p-0"
            >
              Patients
            </Link>
          </li>
          <li>
            <Link
              href={routes.recentNotes()}
              className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700  md:p-0"
            >
              Recent notes
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);
