import { AuthProvider } from "@/contexts/AuthContext";
export default function AdminRootLayout({ children }) {
    return (
        <AuthProvider>
            {/* Chỉ vùng này mới cần login */}
            {children}
        </AuthProvider>
    );
}