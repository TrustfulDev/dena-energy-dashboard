'use client'
import { ClerkProvider, SignedIn, SignedOut, useSignIn } from '@clerk/nextjs';
import { AppProps } from 'next/app';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
const publicPages: Array<string> = [];
 
export const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();
  if (!isLoaded) {
    return null;
  }
  const signInWithGoogle = () =>
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/'
    });
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};
function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const isPublicPage = publicPages.includes(pathname);
 
  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <SignInOAuthButtons />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}
 
export default MyApp;