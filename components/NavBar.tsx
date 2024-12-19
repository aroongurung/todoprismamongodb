'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { MenuIcon, X } from 'lucide-react';

export default function NavBar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const navList = [
    { navName: 'ToDo', href: '/todo' },
    { navName: 'Task', href: '/task' },
    { navName: 'InProgess Task', href: '/inprogresstask' },
    { navName: 'Completed Task', href: '/completedtask' },
  ];

  return (
    <nav className="mt-2 mx-4">
      <div className="flex justify-between items-center p-2 container max-w-4xl mx-auto border-b border-zinc-100">
        {/* Logo Link */}
        <div className="flex justify-center items-center">
          <Link href={"/"} className="flex items-center justify-center">
            <h1 className="text-lg italic">Todo</h1>
            <span className="text-teal-700 text-3xl font-bold">App</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-4">
          {navList.map((navItem) => (
            <ul key={navItem.href}>
              <Link
                href={navItem.href}
                className={clsx("font-bold text-xl text-teal-700", {
                  "text-white": pathname === navItem.href,
                })}
              >
                {navItem.navName}
              </Link>
            </ul>
          ))}
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <MenuIcon
          size={35}
          onClick={() => setIsOpen((prev) => !prev)}
          className="sm:hidden cursor-pointer"
        />

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden fixed inset-0 bg-zinc-500 bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center h-full bg-white">
              {/* Close Icon */}
              <X
                size={35}
                onClick={() => setIsOpen(false)} // Close the menu
                className="absolute top-4 right-4 cursor-pointer"
              />

              {/* Menu Items */}
              {navList.map((navItem) => (
                <ul key={navItem.href} className="py-4">
                  <Link
                    href={navItem.href}
                    className={clsx("font-bold text-xl text-teal-700", {
                      "text-white": pathname === navItem.href,
                    })}
                    onClick={() => setIsOpen(false)} // Close the menu after click
                  >
                    {navItem.navName}
                  </Link>
                </ul>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
