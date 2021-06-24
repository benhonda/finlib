import { h1, h3, h4, h5, p1, p2 } from "constants/styles";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import NewResourceSlideover from "components/newResourceSlideover/newResourceSlideover";
import { getFirebaseAdmin, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { loadResources } from "redux/resources";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import axios from "axios";
import { WebResource, webResourceConverter } from "dbtypes/WebResource";
import SimpleModal from "components/SimpleModal";
import LoginBox from "components/auth/loginBox";

function Home({ resources = [] }) {
  const AuthUser = useAuthUser();

  const [saveResourceIdForModal, setSaveResourceIdForModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const saveResource = useCallback(
    (resourceDocId) => {
      if (!AuthUser.id) return setIsLoginModalOpen(true);
      setSaveResourceIdForModal(resourceDocId);
    },
    [AuthUser, setSaveResourceIdForModal, setIsLoginModalOpen]
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>FinTools Investment Research Library | Shipsuite</title>
        <meta name="description" content="A library of tools &amp; resources for trading &amp; investing, from websites to social media accounts to books and ebooks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SimpleModal show={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} listOfModalSettersToClose={[setSaveResourceIdForModal]}>
        <div className="px-12 pb-12 pt-16 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginBox />
          </div>
        </div>
      </SimpleModal>

      <main className="min-h-screen">
        <NewResourceSlideover />

        {/* navbar */}
        <nav className="z-20 fixed top-0 left-0 w-full h-12 bg-white shadow">
          <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h3 className={`${p2({ isDisplay: true, isWeighted: false })} font-semibold text-gray-800`}>The Investors Library</h3>
            </div>
            <div>
              {/* <Link href={{ query: { new: "resource" } }}>
                <a className={`${p2({})} transition-colors text-green-500 hover:text-green-600`}>Add a resource +</a>
              </Link> */}

              <Link href="/auth">
                <a className={`${p2({})} transition-colors text-green-800 hover:text-gray-700 mx-4`}>Login</a>
              </Link>

              <Link href="/auth">
                <a className={`${p2({})} transition-colors text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md`}>Register</a>
              </Link>

              {AuthUser.id && (
                <button
                  type="button"
                  onClick={() => {
                    AuthUser.signOut();
                  }}
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-12 gap-x-12 w-full">
          <div className="col-span-2 pt-1">
            <h1 className={`${h4({})} text-gray-900`}>Filter</h1>
            <div className="mt-4 flex flex-col items-start space-y-4">
              <a href="#" className={`${p2({ isDisplay: true, isWeighted: false })} font-semibold text-gray-900 border-b-2 border-gray-900`}>
                Most recent
              </a>
              <a href="#" className={`${p2({ isDisplay: true, isWeighted: true })} text-gray-500`}>
                Trending
              </a>
            </div>
          </div>

          <div className="col-span-7">
            {/* search bar */}
            <div className="h-10 flex items-center border-b border-gray-300">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div>
                <input className={`${p2({})} h-full bg-transparent border-none placeholder-gray-400`} type="text" placeholder="Search for a resource, ticker, article" />
              </div>
            </div>

            {/* sort */}
            <div className="pt-4 flex items-center justify-start">
              <p className={`${p2({})} text-gray-500 pr-2`}>Show:</p>
              <div className="flex items-center space-x-2">
                <a href="#" className={`${p2({ isWeighted: false })} text-blue-500 font-semibold bg-blue-100 border border-blue-500 rounded-full px-3 py-px`}>
                  All
                </a>
                <a href="#" className={`${p2({ isWeighted: true })} text-gray-900 border border-gray-900 rounded-full px-3 py-px`}>
                  Articles
                </a>
                <a href="#" className={`${p2({ isWeighted: true })} text-gray-900 border border-gray-900 rounded-full px-3 py-px`}>
                  Substacks
                </a>
              </div>
            </div>

            <h1 className={`${h5({})} pt-10 text-gray-700`}>Most recent</h1>

            <div className="pt-2 grid grid-cols-1 gap-2">
              {resources.map((resource) => (
                <div onClick={() => {}} key={resource.docId} className="transition-colors bg-white rounded shadow border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="p-5 flex items-start h-32">
                    <a href="#" className="h-full aspect-h-1">
                      <img src={resource.logo} alt={resource.name} className="rounded h-full w-full object-contain" />
                    </a>
                    <div className="flex-1 pl-4 pt-0.5 flex flex-col h-full">
                      <div className="flex-1 w-full">
                        <p className="text-base font-display font-semibold text-gray-900">{resource.name}</p>
                        <p className="text-sm text-gray-500 pt-0.5 truncate">{resource.description}</p>
                      </div>
                      <div className="flex items-center divide-x divide-gray-300 py-0.5">
                        <p className="pr-3">
                          <button type="button" onClick={saveResource} className="text-xs text-gray-500 hover:underline">
                            Save
                          </button>
                        </p>

                        <p className="pl-3 text-xs text-gray-500 truncate">
                          {resource.tags?.map((tag, i) => {
                            let t = (
                              <a href="#" className="hover:underline">
                                {tag},&nbsp;
                              </a>
                            );

                            if (i >= resource.tags?.length - 1) {
                              t = (
                                <a href="#" className="hover:underline">
                                  {tag}
                                </a>
                              );
                            }
                            return <span key={tag}>{t}</span>;
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="h-full px-1 flex items-center justify-center">
                      <div>
                        <button type="button" className="transition-colors group rounded-full p-0.5 text-gray-500 hover:bg-green-100 hover:text-green-600">
                          <ChevronUpIcon className="h-7 w-7 transition-transform transform group-hover:-translate-y-1" />
                        </button>
                        <div className="flex items-center justify-center pb-1">
                          <p className="text-sm uppercase text-gray-700 font-medium">
                            <span className="tracking-wide">17</span>
                          </p>
                        </div>
                        <button type="button" className="transition-colors group rounded-full p-0.5 text-gray-500 hover:bg-red-100 hover:text-red-600">
                          <ChevronDownIcon className="h-7 w-7 transition-transform transform group-hover:translate-y-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-3">Aside</div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

// This page does not require authentication, so it won't redirect to
// the login page if you are not signed in.
// If you remove `getServerSideProps` from this page, it will be static
// and load the authed user only on the client side.

export const getServerSideProps = async () => {
  // withAuthUserTokenSSR();
  let resources = [];

  try {
    const db = getFirebaseAdmin().firestore();
    const querySnapshot = await db.collection("resources").withConverter(webResourceConverter).get();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      resources.push(new WebResource({ ...data, docId: doc.id }));
    });
  } catch (e) {
    console.error(e);
  }

  let res = JSON.parse(JSON.stringify(resources));

  return {
    props: {
      resources: res,
    },
  };
};

export default withAuthUser()(Home);
