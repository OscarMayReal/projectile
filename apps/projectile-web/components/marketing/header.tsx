"use client"

import { useState, useEffect } from "react"

export function MarketingHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header className={`${isScrolled ? 'border-b bg-white' : 'bg-[#f5f5f5]'} h-[60px] w-full flex flex-row items-center sticky top-0 z-50`}>
            <h1>Projectile</h1>
        </header>
    )
}