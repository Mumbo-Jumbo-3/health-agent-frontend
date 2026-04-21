import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <SignUp routing="path" path="/register" signInUrl="/login" />
    </div>
  );
}
