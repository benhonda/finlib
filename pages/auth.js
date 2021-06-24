import LoginBox from "components/auth/loginBox";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import Head from "next/head";
import Link from "next/link";

const Auth = () => {
  return (
    <div className="relative">
      <Head>
        <title>Log in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`flex items-center justify-center min-h-screen bg-white`}>
        <div className="w-full max-w-xs">
          <LoginBox />
        </div>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
