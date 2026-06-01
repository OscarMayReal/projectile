"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ListIcon, LogInIcon, PlayIcon, SparklesIcon, UsersIcon } from "lucide-react"

export function DescriptionSection() {
  return (
    <div className="flex flex-row justify-center border-b select-none">
      <div className="w-full max-w-[1350px] h-auto flex flex-row px-20 py-10">
        <div>
          <h1 className="text-[35px] font-bold mb-1">What is Projectile?</h1>
          <p className="text-[20px]">Projectile is a task management app that helps you stay organized and productive. It brings together task management, bug reporting, feature requests, and changelog management in one unified platform. Save time and money by replacing multiple fragmented tools with one, easy to use, all in one platform.</p>
        </div>
      </div>
    </div>
  )
}

export function CTASection() {
  return (
    <div className="flex flex-row justify-center border-b select-none">
      <div className="w-full max-w-[1350px] h-auto flex flex-row p-20">
        <div>
          <SparklesIcon size={35} className="mb-2" />
          <h1 className="text-[35px] font-bold mb-1">Ready to get started?</h1>
          <p className="text-[20px] mb-6">Start moving faster and smarter with Projectile today.</p>
          <Button variant="default" size="lg">
            <PlayIcon /> Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}