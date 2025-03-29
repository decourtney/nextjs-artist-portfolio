import React from "react";
import OAuthButtons from "@/app/components/OAuthButtons";

const LoginPage = () => {
  // TODO: bug fix: login form does style adjustment when focused - probably due to font style change when focused
  return (
    <section>
      <div className="md:max-w-[500px] md:mt-10 mx-auto bg-content2 border-b-1 md:border-1 border-content3 rounded-lg shadow-md">
        <div className="p-4 border-b-1 border-content3 text-center">
          <h2>- Log in -</h2>
        </div>

        <div className="p-8 mx-auto">
   

          <OAuthButtons />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
