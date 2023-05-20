import { UserAuthForm } from "@/components/user-auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Luna Ai",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center min-h-full">
      <div className="flex justify-center items-center w-full flex-1 self-center p-6 flex-col relative">
        <div className="max-w-md text-center mb-1 block">
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">
            Log in to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Luna AI
            </span>
          </h1>
        </div>
        <span className="block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6 mt-6"></span>
        <UserAuthForm />
      </div>
    </div>
  );
}
