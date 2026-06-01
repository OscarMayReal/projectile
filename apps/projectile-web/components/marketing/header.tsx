"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlayIcon, LogInIcon } from "lucide-react"

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
        <header className={`${isScrolled ? 'border-b bg-white' : 'bg-[#f5f5f5]'} h-[60px] w-full flex flex-col items-center sticky top-0 z-50`}>
            <div className="flex flex-row items-center max-w-[1350px] w-full h-full px-20">
                <img src="/assets/logo.svg" alt="Projectile" className="h-7 w-7"/>
                <h1 className="text-xl ml-3">Projectile</h1>
                <div className="flex-1"/>
                <Button className="mr-3"><PlayIcon />Get Started</Button>
                <Button variant="outline"><LogInIcon />Sign In</Button>
            </div>
        </header>
    )
}