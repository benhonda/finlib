import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Head from "next/head";
import Link from "next/link"
import firebase from 'firebase/app'
import 'firebase/auth'

const Auth = () => {

  const signInWithGoogle = () => {
    try {
  
      var provider = new firebase.auth.GoogleAuthProvider();
      // optional
      // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      // firebase.auth().languageCode = 'it';
      // To apply the default browser preference instead of explicitly setting it.
      // firebase.auth().useDeviceLanguage();
  
      firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
  
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          console.log("User logged in successfully.");
          console.log(user);
          // ...
        }).catch((error) => {
          console.log(error);
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="relative">
      <Head>
        <title>Log in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`flex items-center justify-center min-h-screen bg-white`}
      >
        <div className="flex w-full max-w-xs">
          <div className="w-full flex flex-col -mt-12">
            <h2 className="text-center text-2xl font-semibold text-gray-900">
              Login to your account
            </h2>

            <div className="my-6 flex">
              {/* <GitHubButton>Continue with GitHub</GitHubButton> */}
              <button type="button" onClick={() => signInWithGoogle()} className="w-full flex justify-center items-center px-4 py-3 shadow rounded text-white bg-gray-900">Sign in with Google</button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t text-gray-300`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 bg-white text-gray-400 text-xs`}
                >
                  OR
                </span>
              </div>
            </div>

            <div className="my-6">
              
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-center text-sm">
                <Link href={"#"}>
                  <a>
                    Forgot your password?
                  </a>
                </Link>
              </p>
              <p className={`text-center text-sm text-gray-500`}>
                Don&lsquo;t have an account yet?{" "}
                <Link href="#">
                  <a>
                    Create one here
                  </a>
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth)