'use client'

import { signOut } from 'next-auth/react';
import React from 'react'

const SignoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
    >
      Logout
    </button>
  );
}

export default SignoutButton
