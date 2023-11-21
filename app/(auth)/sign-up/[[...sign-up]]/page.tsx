'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ClerkAPIErrorJSON } from '@clerk/types';
import {  SignInOAuthButtons } from '../../../google-auth/google-auth';


export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState("");
  const router = useRouter();
 
  // This function will handle the user submitting their email and password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress, password
      });
 
      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code'
      });
 
      // Set 'verifying' true to display second form and capture the OTP code
      setVerifying(true);
    }
    catch (err: any) {
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  }
 
  // This function will handle the user submitting a code for verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
 
    try {
      // Submit the code that the user provides to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      });
 
      if (completeSignUp.status !== "complete") {
        // The status can also be `abandoned` or `missing_requirements`
        // Please see https://clerk.com/docs/references/react/use-sign-up#result-status for  more information
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
 
      // Check the status to see if it is complete
      // If complete, the user has been created -- set the session active
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        // Redirect the user to a post sign-up route
        router.push("/");
      }
    }
    catch (err: any) {
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  }
 
  // Once the sign-up form was submitted, verifying was set to true and as a result, this verification form is presented to the user to input their verification code.
  if (verifying) {
    return (
      <form onSubmit={handleVerify} className="flex flex-col space-y-4">
      <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        id="code"
        name="code"
        type="text"
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter your code"
      />
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Complete Sign Up
      </button>
    </form>

    )
  }
  
  // Display the initial sign-up form to capture the email and password
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
      <div className="w-1/2 bg-primary flex flex-col p-10" >
        <div className='max-w-md w-full mx-auto'>
          <h2 className='text-xl font-bold text-white-800 mb-1'>Welcome!</h2>
          <p className='text-2xl mb-8'>Please Sign Up</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <div>
              {/* Email and Password Input Fields */}
              <div className="space-y-4">
                <div className="flex items-center border-0 border-b border-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} className="text-white text-lg mr-2" />
                  <input
                    onChange={(e) => setEmailAddress(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    value={emailAddress}
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
              
            </div>

            {/* Buttons and Links */}
            <div className="mt-4">
          
              <button  type="submit" className="w-full py-2 px-4 hover:bg-blue-700 rounded-md text-black " style={{ backgroundColor: '#a6abff' }}>Sign Up</button>
              <div className="flex items-center justify-center my-6">
                <div className="bg-gray-600 h-px flex-grow t-2"></div>
                <span className="mx-4 text-sm">OR</span>
                <div className="bg-gray-600 h-px flex-grow t-2"> </div>
              </div>
              <button  className="w-full py-2 px-4 bg-white-500 hover:bg-white-700 rounded-md text-black "style={{ backgroundColor: 'white' }}>
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />  <SignInOAuthButtons />
              </button>
              <p className="mt-4 text-center text-sm text-gray-400">
                Already have an account? 
                <a href="/sign-in" className="text-blue-500 hover:text-blue-300"> Login Here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>



  );
}