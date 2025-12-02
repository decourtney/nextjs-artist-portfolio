"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

const ProfileManagement = () => {
  const session = useSession();

  return (
    <section
      id="profile-management"
      className="bg-white p-6 rounded-xl rounded-t-none shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <IoPersonCircleOutline className="text-blue-600" size={28} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
            <p className="text-sm text-gray-600">
              {session.data?.user.email || "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Active
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProfileManagement;
