import { h1, h3, h4, p1, p2 } from "constants/styles";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon, LinkIcon, PencilIcon, PhotographIcon, PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import { XIcon } from "@heroicons/react/outline";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
import { removeSpecialChars } from "utils/helpers";
import { WebResource, webResourceConverter } from "dbtypes/WebResource";
import { useAuthUser } from "next-firebase-auth";

const FILL_TAGS = [
  "Portfolio tools",
  "Business Articles",
  "Screener",
  "Calculator",
  "Company Research",
  "Insider Activity",
  "Copycat investing",
  "Stock data",
  "Conference Calls",
  "IPOs",
  "Education",
  "Stock Valuation",
  "Analyst Estimates",
  "Charts",
];
const FILL_SUGGESTIONS = ["Charts", "Screener", "Stock data", "Education"];

export default function NewWebsiteDetailsPage({ setNewResourceType }) {
  const AuthUser = useAuthUser();
  const router = useRouter();

  const { register, handleSubmit, formState, setValue, watch, reset } = useForm();

  const [step, setStep] = useState(1);

  const handleStepForward = useCallback(() => {
    setStep(Math.min(step + 1, 2));
  }, [step]);

  const handleStepBackward = useCallback(() => {
    // first step
    if (step === 1) setNewResourceType(null);

    setStep(Math.max(step - 1, 1));
  }, [step]);

  const [tags, setTags] = useState([]);

  const [isMetaDataLoading, setIsMetaDataLoading] = useState(false);

  const websiteUrl = watch("website.url") || "";
  // const websiteDescription = watch("website.description");
  const tagInTextfield = watch("website.taginfield") || "";
  const [websiteMetaData, setWebsiteMetaData] = useState({});

  const addTag = (tagFromClick) => {
    if (!tags.includes(tagInTextfield)) {
      setTags([tagFromClick || tagInTextfield, ...tags]);
      setValue("website.taginfield", "");
    }
  };

  const removeTag = (tag) => {
    if (tags.includes(tag)) {
      const _tags = tags.filter((t) => t.toLowerCase() !== tag.toLowerCase());
      setTags(_tags);
    }
  };

  const getMetadata = useCallback(async (url) => {
    if (!url || url.length === 0) return;
    try {
      setIsMetaDataLoading(true);
      const res = await axios.post("/api/metadata", { url });
      const { data } = res;
      setWebsiteMetaData(data);
    } catch (e) {
      setWebsiteMetaData({});
      console.error(e);
    } finally {
      setIsMetaDataLoading(false);
    }
  }, []);

  let websiteName = websiteMetaData.title || websiteMetaData.publisher || websiteMetaData.author;
  let websiteDescription = websiteMetaData.description;

  useEffect(() => {
    setValue("website.name", websiteMetaData.publisher || websiteMetaData.author);
    setValue("website.title", websiteMetaData.title);
    setValue("website.description", websiteMetaData.description);
    setValue("website.image", websiteMetaData.image);
    setValue("website.logo", websiteMetaData.logo);
  }, [websiteMetaData]);

  useEffect(() => {
    // wait a bit before getting the metadata
    const timeOutId = setTimeout(() => getMetadata(websiteUrl), 1000);
    return () => clearTimeout(timeOutId);
  }, [websiteUrl]);

  const closeSlideOver = () => {
    setNewResourceType(null);
    router.replace("/", undefined, { shallow: true });
  };

  const isOfficialData = Object.keys(formState.dirtyFields.website || {}).length <= 1;

  let tagAutocompleteResults = tagInTextfield.length > 0 ? FILL_TAGS.filter((tag) => tag.toLowerCase().includes(tagInTextfield.toLowerCase())) : [];
  tagAutocompleteResults = tagAutocompleteResults.filter((tag) => !tags.includes(tag));

  let suggestions = FILL_SUGGESTIONS.filter((tag) => !tags.includes(tag));

  const onSubmit = (data) => {
    const { website } = data;

    try {
      const db = firebase.firestore();
      const docId = removeSpecialChars(website.name);
      db.collection("resources")
        .doc(docId)
        .withConverter(webResourceConverter)
        .set(
          new WebResource({
            docId,
            name: website.name,
            title: website.title,
            url: website.url,
            description: website.description,
            image: website.image,
            logo: website.logo,
            postedBy: AuthUser.firebaseUser.uid,
            tags,
          })
        );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={`h-14 transition-all flex flex-col justify-center px-4 bg-green-500 sm:px-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => handleStepBackward()}>
              <ArrowLeftIcon className="h-5 w-5 text-white" />
            </button>

            <Dialog.Title className="text-lg font-medium text-white">Add a Web Resource</Dialog.Title>
          </div>
          <div className="ml-3 h-7 flex items-center">
            <button type="button" className="bg-green-700 rounded text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={() => closeSlideOver()}>
              <span className="sr-only">Close panel</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="h-full">
        <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
          <div className="flex-1 h-0 overflow-y-auto">
            {/* Step 1 */}
            {step === 1 && (
              <div className="divide-y divide-gray-200">
                <div className="pt-6">
                  <div className="pb-3 px-4 sm:px-6">
                    <label htmlFor="project_name" className="block text-sm font-medium text-gray-900">
                      Enter a website URL
                    </label>
                    <div className="relative mt-1">
                      <input
                        {...register("website.url")}
                        type="text"
                        placeholder="https://example.com"
                        className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                      />
                      <div className="h-6 flex items-end">
                        {isMetaDataLoading ? (
                          <div className={`flex items-center`}>
                            <svg className="h-4 w-4 text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <p className="pl-1 text-xs text-gray-500">Fetching</p>
                          </div>
                        ) : websiteMetaData.url ? (
                          <div className={`flex items-center`}>
                            {/* <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="pl-1 text-xs text-green-500">Successfully retrieved website details</p> */}
                          </div>
                        ) : (
                          <div className={`${websiteUrl.length > 0 ? "block" : "hidden"} flex items-center`}>
                            <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="pl-1 text-xs text-red-500">Invalid URL. Please double-check and try again.</p>
                          </div>
                        )}
                      </div>
                      <div className={`${isMetaDataLoading ? "block" : "hidden"} z-10 absolute right-3 top-3 h-4 w-4`}>
                        <svg className="h-full w-full text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>

                      <div className={`${!isMetaDataLoading && websiteMetaData.url ? "block" : "hidden"} z-10 absolute right-3 top-2.5 h-5 w-5`}>
                        <svg className="h-full w-full text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className={`${!isMetaDataLoading && !websiteMetaData.url && websiteUrl.length > 0 ? "block" : "hidden"} z-10 absolute right-3 top-3 h-4 w-4`}>
                        <svg className="h-full w-full text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {websiteMetaData.url && (
                    <>
                      {/* Official data -> data that comes from the website metadata, not user inputted data */}
                      {isOfficialData ? (
                        <div className="relative border-t border-gray-300 bg-gray-50 pt-6">
                          <button type="button" className="transition-colors absolute top-2 right-5 rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                            <PencilIcon className="h-6 w-6" />
                          </button>

                          <div className="px-4 sm:px-6 divide-y divide-gray-200">
                            <div className="pb-6">
                              <p className="text-xs text-gray-500 pb-1 uppercase tracking-wide">Name</p>
                              <p className="text-base text-gray-800">{websiteName}</p>
                            </div>

                            <div className="py-6">
                              <p className="text-xs text-gray-500 pb-1 uppercase tracking-wide">Description</p>
                              <p className="text-base text-gray-800">{websiteDescription}</p>
                            </div>

                            <div className="py-6">
                              <p className="text-xs text-gray-500 pb-2 uppercase tracking-wide">Logo</p>
                              <img className={`${websiteMetaData.logo ? "block" : "hidden"} w-20 h-20 rounded shadow`} src={websiteMetaData.logo} alt={websiteMetaData.title} />
                              <div className={`${websiteMetaData.logo ? "hidden" : "flex items-center justify-center"} w-20 h-20 rounded bg-white shadow`}>
                                <PhotographIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 sm:px-6">
                          {/* <div className={`${websiteMetaData.url ? "" : "pointer-events-none opacity-40"}`}>
                        <label htmlFor="images" className="block text-sm font-medium text-gray-900">
                          Display images
                        </label>
                        <div className="relative mt-1">
                          <img
                            className={`${websiteMetaData.image ? "block" : "hidden"} w-full h-36 object-cover rounded-lg shadow border border-gray-200`}
                            src={websiteMetaData.image}
                            alt={websiteMetaData.title}
                          />
                          <input {...register("website.image")} hidden />
                          <div className={`${websiteMetaData.image ? "hidden" : "flex items-center justify-center"} w-full h-36 rounded-lg bg-gray-300 border border-gray-200 shadow`}>
                            <PhotographIcon className="h-8 w-8 text-gray-500" />
                          </div>
                          <img
                            className={`${websiteMetaData.logo ? "block" : "hidden"} absolute left-4 -bottom-4 w-20 h-20 rounded-full shadow-xl border border-gray-200`}
                            src={websiteMetaData.logo}
                            alt={websiteMetaData.title}
                          />
                          <input {...register("website.logo")} hidden />
                          <div
                            className={`${
                              websiteMetaData.logo ? "hidden" : "flex items-center justify-center"
                            } absolute left-4 -bottom-4 w-20 h-20 rounded-full shadow-xl bg-gray-100 border border-gray-300`}
                          >
                            <PhotographIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                      </div> */}

                          <div className={`${websiteMetaData.url ? "" : "pointer-events-none opacity-40"} pt-8`}>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                              Name
                            </label>
                            <div className="mt-1">
                              <input
                                {...register("website.name")}
                                type="text"
                                placeholder="Resource name"
                                className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className={`${websiteMetaData.url ? "" : "pointer-events-none opacity-40"}`}>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                              Title
                            </label>
                            <div className="mt-1">
                              <input
                                {...register("website.title")}
                                type="text"
                                placeholder="Resource title"
                                className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className={`${websiteMetaData.url ? "" : "pointer-events-none opacity-40"}`}>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                {...register("website.description")}
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="px-4 sm:px-6 pt-4 pb-6">
                  <div className="flex text-sm">
                    <a href="#" className="group inline-flex items-center text-gray-500 hover:text-gray-900">
                      <QuestionMarkCircleIcon className="mt-px h-4 w-4 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                      <span className="ml-2">Learn more about sharing</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="px-4 divide-y divide-gray-200 sm:px-6">
                <div className="space-y-6 pt-6 pb-5">
                  <div className="relative">
                    <label htmlFor="addTags" className="block text-sm font-medium text-gray-900">
                      Add tags
                    </label>
                    <p className="text-gray-500 text-sm pt-2 pb-3">Tags help people find resources by allowing us to organize them into categories. Please do not add unnecessary tags.</p>
                    <div className="relative mt-1">
                      <input
                        {...register("website.taginfield")}
                        type="text"
                        placeholder="Start typing a tag name"
                        className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                      />
                      {/* suggestions */}
                      {suggestions.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="pr-1">Suggestions:</span>
                          {suggestions.map((suggestion, idx) => {
                            let btn = (
                              <button className="hover:underline" type="button" onClick={() => addTag(suggestion)}>
                                {suggestion}
                              </button>
                            );
                            if (idx < suggestions.length - 1)
                              btn = (
                                <>
                                  <button className="hover:underline" type="button" onClick={() => addTag(suggestion)}>
                                    {suggestion}
                                  </button>
                                  <span>,&nbsp;</span>
                                </>
                              );

                            return (
                              <div key={suggestion} className="inline-block">
                                {btn}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* add button */}
                      <div className="absolute top-1 right-2">
                        <button
                          type="button"
                          onClick={() => addTag()}
                          className={`${tagInTextfield.length > 0 ? "text-green-500 hover:bg-green-100" : "text-gray-400"} transition-colors p-1 rounded-full`}
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* autocomplete */}
                      <div className="absolute top-10 left-0 w-full rounded shadow-lg bg-white">
                        {tagAutocompleteResults.length > 0 &&
                          tagAutocompleteResults.map((tag) => (
                            <button key={tag} type="button" onClick={() => addTag(tag)} className="w-full text-left px-4 py-2 hover:bg-gray-100 border border-gray-200">
                              <span>{tag}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="">
                    {tags.map((tag) => (
                      <span key={tag} className="m-1 inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                        >
                          <span className="sr-only">Remove {tag} option</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`flex flex-shrink-0 px-4 py-4 justify-end`}>
            <button
              type="button"
              className={`bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              onClick={() => handleStepBackward()}
            >
              Go back
            </button>

            <button
              type="button"
              onClick={() => handleStepForward()}
              className={`${step === 2 ? "hidden" : "inline-flex"} ${
                websiteUrl.length > 0 && websiteMetaData.url ? "text-white bg-green-500" : "text-gray-500 bg-gray-200 pointer-events-none"
              } ml-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              Continue
            </button>

            <button
              type="submit"
              className={`${
                step === 2 ? "inline-flex" : "hidden"
              } ml-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      {/* <SimpleModal show={showCloseAlert} onClose={() => setShowCloseAlert(false)}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              Are you sure?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                The information you provided for this resource will be lost if you exit now.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button type="button" onClick={() => setShowCloseAlert(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Discard &amp; Continue
          </button>
          <button type="button" onClick={() => setShowCloseAlert(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </SimpleModal> */}
    </>
  );
}
