import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}


