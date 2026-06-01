import { MarketingHeader } from "@/components/marketing/header"
import { HeroSection } from "@/components/marketing/csr-sections"
import { DescriptionSection, CTASection } from "@/components/marketing/sections"

export default function Page() {
  return (
    <div>
      <MarketingHeader />
      {/* <div className="h-[10000px] bg-[#f5f5f5]"></div> */}
      <div className="mx-auto">
        <HeroSection />
        <DescriptionSection />
        <CTASection />
      </div>
    </div>
  )
}
