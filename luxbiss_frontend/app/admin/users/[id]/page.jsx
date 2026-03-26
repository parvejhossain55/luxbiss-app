import AdminUserEditClient from "./AdminUserEditClient";

// IMPORTANT: Do NOT set `dynamicParams = false` here, as it blocks all real IDs.
// Instead, just return an empty array or a dummy so the Next.js static build passes!
export function generateStaticParams() {
    return [{ id: "user_slug" }];
}

export default function Page({ params }) {
    return <AdminUserEditClient params={params} />;
}
