import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4">
      <AuthForm mode="login" />
    </main>
  );
}
