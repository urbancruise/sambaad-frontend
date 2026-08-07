import EmailShell from "@/src/features/email/component/Emailshell";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <EmailShell>{children}</EmailShell>;
}