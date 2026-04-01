"use client"
import React, { useState, useEffect } from "react";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout/UserDashboardLayout";
import LevelProgressBar from "@/components/features/product/LevelProgressBar";
import ProductShowcase from "@/components/features/product/ProductShowcase";
import AllLevelGrid from "@/components/features/product/AllLevelGrid";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";

export default function ProductPage() {
  const { user, fetchMe } = useAuthStore();
  const { levels, fetchLevels, steps, fetchSteps, products, fetchProducts, isLoading } = useProductStore();

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const activeSelectedLevel = selectedLevel ?? user?.level_id ?? null;

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    fetchLevels({ per_page: 50 });
  }, [fetchLevels]);

  useEffect(() => {
    if (activeSelectedLevel) {
      fetchSteps(activeSelectedLevel, { per_page: 50 }).then((res) => {
        if (res?.success && res.data?.length > 0) {
          // If viewing user's own level, use their step ONLY if it's valid for this level's content
          const userStepInLevel = res.data.find(s => s.id === user?.step_id);
          if (user?.level_id === activeSelectedLevel && userStepInLevel) {
            setSelectedStep(user.step_id);
          } else {
            // Default to first step of whatever level is being viewed (or if user's state is out of sync)
            setSelectedStep(res.data[0].id);
          }
        } else {
          setSelectedStep(null);
        }
      });
    }
  }, [activeSelectedLevel, fetchSteps, user]);

  useEffect(() => {
    if (activeSelectedLevel && selectedStep) {
      fetchProducts({ level_id: activeSelectedLevel, step_id: selectedStep, per_page: 50 });
    }
  }, [activeSelectedLevel, fetchProducts, selectedStep]);

  const activeLevel = levels.find((l) => l.id === activeSelectedLevel);
  const totalSteps = steps.length;
  const currentStepIndex = steps.findIndex(s => s.id === selectedStep);
  const showcaseKey = `${activeSelectedLevel ?? "none"}-${selectedStep ?? "none"}-${products[0]?.id ?? "empty"}`;

  // Calculate progress: increments as you go, hits 100% if current step is completed.
  const getProgress = () => {
    if (!user || !activeSelectedLevel || totalSteps === 0) return 0;

    const userLevelIdx = levels.findIndex(l => l.id === user.level_id);
    const selectedLevelIdx = levels.findIndex(l => l.id === activeSelectedLevel);

    if (selectedLevelIdx < userLevelIdx) return 100;
    if (selectedLevelIdx > userLevelIdx) return 0;

    // We are viewing the current user level
    const userStepIndex = steps.findIndex(s => s.id === user.step_id);
    // Use the user's actual step index for progress, not the selected one (unless we want to show progress of selection)
    // Actually, usually progress reflects the user's position in that level.
    const effectiveStepIdx = userStepIndex !== -1 ? userStepIndex : 0;

    return Math.min(100, Math.round(((effectiveStepIdx + (user.current_step_completed ? 1 : 0)) / totalSteps) * 100));
  };

  const progress = getProgress();

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <LevelProgressBar
          userLevel={activeLevel}
          userStep={selectedStep}
          totalSteps={totalSteps}
          currentStepIndex={currentStepIndex}
          progressValue={progress}
        />

        <ProductShowcase
          key={showcaseKey}
          products={products}
          currentLevel={activeLevel}
          allLevels={levels}
          onSelectLevel={setSelectedLevel}
          steps={steps}
          selectedStep={selectedStep}
          onSelectStep={setSelectedStep}
          isLoading={isLoading}
          userStepId={user?.step_id}
        />

        <AllLevelGrid
          levels={levels}
          selectedLevel={activeSelectedLevel}
          onSelectLevel={(id) => {
            setSelectedLevel(id);
          }}
          userLevelId={user?.level_id}
          userStatus={user?.status}
          currentStepCompleted={user?.current_step_completed}
        />
      </div>
    </UserDashboardLayout>
  );
}
