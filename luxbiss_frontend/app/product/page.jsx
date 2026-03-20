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

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    fetchLevels({ per_page: 50 });
  }, [fetchLevels]);

  // Automatically track user's current progress
  useEffect(() => {
    if (user?.level_id && levels.length > 0) {
      if (user.current_step_completed) {
        // If finished current level, try to show the next level automatically
        const sorted = [...levels].sort((a, b) => a.id - b.id);
        const currIdx = sorted.findIndex(l => l.id === user.level_id);
        if (currIdx !== -1 && currIdx < sorted.length - 1) {
          setSelectedLevel(sorted[currIdx + 1].id);
          return;
        }
      }
      setSelectedLevel(user.level_id);
    }
  }, [user?.level_id, user?.current_step_completed, levels]);


  useEffect(() => {
    if (selectedLevel) {
      fetchSteps(selectedLevel, { per_page: 50 }).then((res) => {
        if (res?.success && res.data?.length > 0) {
          // If viewing user's own level, use their step ONLY if it's valid for this level's content
          const userStepInLevel = res.data.find(s => s.id === user?.step_id);
          if (user?.level_id === selectedLevel && userStepInLevel) {
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
  }, [selectedLevel, user, fetchSteps]);

  useEffect(() => {
    if (selectedLevel && selectedStep) {
      fetchProducts({ level_id: selectedLevel, step_id: selectedStep, per_page: 50 });
    }
  }, [selectedLevel, selectedStep, fetchProducts]);

  const activeLevel = levels.find((l) => l.id === selectedLevel);
  const totalSteps = steps.length;
  const currentStepIndex = steps.findIndex(s => s.id === selectedStep);

  // Calculate progress: increments as you go, hits 100% if current step is completed.
  const getProgress = () => {
    if (!user || !selectedLevel || totalSteps === 0) return 0;

    const userLevelIdx = levels.findIndex(l => l.id === user.level_id);
    const selectedLevelIdx = levels.findIndex(l => l.id === selectedLevel);

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
          selectedLevel={selectedLevel}
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
