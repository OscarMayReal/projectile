"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LogInIcon, PlayIcon } from "lucide-react"

export function HeroSection() {
  return (
    <div className="flex flex-row justify-center border-b">
      <div className="w-full max-w-[1350px] h-[400px] flex flex-row items-center p-20">
        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-[50px] font-bold"
          >
            Modern Project Management
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
            className="text-[50px] font-bold"
          >
            for fast-moving teams
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeInOut" }}
            className="text-[20px] text-neutral-500 mt-4"
          >
            Projectile helps you ship faster and make better decisions.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
            className="mt-4 flex flex-row items-center gap-4"
          >
            <Button><PlayIcon />Get Started</Button>
            <Button variant="outline"><LogInIcon />Sign In</Button>
          </motion.div>
        </div>
        <div className="ml-auto">
          <img src="/marketing/heroimage.svg" alt="Hero Image" />
        </div>
      </div>
    </div>
  )
}