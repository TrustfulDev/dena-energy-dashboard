'use client'
 
import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey} from '@fortawesome/free-solid-svg-icons';
import {  SignInOAuthButtons } from '../../../google-auth/google-auth';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';



  
export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
 
  // Handle the submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
 
    // Start the sign-in process using the email and password provided
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });
 
      if (completeSignIn.status !== 'complete') {
        // The status can also be `needs_factor_on', 'needs_factor_two', or 'needs_identifier'
        // Please see https://clerk.com/docs/references/react/use-sign-in#result-status for  more information
        console.log(JSON.stringify(completeSignIn, null, 2));
      }
 
      if (completeSignIn.status === 'complete') {
        // If complete, user exists and provided password match -- set session active
        await setActive({ session: completeSignIn.createdSessionId });
        // Redirect the user to a post sign-in route
        router.push('/');
      }
    } catch (err: any) {
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
 
  // Display a form to capture the user's email and password
  return (
    <div className="flex min-h-screen text-white">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-between p-10" style={{ backgroundColor: '#a6abff' }}>
        <div>
          <h1 className="text-4xl font-bold text-gray-700 mb-4">Dena Energy</h1>
          <p className="text-2xl font-bold text-gray-800">Best Energy Data Analytics Platform</p>
        </div>
        <div>
          <p className="text-xs text-gray-700">Secured with Clerk Authentication</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-primary flex flex-col p-10">
        <div className='max-w-md w-full mx-auto'>
          <h2 className='text-xl font-bold text-white-800 mb-1'>Welcome Back!</h2>
          <p className='text-2xl mb-8'>Please Log in</p>
      
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <div>
          {/* Email and Password Input Fields */}
          <div className="space-y-4">
          <div className="flex items-center border-0 border-b border-gray-600">
            <FontAwesomeIcon icon={faEnvelope} className="text-white text-lg mr-2" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              value={email}
              required
              className="appearance-none block w-full px-3 py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 autofill:bg-transparent"
              placeholder="Email"
            />
          </div>

          <div className="flex items-center border-0 border-b border-gray-600">
            <FontAwesomeIcon icon={faKey} className="text-white text-lg mr-2" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              value={password}
              required
              className="appearance-none block w-full px-3 py-2 border-0 border-b border-gray-600 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 autofill:bg-transparent"
              placeholder="Password"
            />
          </div>

          </div> 
          <div className="text-sm text-right">
            <a href="#" className="text-blue-500 hover:text-blue-300">Forgot Password?</a>
          </div>
            </div>

        {/* Buttons and Links */}
        <div className="mt-4">
          <button type="submit" className="w-full py-2 px-4 hover:bg-blue-700 rounded-md text-black " style={{ backgroundColor: '#a6abff' }}>Login</button>
          <div className="flex items-center justify-center my-6">
            <div className="bg-gray-600 h-px flex-grow t-2"></div>
            <span className="mx-4 text-sm">OR</span>
            <div className="bg-gray-600 h-px flex-grow t-2"> </div>
          </div>
          <button  className="w-full py-2 px-4 bg-white-500 hover:bg-white-700 rounded-md text-black "style={{ backgroundColor: 'white' }}>
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />  <SignInOAuthButtons />
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Dont have an account? 
            <a href="/sign-up" className="text-blue-500 hover:text-blue-300"> Register Here</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>



  );
}

