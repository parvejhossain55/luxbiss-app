"use client";

import React from "react";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout/UserDashboardLayout";
import LevelProgressBar from "@/components/features/product/LevelProgressBar";
import ProductGridWithOffer from "@/components/features/product/ProductGridWithOffer";
import AllLevelGrid from "@/components/features/product/AllLevelGrid";
import { PRODUCT_LEVELS, ALL_PRODUCTS } from "@/constants/mockData";

/**
 * All Products Page
 * Displays paginated product grid, level progress, and all levels.
 */
export default function AllProductsPage() {
  return (
    <UserDashboardLayout>
      <LevelProgressBar />
      <ProductGridWithOffer products={ALL_PRODUCTS} />
      <AllLevelGrid levels={PRODUCT_LEVELS} />
    </UserDashboardLayout>
  );
}