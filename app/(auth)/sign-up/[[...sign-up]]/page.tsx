import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <>
      <h2 className="text-primary-text text-opacity-75 font-bold text-3xl mb-1">Welcome In!</h2>
      <h1 className="text-primary-text font-bold text-4xl mb-8">Create your account below</h1>
      <SignUp signInUrl="/sign-in" 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent b-none shadow-none p-0 m-0 max-w-none w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "bg-primary-text text-primary-bg hover:bg-secondary-cta",
            dividerLine: "bg-primary-text",
            dividerText: "text-primary-text",
            formFieldLabel: "text-primary-text",
            formButtonPrimary: "bg-primary-cta text-primary-bg hover:bg-secondary-cta mt-6",
            footerActionText: "text-primary-text",
            footerActionLink: "text-primary-cta hover:text-primary-cta"
          }
        }}
      />
    </>
  )
}