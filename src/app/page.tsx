"use client"; // Required for useRef
import { useRef } from "react";
import Hero from "@/components/Hero";
import CopywritingStepper from "@/components/Stepper";
import StepsExplanation from "@/components/StepsExplanation";

export default function Home() {
  const stepperRef = useRef<HTMLDivElement>(null); // Type as HTMLDivElement

  const scrollToStepper = () => {
    if (stepperRef.current) {
      stepperRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Hero onCallToActionClick={scrollToStepper} />
      <StepsExplanation />
      <CopywritingStepper ref={stepperRef} />
    </>
  );
}
