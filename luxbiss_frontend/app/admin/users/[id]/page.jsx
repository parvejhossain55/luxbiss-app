import AdminUserEditClient from "./AdminUserEditClient";

// Force static to help with the Go server embedding during final build
export const dynamic = "force-static";

export function generateStaticParams() {
    // Generates a single static shell at /admin/users/[id].html
    // This allows the Go backend to serve this shell for all dynamic user IDs
    return [{ id: "user_shell" }];
}

export default function Page({ params }) {
    return <AdminUserEditClient params={params} />;
}
