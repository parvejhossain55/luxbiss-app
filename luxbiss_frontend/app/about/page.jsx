"use client";

import React from "react";
import Navbar from '@/components/features/home-sections/Navbar/Navbar';
import HeroInvestment from '@/components/features/about/AboutHeroSection/AboutHeroSection';
import OurStorySection from '@/components/features/about/OurStory/OurStory';
import ComplianceSection from '@/components/features/about/ComplianceSection/ComplianceSection';
import ReadyJourneySection from '@/components/features/about/ReadyJourneySection/ReadyJourneySection';

/**
 * About Page
 * Displays company story, compliance, and hero investment sections.
 */
export default function AboutPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <HeroInvestment />
      <OurStorySection />
      <ComplianceSection />
      <ReadyJourneySection />
    </div>
  );
}