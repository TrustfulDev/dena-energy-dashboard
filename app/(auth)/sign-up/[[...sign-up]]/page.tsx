import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <>
      <h2 className="text-foreground text-opacity-75 font-bold text-3xl mb-1">Welcome In!</h2>
      <h1 className="text-foreground font-bold text-4xl mb-8">Create your account below</h1>
      <SignUp signInUrl="/sign-in" 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent b-none shadow-none p-0 m-0 max-w-none w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "bg-foreground text-background hover:bg-indigo-300",
            socialButtonsBlockButtonText: "text-sm",
            dividerLine: "bg-foreground",
            dividerText: "text-foreground",
            formFieldLabel: "text-foreground",
            formButtonPrimary: "bg-primary text-foreground text-base hover:bg-indigo-500mt-6",
            footerActionText: "text-foreground text-base",
            footerActionLink: "text-indigo-500 hover:text-indigo-400 text-base"
          }
        }}
      />
    </>
  )
}