import React, { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { SignUpForm } from "../components/auth/SignUpForm";

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl w-full space-y-4 mx-auto">
        {/* Page Heading */}
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          {isSignUp ? "Sign Up for an Account" : "Sign In to Your Account"}
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          {isSignUp
            ? "Join us by signing up to access all features."
            : "Sign in to your account to continue."}
        </p>

        {/* Form Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 border border-black">
          {isSignUp ? <SignUpForm /> : <LoginForm />}
        </div>

        {/* Toggle Between Login and Sign Up */}
        <div className="text-center mt-6">
          <p className="text-#880090 text-#880090">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-#880090 hover:text-#7a0082"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
