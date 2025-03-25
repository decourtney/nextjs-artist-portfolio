"use client";

import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import React from "react";

const OAuthButtons = () => {
  return (
    <div className="flex justify-around gap-2">
      <Button fullWidth onPress={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Google
      </Button>
    </div>
  );
};

export default OAuthButtons;
