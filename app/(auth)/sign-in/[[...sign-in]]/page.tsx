import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
      <h2 className="text-foreground text-opacity-75 font-bold text-3xl mb-1">Welcome Back!</h2>
      <h1 className="text-foreground font-bold text-4xl mb-8">Please sign in below</h1>
      <SignIn signUpUrl="/sign-up" 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent b-none shadow-none p-0 pl-4 m-0 max-w-none w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "bg-foreground text-background hover:bg-indigo-300",
            socialButtonsBlockButtonText: "text-sm",
            dividerLine: "bg-foreground",
            dividerText: "text-foreground",
            formFieldLabel: "text-foreground text-base",
            formButtonPrimary: "bg-primary text-foreground text-base hover:bg-indigo-500",
            footerActionText: "text-foreground text-base",
            footerActionLink: "text-indigo-500 hover:text-indigo-400 text-base"
          }
        }}
      />
    </>
  )
}