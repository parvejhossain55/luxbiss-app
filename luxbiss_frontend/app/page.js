"use client";

import React from "react";
import Navbar from '@/components/features/home-sections/Navbar/Navbar';
import Hero from '@/components/features/home-sections/Hero/Hero';
import Business from '@/components/features/home-sections/Business/Business';
import Works from '@/components/features/home-sections/Work/Work';
import ProductInvestment from '@/components/features/home-sections/ProductInvestment/ProductInvestment';
import HowYouWillEarn from '@/components/features/home-sections/HowYouWillEarn/HowYouWillEarn';
import Testimonial from '@/components/features/home-sections/Trust/Testomonial';
import StartInvestingCTA from '@/components/features/home-sections/WholeseleProduct/WholeseleProduct';
import Footer from '@/components/features/home-sections/Footer/Footer';

/**
 * Main Landing Page
 * Aggregates all home sections.
 */
export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Business />
      <Works />
      <ProductInvestment />
      <HowYouWillEarn />
      <Testimonial />
      <StartInvestingCTA />
      <Footer />
    </div>
  );
}
