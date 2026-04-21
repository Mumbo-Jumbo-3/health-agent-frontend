import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </div>
  );
}
