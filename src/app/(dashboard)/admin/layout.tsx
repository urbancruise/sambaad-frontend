import AdminLayout from "@/src/features/admin/components/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}