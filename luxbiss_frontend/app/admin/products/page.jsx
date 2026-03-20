import ProductManagement from "@/components/features/admin/ProductManagement";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";

export const metadata = {
    title: "Product Management | Luxbiss Admin",
    description: "Manage investment products and levels",
};

export default function AdminProductsPage() {
    return (
        <AdminDashboardLayout>
            <ProductManagement />
        </AdminDashboardLayout>
    );
}
