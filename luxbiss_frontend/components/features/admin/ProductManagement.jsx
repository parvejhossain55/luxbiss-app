"use client";

import React, { useState, useEffect } from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { Plus, Package, Trash2, Edit2, Star, Layers, Waypoints, ChevronLeft, ChevronRight, Upload, X, Send, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { useProductStore } from "@/store/useProductStore";
import { getImageUrl } from "@/lib/utils";
import BeautifulConfirmModal from "@/components/ui/BeautifulConfirmModal";

/**
 * Product Management Component
 * Allows admins to manage products on the platform.
 */
const ProductManagement = () => {
    const {
        products,
        levels,
        steps,
        isLoading,
        pagination,
        levelPagination,
        stepPagination,
        fetchProducts,
        fetchLevels,
        fetchSteps,
        createProduct,
        updateProduct,
        deleteProduct,
        createLevel,
        updateLevel,
        deleteLevel,
        createStep,
        updateStep,
        deleteStep,
        advanceUsersToNextStep,
        uploadProductImage
    } = useProductStore();

    // Navigation State
    const [view, setView] = useState("levels"); // levels, steps, products
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);

    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isStepModalOpen, setIsStepModalOpen] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: () => { },
        variant: "danger",
        confirmText: "Confirm"
    });

    const [productFormData, setProductFormData] = useState({
        level_id: "",
        step_id: "",
        name: "",
        price: "",
        rating: 0,
        min_quantity: 1,
        max_quantity: 100,
        image_url: "",
        description: ""
    });

    const [levelFormData, setLevelFormData] = useState({
        name: "",
        profit_percentage: ""
    });

    const [stepFormData, setStepFormData] = useState({
        level_id: "",
        step_number: "",
        name: ""
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchLevels({ per_page: 20 });
    }, []);

    const handleLevelClick = (level) => {
        setSelectedLevel(level);
        fetchSteps(level.id, { per_page: 20 });
        setView("steps");
    };

    const handleStepClick = (step) => {
        setSelectedStep(step);
        fetchProducts({ level_id: selectedLevel.id, step_id: step.id, per_page: 20 });
        setView("products");
    };

    const handleBack = () => {
        if (view === "products") {
            setView("steps");
            setSelectedStep(null);
        } else if (view === "steps") {
            setView("levels");
            setSelectedLevel(null);
        }
    };

    // Product Handlers
    const handleOpenProductModal = (product = null) => {
        if (product) {
            setEditingItem(product);
            setProductFormData({
                level_id: product.level_id,
                step_id: product.step_id,
                name: product.name,
                price: product.price,
                rating: product.rating,
                min_quantity: product.min_quantity,
                max_quantity: product.max_quantity,
                image_url: product.image_url,
                description: product.description
            });
            setImageFile(null);
            setFormErrors({});
            if (product.level_id) fetchSteps(product.level_id);
        } else {
            setEditingItem(null);
            setImageFile(null);
            setProductFormData({
                level_id: selectedLevel?.id || "",
                step_id: selectedStep?.id || "",
                name: "",
                price: "",
                rating: 0,
                min_quantity: 1,
                max_quantity: 100,
                image_url: "",
                description: ""
            });
            setFormErrors({});
            if (selectedLevel) fetchSteps(selectedLevel.id);
        }
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        let finalImageUrl = productFormData.image_url;

        // Upload image first if a new file was selected
        if (imageFile) {
            const uploadRes = await uploadProductImage(imageFile);
            if (uploadRes.success) {
                finalImageUrl = uploadRes.data?.url || finalImageUrl;
            } else {
                setFormErrors({ image_url: uploadRes.message || "Failed to upload image" });
                setIsUploading(false);
                return;
            }
        }

        const payload = {
            name: productFormData.name,
            level_id: parseInt(productFormData.level_id) || 0,
            step_id: parseInt(productFormData.step_id) || 0,
            price: parseFloat(productFormData.price) || 0,
            rating: parseFloat(productFormData.rating) || 0,
            min_quantity: parseInt(productFormData.min_quantity) || 1,
            max_quantity: parseInt(productFormData.max_quantity) || 1,
            image_url: finalImageUrl,
            description: productFormData.description
        };

        const res = editingItem ? await updateProduct(editingItem.id, payload) : await createProduct(payload);
        setIsUploading(false);
        if (res.success) {
            setIsProductModalOpen(false);
            setFormErrors({});
            setImageFile(null);
            if (view === "products") fetchProducts({ level_id: selectedLevel.id, step_id: selectedStep.id, ...pagination });
            toast.success(`Product ${editingItem ? "updated" : "created"} successfully!`);
        } else {
            if (res.errors) {
                const errMap = {};
                res.errors.forEach(err => { errMap[err.field] = err.message; });
                setFormErrors(errMap);
            }
            toast.error(res.message || "Failed to save product");
        }
    };

    // Level Handlers
    const handleOpenLevelModal = (level = null) => {
        setFormErrors({});
        if (level) {
            setEditingItem(level);
            setLevelFormData({
                name: level.name,
                profit_percentage: level.profit_percentage?.toString() || ""
            });
        } else {
            setEditingItem(null);
            setLevelFormData({
                name: "",
                profit_percentage: ""
            });
        }
        setIsLevelModalOpen(true);
    };

    const handleSaveLevel = async (e) => {
        e.preventDefault();
        const payload = {
            name: levelFormData.name,
            profit_percentage: parseFloat(levelFormData.profit_percentage) || 0
        };
        const res = editingItem ? await updateLevel(editingItem.id, payload) : await createLevel(payload);
        if (res.success) {
            setIsLevelModalOpen(false);
            setFormErrors({});
            fetchLevels(levelPagination); // Refresh levels after save
            toast.success(`Level ${editingItem ? "updated" : "created"} successfully!`);
        } else {
            if (res.errors) {
                const errMap = {};
                res.errors.forEach(err => { errMap[err.field] = err.message; });
                setFormErrors(errMap);
            }
            toast.error(res.message || "Failed to save level");
        }
    };

    // Step Handlers
    const handleOpenStepModal = (step = null) => {
        setFormErrors({});
        if (step) {
            setEditingItem(step);
            setStepFormData({ level_id: step.level_id, step_number: step.step_number, name: step.name });
        } else {
            setEditingItem(null);
            setStepFormData({ level_id: selectedLevel?.id || "", step_number: (stepPagination.total + 1).toString(), name: "" });
        }
        setIsStepModalOpen(true);
    };

    const handleSaveStep = async (e) => {
        e.preventDefault();
        const payload = { ...stepFormData, level_id: parseInt(stepFormData.level_id), step_number: parseInt(stepFormData.step_number) };
        const res = editingItem ? await updateStep(editingItem.id, payload) : await createStep(payload);
        if (res.success) {
            setIsStepModalOpen(false);
            setFormErrors({});
            if (selectedLevel) {
                await fetchSteps(selectedLevel.id, stepPagination); // Refresh steps for current level

                // If this was a new step creation, and there was a previous "last" step,
                // ask if we should move users forward
                if (!editingItem) {
                    let lastStep = null;
                    let fromLevelId = selectedLevel.id;

                    if (steps.length > 0) {
                        // Advance within the same level
                        const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);
                        lastStep = sortedSteps[sortedSteps.length - 1];
                    } else {
                        // Potential first step of a new level - check previous level
                        const sortedLevels = [...levels].sort((a, b) => a.id - b.id);
                        const currentLvlIdx = sortedLevels.findIndex(l => l.id === selectedLevel.id);
                        if (currentLvlIdx > 0) {
                            const prevLevel = sortedLevels[currentLvlIdx - 1];
                            fromLevelId = prevLevel.id;

                            // Use direct lib call to avoid updating global store state
                            const { productService } = await import("@/lib/product");
                            const prevStepsRes = await productService.getSteps(prevLevel.id, { per_page: 50 });
                            if (prevStepsRes.success && prevStepsRes.data?.length > 0) {
                                const sortedPrevSteps = [...prevStepsRes.data].sort((a, b) => a.step_number - b.step_number);
                                lastStep = sortedPrevSteps[sortedPrevSteps.length - 1];
                            }
                        }
                    }

                    const newStep = res.data;
                    if (newStep && lastStep) {
                        setConfirmState({
                            open: true,
                            title: "Advance Users?",
                            message: `A new step "${newStep.name || 'Next'}" was added. Would you like to automatically switch all users currently on "${lastStep.name || 'Step ' + lastStep.step_number}" to this new step?`,
                            variant: "info",
                            confirmText: "Yes, Advance Users",
                            onConfirm: async () => {
                                const advanceRes = await advanceUsersToNextStep(fromLevelId, lastStep.id, selectedLevel.id, newStep.id);
                                if (advanceRes.success) {
                                    toast.success("Users advanced to the new step successfully!");
                                } else {
                                    toast.error(advanceRes.message || "Failed to advance users automatically.");
                                }
                            }
                        });
                    }
                }
            }
            toast.success(`Step ${editingItem ? "updated" : "created"} successfully!`);
        } else {
            if (res.errors) {
                const errMap = {};
                res.errors.forEach(err => { errMap[err.field] = err.message; });
                setFormErrors(errMap);
            }
            toast.error(res.message || "Failed to save step");
        }
    };

    const handleDeleteProduct = (id) => {
        setConfirmState({
            open: true,
            title: "Delete Product?",
            message: "Are you sure you want to delete this product? This action cannot be undone.",
            variant: "danger",
            confirmText: "Delete Product",
            onConfirm: async () => {
                const res = await deleteProduct(id);
                if (res.success || res.status === 204) {
                    fetchProducts({ level_id: selectedLevel.id, step_id: selectedStep.id, ...pagination });
                    toast.success("Product deleted successfully!");
                } else toast.error(res.message || "Failed to delete product");
            }
        });
    };

    const handleDeleteLevel = (id) => {
        setConfirmState({
            open: true,
            title: "Delete Level?",
            message: "Deleting a level will also affect all associated steps and products. Are you sure?",
            variant: "danger",
            confirmText: "Delete Level",
            onConfirm: async () => {
                const res = await deleteLevel(id);
                if (res.success || res.status === 204) {
                    fetchLevels(levelPagination);
                    toast.success("Level deleted successfully!");
                } else toast.error(res.message || "Failed to delete level");
            }
        });
    };

    const handleDeleteStep = (id, levelId) => {
        setConfirmState({
            open: true,
            title: "Delete Step?",
            message: "Are you sure you want to delete this step? This will remove all associated products.",
            variant: "danger",
            confirmText: "Delete Step",
            onConfirm: async () => {
                const res = await deleteStep(id, levelId);
                if (res.success || res.status === 204) {
                    fetchSteps(levelId, stepPagination);
                    toast.success("Step deleted successfully!");
                } else toast.error(res.message || "Failed to delete step");
            }
        });
    };

    const handleActionClick = () => {
        if (view === "levels") handleOpenLevelModal();
        else if (view === "steps") handleOpenStepModal();
        else handleOpenProductModal();
    };

    const handleInlineImageUpload = async (file, productRow) => {
        setIsUploading(true);
        const uploadRes = await uploadProductImage(file);
        if (uploadRes.success) {
            const finalImageUrl = uploadRes.data?.url;
            if (finalImageUrl) {
                const payload = {
                    name: productRow.name,
                    level_id: productRow.level_id || 0,
                    step_id: productRow.step_id || 0,
                    price: productRow.price || 0,
                    rating: productRow.rating || 0,
                    min_quantity: productRow.min_quantity || 1,
                    max_quantity: productRow.max_quantity || 1,
                    image_url: finalImageUrl,
                    description: productRow.description || ''
                };
                const updateRes = await updateProduct(productRow.id, payload);
                if (updateRes.success) {
                    fetchProducts({ level_id: selectedLevel.id, step_id: selectedStep.id, ...pagination });
                } else {
                    toast.error(updateRes.message || "Failed to update product with new image");
                }
            }
        } else {
            toast.error(uploadRes.message || "Failed to upload image");
        }
        setIsUploading(false);
    };

    const columns = [
        {
            header: "Product",
            key: "name",
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <label className="relative h-10 w-10 cursor-pointer rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group hover:border-[#1a5b7d] transition-all">
                        {row.image_url ? (
                            <img src={getImageUrl(row.image_url)} alt={val} className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                        ) : (
                            <Package size={20} className="text-[#1a5b7d] group-hover:opacity-50 transition-opacity" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                            <Upload size={14} className="text-white drop-shadow-md" />
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleInlineImageUpload(file, row);
                            }}
                        />
                    </label>
                    <div className="flex flex-col justify-center">
                        <div className="font-bold text-slate-800">{val}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {row.level?.name} • Step {row.step?.step_number}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Price",
            key: "price",
            render: (val) => <span className="font-bold text-slate-800">${val}</span>
        },
        {
            header: "Quantity",
            key: "min_quantity",
            render: (val, row) => (
                <div className="text-slate-500 text-sm">
                    {val} - {row.max_quantity}
                </div>
            )
        },
        {
            header: "Rating",
            key: "rating",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>{val}</span>
                </div>
            )
        },
        {
            header: "Actions",
            key: "id",
            render: (val, row) => (
                <div className="flex gap-2">
                    <button
                        disabled={isLoading}
                        onClick={() => handleOpenProductModal(row)}
                        className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition-colors disabled:opacity-50"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(row.id)}
                        disabled={isLoading}
                        className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {view !== "levels" && (
                            <button
                                onClick={handleBack}
                                className="h-8 w-8 rounded-lg bg-[#B0E3F2] text-[#1a5b7d] flex items-center justify-center hover:bg-[#8fd5e8] transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h1 className="text-3xl font-bold text-[#1a5b7d]">
                            {view === "levels" ? "Catalog Management" : view === "steps" ? selectedLevel?.name : `Step ${selectedStep?.step_number}`}
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        {view === "levels" ? (
                            <>Manage <span className="text-[#1a5b7d] font-bold">{levelPagination.total} levels</span> of investment catalog.</>
                        ) : view === "steps" ? (
                            <>Manage <span className="text-[#1a5b7d] font-bold">{stepPagination.total} steps</span> for {selectedLevel?.name}.</>
                        ) : (
                            <>Manage <span className="text-[#1a5b7d] font-bold">{pagination.total} products</span> for Step {selectedStep?.step_number}.</>
                        )}
                    </p>
                </div>
                <button
                    onClick={handleActionClick}
                    className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    {view === "levels" ? "Add Level" : view === "steps" ? "Add Step" : "Add Product"}
                </button>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Data...</span>
                    </div>
                </div>
            )}

            {!isLoading && view === "levels" && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {levels.map((level) => (
                            <div key={level.id} className="relative group p-0.5 rounded-[22px] bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300">
                                <button
                                    onClick={() => handleLevelClick(level)}
                                    className="w-full h-24 rounded-[20px] flex flex-col items-center justify-center gap-1 overflow-hidden transition-all active:scale-[0.98]"
                                >
                                    <span className="text-xl font-black text-slate-800 tracking-tight">{level.name}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                                        <TrendingUp size={12} className="font-bold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{level.profit_percentage}% Profit</span>
                                    </div>
                                </button>
                                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                    <button disabled={isLoading} onClick={(e) => { e.stopPropagation(); handleOpenLevelModal(level); }} className="p-2 bg-white shadow-sm border border-slate-50 rounded-xl text-sky-500 hover:bg-sky-50 transition-colors"><Edit2 size={16} /></button>
                                    <button disabled={isLoading} onClick={(e) => { e.stopPropagation(); handleDeleteLevel(level.id); }} className="p-2 bg-white shadow-sm border border-slate-50 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {levels.length === 0 && (
                        <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                            No levels found.
                        </div>
                    )}
                    {levelPagination.total > levelPagination.per_page && (
                        <div className="flex items-center gap-4 py-8">
                            <button
                                disabled={levelPagination.page <= 1}
                                onClick={() => fetchLevels({ ...levelPagination, page: levelPagination.page - 1 })}
                                className="text-slate-300 hover:text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.ceil(levelPagination.total / levelPagination.per_page) }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => fetchLevels({ ...levelPagination, page: p })}
                                        className={`h-10 w-10 rounded-xl font-bold transition-all ${p === levelPagination.page ? "bg-[#B0E3F2] text-[#1a5b7d]" : "text-slate-300 hover:text-slate-500"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={levelPagination.page >= Math.ceil(levelPagination.total / levelPagination.per_page)}
                                onClick={() => fetchLevels({ ...levelPagination, page: levelPagination.page + 1 })}
                                className="text-slate-300 hover:text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!isLoading && view === "steps" && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((step) => (
                            <div key={step.id} className="relative group p-0.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all duration-300">
                                <button
                                    onClick={() => handleStepClick(step)}
                                    className="w-full h-16 rounded-2xl flex items-center justify-center transition-all active:scale-[0.98]"
                                >
                                    <span className="font-black text-[#1a5b7d] uppercase tracking-widest text-sm">Step {step.step_number}</span>
                                </button>
                                <div className="absolute top-2 right-2 flex gap-1 transform translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <button disabled={isLoading} onClick={(e) => { e.stopPropagation(); handleOpenStepModal(step); }} className="p-1.5 bg-white shadow-sm border border-slate-50 rounded-lg text-sky-500 hover:bg-sky-50"><Edit2 size={12} /></button>
                                    <button disabled={isLoading} onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id, selectedLevel.id); }} className="p-1.5 bg-white shadow-sm border border-slate-50 rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 size={12} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {steps.length === 0 && (
                        <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                            No steps found for this level.
                        </div>
                    )}
                    {stepPagination.total > stepPagination.per_page && (
                        <div className="flex items-center gap-4 py-8">
                            <button
                                disabled={stepPagination.page <= 1}
                                onClick={() => fetchSteps(selectedLevel.id, { ...stepPagination, page: stepPagination.page - 1 })}
                                className="text-slate-300 hover:text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.ceil(stepPagination.total / stepPagination.per_page) }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => fetchSteps(selectedLevel.id, { ...stepPagination, page: p })}
                                        className={`h-10 w-10 rounded-xl font-bold transition-all ${p === stepPagination.page ? "bg-[#B0E3F2] text-[#1a5b7d]" : "text-slate-300 hover:text-slate-500"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={stepPagination.page >= Math.ceil(stepPagination.total / stepPagination.per_page)}
                                onClick={() => fetchSteps(selectedLevel.id, { ...stepPagination, page: stepPagination.page + 1 })}
                                className="text-slate-300 hover:text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!isLoading && view === "products" && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                    <div className="p-4 border-b border-slate-50 bg-[#B0E3F2]/10 flex items-center justify-between">
                        <div className="text-sm font-bold text-[#1a5b7d] uppercase tracking-wider">{selectedLevel?.name} - Step {selectedStep?.step_number} Products</div>
                        <div className="text-xs text-slate-500 font-bold">{products.length} Products Found</div>
                    </div>
                    <FullWidthTable
                        data={products}
                        columns={columns}
                        headerBgClass="bg-[#B0E3F2]"
                        loading={isLoading}
                        pagination={pagination}
                        onPageChange={(page) => fetchProducts({ level_id: selectedLevel.id, step_id: selectedStep.id, ...pagination, page })}
                        onPerPageChange={(per_page) => fetchProducts({ level_id: selectedLevel.id, step_id: selectedStep.id, ...pagination, per_page, page: 1 })}
                    />
                </div>
            )}

            {isLevelModalOpen && (
                <div onMouseDown={() => setIsLevelModalOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div onMouseDown={(e) => e.stopPropagation()} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#B0E3F2] p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a5b7d]">{editingItem ? "Edit Level" : "Create New Level"}</h2>
                                <p className="text-[#1a5b7d]/70 text-sm font-medium">Configure level settings</p>
                            </div>
                            <button
                                onClick={() => setIsLevelModalOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/50 text-[#1a5b7d] hover:bg-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveLevel} className="p-6 space-y-5">
                            {/* Level Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Level Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Layers size={18} />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Level 1"
                                        className={`w-full h-12 pl-16 pr-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 transition-all outline-none font-bold text-slate-800 ${formErrors.name ? "border-rose-500 bg-rose-50" : "border-slate-100"}`}
                                        value={levelFormData.name}
                                        onChange={(e) => setLevelFormData({ ...levelFormData, name: e.target.value })}
                                    />
                                </div>
                                {formErrors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.name}</p>}
                            </div>

                            {/* Profit Percentage */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Profit Percentage (%)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Star size={18} />
                                    </div>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={`w-full h-12 pl-16 pr-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 transition-all outline-none font-bold text-slate-800 ${formErrors.profit_percentage ? "border-rose-500 bg-rose-50" : "border-slate-100"}`}
                                        value={levelFormData.profit_percentage}
                                        onChange={(e) => setLevelFormData({ ...levelFormData, profit_percentage: e.target.value })}
                                    />
                                </div>
                                {formErrors.profit_percentage && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.profit_percentage}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-sky-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        editingItem ? "Update Level" : "Save Level"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isStepModalOpen && (
                <div onMouseDown={() => setIsStepModalOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div onMouseDown={(e) => e.stopPropagation()} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#B0E3F2] p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a5b7d]">{editingItem ? "Edit Step" : "Create New Step"}</h2>
                                <p className="text-[#1a5b7d]/70 text-sm font-medium">Configure step settings</p>
                            </div>
                            <button
                                onClick={() => setIsStepModalOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/50 text-[#1a5b7d] hover:bg-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveStep} className="p-6 space-y-5">
                            {/* Step Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Step Number</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Waypoints size={18} />
                                    </div>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g. 1"
                                        className={`w-full h-12 pl-16 pr-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 transition-all outline-none font-bold text-slate-800 ${formErrors.step_number ? "border-rose-500 bg-rose-50" : "border-slate-100"}`}
                                        value={stepFormData.step_number}
                                        onChange={(e) => setStepFormData({ ...stepFormData, step_number: e.target.value })}
                                    />
                                </div>
                                {formErrors.step_number && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.step_number}</p>}
                            </div>

                            {/* Step Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Step Name (Optional)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Edit2 size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Optional name"
                                        className={`w-full h-12 pl-16 pr-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 transition-all outline-none font-bold text-slate-800 ${formErrors.name ? "border-rose-500 bg-rose-50" : "border-slate-100"}`}
                                        value={stepFormData.name}
                                        onChange={(e) => setStepFormData({ ...stepFormData, name: e.target.value })}
                                    />
                                </div>
                                {formErrors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.name}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-sky-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        editingItem ? "Update Step" : "Save Step"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isProductModalOpen && (
                <div onMouseDown={() => setIsProductModalOpen(false)} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity overflow-y-auto">
                    <div onMouseDown={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="bg-[#B0E3F2] p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a5b7d]">{editingItem ? "Edit Product" : "Create New Product"}</h2>
                                <p className="text-[#1a5b7d]/70 text-sm font-medium">Configure product details</p>
                            </div>
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/50 text-[#1a5b7d] hover:bg-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Product Name</label>
                                <input required type="text" className={`w-full h-12 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all ${formErrors.name ? "border-rose-500 bg-rose-50" : "border-slate-100"}`} value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} />
                                {formErrors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Level</label>
                                <select required className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all appearance-none" value={productFormData.level_id} onChange={(e) => { const lid = e.target.value; setProductFormData({ ...productFormData, level_id: lid, step_id: "" }); if (lid) fetchSteps(parseInt(lid)); }}>
                                    <option value="">Select Level</option>
                                    {levels.map(level => (
                                        <option key={level.id} value={level.id}>{level.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Step</label>
                                <select required disabled={!productFormData.level_id} className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all appearance-none disabled:opacity-50" value={productFormData.step_id} onChange={(e) => setProductFormData({ ...productFormData, step_id: e.target.value })}>
                                    <option value="">Select Step</option>
                                    {steps.map(step => (
                                        <option key={step.id} value={step.id}>Step {step.step_number} </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price ($)</label>
                                <input required type="number" step="0.01" className={`w-full h-12 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all ${formErrors.price ? "border-rose-500 bg-rose-50" : "border-slate-100"}`} value={productFormData.price} onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })} />
                                {formErrors.price && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.price}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Rating (0-5)</label>
                                <input type="number" step="0.1" min="0" max="5" className={`w-full h-12 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all ${formErrors.rating ? "border-rose-500 bg-rose-50" : "border-slate-100"}`} value={productFormData.rating} onChange={(e) => setProductFormData({ ...productFormData, rating: e.target.value })} />
                                {formErrors.rating && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.rating}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Min Quantity</label>
                                <input required type="number" className={`w-full h-12 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all ${formErrors.min_quantity ? "border-rose-500 bg-rose-50" : "border-slate-100"}`} value={productFormData.min_quantity} onChange={(e) => setProductFormData({ ...productFormData, min_quantity: e.target.value })} />
                                {formErrors.min_quantity && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.min_quantity}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Max Quantity</label>
                                <input required type="number" className={`w-full h-12 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all ${formErrors.max_quantity ? "border-rose-500 bg-rose-50" : "border-slate-100"}`} value={productFormData.max_quantity} onChange={(e) => setProductFormData({ ...productFormData, max_quantity: e.target.value })} />
                                {formErrors.max_quantity && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.max_quantity}</p>}
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Product Image</label>
                                <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all group overflow-hidden ${formErrors.image_url ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
                                    <div className="h-20 w-20 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-slate-400">
                                        {productFormData.image_url ? (
                                            <img src={getImageUrl(productFormData.image_url)} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Package size={32} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-700 mb-0.5">Upload Product Image</div>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Recommended 800x800px. PNG, JPG or WebP (Max. 2MB)</p>
                                        {formErrors.image_url && <p className="text-[10px] text-rose-500 font-bold mt-1">{formErrors.image_url}</p>}
                                    </div>
                                    <label className="cursor-pointer bg-white h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-[#1a5b7d] hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                                        <Upload size={14} />
                                        <span>Browse</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setImageFile(file);
                                                    setProductFormData({ ...productFormData, image_url: URL.createObjectURL(file) });
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                                <textarea rows="3" className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all resize-none ${formErrors.description ? "border-rose-500 bg-rose-50" : "border-slate-100"}`} value={productFormData.description} onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })} />
                                {formErrors.description && <p className="text-[10px] text-rose-500 font-bold ml-1">{formErrors.description}</p>}
                            </div>
                            <div className="col-span-full pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || isUploading}
                                    className="w-full h-14 bg-sky-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading || isUploading ? (
                                        <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            {editingItem ? "Update Product" : "Save Product"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BeautifulConfirmModal
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ ...confirmState, open: false })}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                variant={confirmState.variant}
                confirmText={confirmState.confirmText}
            />
        </div>
    );
};

export default ProductManagement;
