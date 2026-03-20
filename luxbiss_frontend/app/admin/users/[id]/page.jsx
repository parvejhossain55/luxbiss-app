import AdminUserEditClient from "./AdminUserEditClient";

export const dynamicParams = false;

export async function generateStaticParams() {
    return [{ id: 'dummy' }];
}

export default async function Page({ params }) {
    return <AdminUserEditClient params={params} />;
}
