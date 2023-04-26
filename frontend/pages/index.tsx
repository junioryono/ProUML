import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";

import loginPage from "../public/images/Picture1.png";
import dashboardPage from "../public/images/Picture2.png";
import diagramPage from "../public/images/Picture3.png";
import poster from "../public/images/Poster-1.png";
import diagramEditorFeature from "../public/images/DiagramEditorFeature.png";
import importFeature from "../public/images/ImportFeature.png";
import issuesFeature from "../public/images/IssuesFeature.png";
import projectFeature from "../public/images/ProjectFeature.png";
import shareFeature from "../public/images/ShareFeature.png";
import HomeLayout from "@/components/home/layout";
import { login } from "@/lib/auth-fetch";

export default function Index({ stars }: { stars: string }) {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <HomeLayout user={null}>
         <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
            <div className="mx-auto flex flex-col items-center gap-4 lg:w-[52rem]">
               <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
                  UML Diagramming made easy.
               </h1>
               <p className="text-center leading-normal text-slate-700 sm:text-xl sm:leading-8">
                  ProUML is an intuitive UML diagramming tool for teams and individuals looking to create and edit UML
                  diagrams. It's free to use and you can create and save multiple diagrams.
               </p>
            </div>
            <section className="container grid justify-center gap-6 py-3 md:pb-12 lg:pb-12">
               <div className="grid justify-center gap-4 sm:grid-cols-2 md:max-w-[56rem] md:grid-cols-3">
                  <div className="flex h-[235px] flex-col justify-between rounded-md">
                     <Image src={loginPage} height={800} width={800} className="" alt="Login page" priority />
                  </div>
                  <div className="flex h-[235px] flex-col justify-between rounded-md">
                     <Image src={dashboardPage} height={400} width={400} className="" alt="Dashboard page" priority />
                  </div>
                  <div className="flex h-[235px] flex-col justify-between rounded-md">
                     <Image src={diagramPage} height={400} width={400} className="" alt="Diagram page" priority />
                  </div>
               </div>
            </section>
            <div className="flex gap-4 justify-center pt-4">
               <Link
                  href="/login"
                  className="relative inline-flex h-11 items-center rounded-md border border-transparent bg-brand-500 px-8 py-2 font-medium text-white hover:bg-brand-400 focus:outline-none"
               >
                  Get Started
               </Link>

               {/* <Link
                  href="https://github.com/junioryono/prouml"
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-flex h-11 items-center rounded-md border border-slate-200 bg-white px-8 py-2 font-medium text-slate-900 transition-colors hover:bg-slate-50 focus:outline-none"
               >
                  GitHub
               </Link> */}
            </div>
         </section>

         <hr className="border-slate-200" />

         <section className="text-center container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex flex-col items-center gap-4 md:max-w-[52rem]">
               <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">Features</h2>
               <p className="text-center max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  Here are some of the features that ProUML offers.
               </p>
            </div>
            <div className="grid justify-center gap-4 sm:grid-cols-2 md:max-w-[56rem] md:grid-cols-3">
               <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100px"
                        height="100px"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-12 w-12"
                     >
                        <path
                           d="M16 10.5H8M16 10.5L13 13.5M16 10.5L13 7.5M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7M12 16H19C19.5523 16 20 15.5523 20 15V11"
                           stroke="#FFFFFF"
                           stroke-width="1.5"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                        />
                     </svg>
                     <div className="space-y-2">
                        <h3 className="font-bold text-slate-100">Live Sharing</h3>
                        <p className="text-sm text-slate-100">
                           Collaborate with other users in real-time on a single diagram.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                           <path
                              d="M22 2L13.8 10.2"
                              stroke="#ffffff"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>
                           <path
                              d="M13 6.17004V11H17.83"
                              stroke="#ffffff"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>
                           <path
                              d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                              stroke="#ffffff"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>
                        </g>
                     </svg>
                     <div className="space-y-2">
                        <h3 className="font-bold text-slate-100">Import Source Code</h3>
                        <p className="text-sm text-slate-100">
                           Import Java source code in a .zip file to translate into a customizable UML diagram.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="90px"
                        height="90px"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="group-hover:fill-black"
                     >
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                     </svg>
                     <div className="space-y-2">
                        <h3 className="font-bold text-slate-100">Projects</h3>
                        <p className="text-sm text-slate-100">Organize UML diagrams by storing them into projects.</p>
                     </div>
                  </div>
               </div>
               <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#FFFFFF"
                        height="150px"
                        width="150px"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 512 512"
                     >
                        <g>
                           <g>
                              <path d="M486.4,426.667h-45.926L380.741,307.2h88.593c4.713,0,8.533-3.82,8.533-8.533v-85.333c0-4.713-3.821-8.533-8.533-8.533    h-81.97L277.649,102.4h72.217c4.713,0,8.533-3.821,8.533-8.533V8.533C358.4,3.82,354.579,0,349.867,0H162.133    c-4.713,0-8.533,3.82-8.533,8.533v85.333c0,4.713,3.82,8.533,8.533,8.533h72.217L124.636,204.8h-81.97    c-4.713,0-8.533,3.821-8.533,8.533v85.333c0,4.713,3.82,8.533,8.533,8.533h88.593L71.526,426.667H25.6    c-4.713,0-8.533,3.82-8.533,8.533v68.267c0,4.713,3.82,8.533,8.533,8.533H128c4.713,0,8.533-3.82,8.533-8.533V435.2    c0-4.713-3.82-8.533-8.533-8.533H90.607l56.177-112.354l91.288,112.354H204.8c-4.713,0-8.533,3.82-8.533,8.533v68.267    c0,4.713,3.82,8.533,8.533,8.533h102.4c4.713,0,8.533-3.82,8.533-8.533V435.2c0-4.713-3.82-8.533-8.533-8.533h-33.272    l91.288-112.354l56.177,112.354H384c-4.713,0-8.533,3.82-8.533,8.533v68.267c0,4.713,3.82,8.533,8.533,8.533h102.4    c4.713,0,8.533-3.82,8.533-8.533V435.2C494.933,430.487,491.113,426.667,486.4,426.667z M119.467,494.933H34.133v-51.2h85.333    V494.933z M460.8,290.133h-93.926c-0.001,0-0.002,0-0.003,0h-76.738v-68.267H460.8V290.133z M170.667,17.067h170.667v68.267    H170.667V17.067z M256,105.539L362.351,204.8H281.6c-4.713,0-8.533,3.821-8.533,8.533v85.333c0,4.713,3.82,8.533,8.533,8.533    h67.405L256,421.668L162.995,307.2H230.4c4.713,0,8.533-3.82,8.533-8.533v-85.333c0-4.713-3.821-8.533-8.533-8.533h-80.751    L256,105.539z M51.2,221.867h170.667v68.267h-76.738c-0.001,0-0.002,0-0.003,0H51.2V221.867z M298.667,494.933h-85.333v-51.2    h42.605c0.001,0,0.002,0,0.003,0h0.118c0.001,0,0.002,0,0.003,0h42.605V494.933z M477.867,494.933h-85.333v-51.2h85.333V494.933z" />
                           </g>
                        </g>
                     </svg>
                     <div className="space-y-2">
                        <h3 className="font-bold text-slate-100">Diagram Editor</h3>
                        <p className="text-sm text-slate-100">
                           Customize and style your UML diagrams with an easy-to-use diagram editor.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                     <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="h-12 w-12 fill-current"
                     >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                     </svg>
                     <div className="space-y-2">
                        <h3 className="font-bold text-slate-100">Authentication</h3>
                        <p className="text-sm text-slate-100">Authentication using NextAuth.js and middlewares.</p>
                     </div>
                  </div>
               </div>
               <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                  <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100px"
                        height="100px"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="stroke-1"
                     >
                        <rect width="8" height="14" x="8" y="6" rx="4"></rect>
                        <path d="m19 7-3 2"></path>
                        <path d="m5 7 3 2"></path>
                        <path d="m19 19-3-2"></path>
                        <path d="m5 19 3-2"></path>
                        <path d="M20 13h-4"></path>
                        <path d="M4 13h4"></path>
                        <path d="m10 4 1 2"></path>
                        <path d="m14 4-1 2"></path>
                     </svg>
                     <div className="space-y-2">
                        <h3 className="font-bold text-slate-100">Issues</h3>
                        <p className="text-sm text-slate-100">Markup any UML diagram objects with issues.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem] items-center">
               <p className="max-w-[85%] text-slate-700 sm:text-lg sm:leading-7">
                  Refer to ProUML's detailed documentation or the project CapStone poster to learn more about the
                  application.
               </p>

               {/* buttons to access documentation and poster */}
               <div className="flex flex-col sm:flex-row gap-4 self-center">
                  <Link
                     href="/documentation.pdf"
                     target="_blank"
                     className="relative inline-flex h-11 items-center rounded-md border border-transparent bg-brand-500 px-8 py-2 font-medium text-white hover:bg-brand-400 focus:outline-none"
                  >
                     Documentation
                  </Link>
                  <Link
                     href="/poster.pdf"
                     target="_blank"
                     className="relative inline-flex h-11 items-center rounded-md border border-transparent bg-brand-500 px-8 py-2 font-medium text-white hover:bg-brand-400 focus:outline-none"
                  >
                     CapStone Poster
                  </Link>
               </div>
            </div>
         </section>

         <FadeIn id="diagramFeature">
            <hr className="border-slate-200" />
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
               <div className="mx-auto flex flex-col items-center gap-4 md:max-w-[52rem]">
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                     Using the Diagram Editor
                  </h2>
                  <div className="relative">
                     <Image
                        src={diagramEditorFeature}
                        height={800}
                        width={800}
                        alt="Diagram Editor"
                        priority
                        className="border border-black"
                     />
                  </div>
                  <p className="text-center max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                     ProUML's diagram editor comes with a variety of customizable options to style and edit your UML diagrams
                     however you want.
                  </p>
               </div>
            </section>
         </FadeIn>

         <FadeIn id="shareFeature">
            <hr className="border-slate-200" />
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
               <div className="mx-auto flex flex-col items-center gap-4 md:max-w-[52rem]">
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                     Live Sharing and Collaboration
                  </h2>
                  <Image
                     src={shareFeature}
                     height={800}
                     width={800}
                     className="border border-black"
                     alt="Live sharing popup"
                     priority
                  />
                  <p className="text-center max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                     Share your diagrams with other users and collaborate on them at the same time.
                  </p>
               </div>
            </section>
         </FadeIn>

         <FadeIn id="importFeature">
            <hr className="border-slate-200" />
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
               <div className="mx-auto flex flex-col items-center gap-4 md:max-w-[52rem]">
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                     Importing Source Code
                  </h2>
                  <div className="flex justify-center border-black">
                     <Image
                        src={importFeature}
                        height={800}
                        width={800}
                        className="border border-black"
                        alt="Importing Source Code"
                        priority
                     />
                  </div>
                  <p className="text-center max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                     ProUML's diagram editor comes with a variety of customizable options to stype and edit your UML diagrams
                     however you want.
                  </p>
               </div>
            </section>
         </FadeIn>

         <FadeIn id="issueFeature">
            <hr className="border-slate-200" />
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
               <div className="mx-auto flex flex-col items-center gap-4 md:max-w-[52rem]">
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                     Diagram Issues
                  </h2>
                  <Image
                     src={issuesFeature}
                     height={800}
                     width={800}
                     className="border border-black"
                     alt="Issues Popup"
                     priority
                  />
                  <p className="text-center max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                     Create issues in diagrams by clicking on diagram objects and adding issue descriptions.
                  </p>
               </div>
            </section>
         </FadeIn>

         <FadeIn id="projectFeature">
            <hr className="border-slate-200" />
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
               <div className="mx-auto flex flex-col items-center gap-4 md:max-w-[52rem]">
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">UML Projects</h2>
                  <Image
                     src={projectFeature}
                     height={800}
                     width={800}
                     className="border border-black"
                     alt="Project Page"
                     priority
                  />
                  <p className="text-center max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                     To organize diagrams, you can create projects and assign diagrams to them.
                  </p>
               </div>
            </section>
         </FadeIn>

         <hr className="border-slate-200" />
         <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
            <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
               <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                  Proudly Open Source
               </h2>
               <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  ProUML is open source and powered by open source software. The code is available on{" "}
                  <Link
                     href="https://github.com/junioryono/prouml"
                     target="_blank"
                     rel="noreferrer"
                     className="underline underline-offset-4"
                  >
                     GitHub
                  </Link>
                  .{" "}
                  <Link href="/docs" className="underline underline-offset-4">
                     Everything is also documented here.
                  </Link>
                  .
               </p>
            </div>
            {stars && (
               <div className="flex justify-center">
                  <Link href="https://github.com/junioryono/prouml" target="_blank" rel="noreferrer" className="flex">
                     <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border border-slate-600 bg-slate-800">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="currentColor"
                           viewBox="0 0 24 24"
                           className="h-5 w-5 text-white"
                        >
                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                        </svg>
                     </div>
                     <div className="flex items-center">
                        <div className="h-4 w-4 border-y-8 border-r-8 border-l-0 border-solid border-y-transparent border-r-slate-800"></div>
                        <div className="flex h-10 items-center rounded-md border border-slate-800 bg-slate-800 px-4 font-medium text-slate-200">
                           {stars} stars on GitHub
                        </div>
                     </div>
                  </Link>
               </div>
            )}
         </section>
      </HomeLayout>
   );
}

