"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

export default function Footer() {
    const pathname = usePathname()
    const footerLinks = [
        {label: "Privacy", href: "/privacy"},
        {label: "Terms & Conditions", href: "/termsandconditions"},
        {label: "Cookies", href: "/cookies"},
        {label: "Contact", href: "/contact"}
    ]
  return (
    <footer className='my-auto mx-4'>
        <div className='container py-6 border-t border-zinc-100 max-w-4xl mx-auto flex justify-between items-center'>
            <div className='flex flex-col items-center justify-center md:flex-row md:gap-2'>
                <Link href={"/"} className='flex items-center justify-center'>
                    <h1 className='text-lg italic'>Todo</h1>
                    <span className='text-teal-700 text-3xl font-bold'>App</span>
                </Link>
                <p>&copy;{new Date().getFullYear()}Aroon</p>
            </div>
            <div className='flex flex-col gap-1 md:flex-row'>
                {footerLinks.map((footerItem) => (
                    <Link key={footerItem.href} href={footerItem.href}
                        className={clsx("text-sm text-teal-700",{"text-white":pathname ===footerItem.href})}
                    >{footerItem.label}</Link>
                ))

                }
            </div>
        </div>
    </footer>
  )
}
