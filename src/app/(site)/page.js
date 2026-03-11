
import BenefitsSection from "@/components/Home/Benefits";
import HeroBanner from "@/components/Home/HeroBanner";
import HowItWorks from "@/components/Home/HowItWoks";
import TrustedBy from "@/components/Home/TrustedBy";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
            <HeroBanner />   
            <HowItWorks /> 

            <BenefitsSection />  
            <TrustedBy />
    </div>
  );
}