export const getStaticProps: GetStaticProps = async () => {
   const stars = await getGitHubStars();

   return {
      props: {
         stars,
      },
      revalidate: 60,
   };
};

async function getGitHubStars(): Promise<string | null> {
   try {
      const response = await fetch("https://api.github.com/repos/junioryono/prouml", {
         headers: {
            Accept: "application/vnd.github+json",
         },
      });

      if (!response?.ok) {
         return null;
      }

      const json = await response.json();

      return parseInt(json["stargazers_count"]).toLocaleString();
   } catch (error) {
      return null;
   }
}

import { useState, useEffect } from "react";

const FadeIn = ({ children, id }) => {
   const [isVisible, setIsVisible] = useState(false);
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const currentScrollPos = window.pageYOffset + 800;
         const maxScrollPos = document.body.scrollHeight - window.innerHeight;
         const scrollPercentage = (currentScrollPos / maxScrollPos) * 100;

         const element = document.getElementById(id);
         if (element) {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const elementBottom = elementTop + elementHeight;

            if (currentScrollPos > elementTop && currentScrollPos < elementBottom && !isLoaded) {
               setIsVisible(true);
               setIsLoaded(true);
            } else {
               setIsVisible(false);
            }
         }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, [id, isLoaded]);

   return (
      <div
         id={id}
         className={`transition-opacity duration-1000 ${
            isLoaded ? (isVisible ? "opacity-100" : "opacity-100") : "opacity-0"
         }`}
      >
         {children}
      </div>
   );
};
