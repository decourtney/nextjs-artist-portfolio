import React from "react";
import OAuthButtons from "../components/OAuthButtons";


const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-blue-100 text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="px-8 py-10">
            <OAuthButtons />
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
