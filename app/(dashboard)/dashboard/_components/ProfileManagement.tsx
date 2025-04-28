"use client";

import { useSession } from "next-auth/react";
import React from "react";

const ProfileManagement = () => {
  const session = useSession();

  return (
     <section
      id="profile-management"
      className="bg-background-50 p-6 rounded-b-lg shadow-md"
    >
      <div className="flex items-center">
        <span className="text-gray-700">{session.data?.user.email}</span>
      </div>
    </section>
  );
};

export default ProfileManagement;
