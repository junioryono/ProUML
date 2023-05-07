import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";
import { useState, useEffect } from "react";

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
   // to keep track of if the user has scrolled to the bottom of the page or not
   const [bottom, setBottom] = useState(false);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // if the user has scrolled to the bottom of the page, then set bottom to true
   const handleScroll = () => {
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
      if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
         setBottom(true);
      } else {
         setBottom(false);
      }
   };

   // add an event listener to the window to listen for scroll events
   useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <HomeLayout user={null}>
         {/* only show scroll down arrrow if not at the bottom */}
         {!bottom && (
            <div
               className="fixed bottom-10 left-1/2 transform -translate-x-1/2 -ml-6 flex mx-auto animate-bounce justify-center z-50 shadow-xl rounded-full bg-white cursor-pointer"
               onClick={() => {
                  // scroll to the bottom of the page
                  window.scrollTo({
                     top: document.body.scrollHeight,
                     behavior: "smooth",
                  });
               }}
            >
               <svg
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  className="bi bi-arrow-down-circle-fill"
                  height={50}
                  width={50}
               >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                     <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"></path>{" "}
                  </g>
               </svg>
            </div>
         )}

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
                     <Image
                        src={loginPage}
                        height={800}
                        width={800}
                        className="border border-black"
                        alt="Signup page"
                        priority
                     />
                  </div>
                  <div className="flex h-[235px] flex-col justify-between rounded-md">
                     <Image
                        src={dashboardPage}
                        height={400}
                        width={400}
                        className="border border-black"
                        alt="Dashboard page"
                        priority
                     />
                  </div>
                  <div className="flex h-[235px] flex-col justify-between rounded-md">
                     <Image
                        src={diagramPage}
                        height={400}
                        width={400}
                        className="border border-black"
                        alt="Diagram page"
                        priority
                     />
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

         <ScrollFadeIn id="features">
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
                           className="h-14 w-14"
                        >
                           <path
                              d="M16 10.5H8M16 10.5L13 13.5M16 10.5L13 7.5M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V7M12 16H19C19.5523 16 20 15.5523 20 15V11"
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
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
                        <svg
                           viewBox="0 0 24 24"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-10 w-10"
                           stroke="currentColor"
                        >
                           <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                           <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <path
                                 d="M22 2L13.8 10.2"
                                 stroke="#ffffff"
                                 strokeWidth="2.4"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              ></path>
                              <path
                                 d="M13 6.17004V11H17.83"
                                 stroke="#ffffff"
                                 strokeWidth="2.4"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              ></path>
                              <path
                                 d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                                 stroke="#ffffff"
                                 strokeWidth="2.4"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              ></path>
                           </g>
                        </svg>
                        <div className="space-y-2">
                           <h3 className="font-bold text-slate-100">Import Source Code</h3>
                           <p className="text-sm text-slate-100">Translate code to UML by importing Java source code.</p>
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
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="group-hover:fill-black h-12 w-12"
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
                        {/* <svg
                           viewBox="0 0 16 16"
                           xmlns="http://www.w3.org/2000/svg"
                           fill="#ffffff"
                           className="w-12 h-12"
                           stroke="#ffffff"
                           strokeWidth="0"
                        >
                           <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                           <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <path
                                 fillRule="evenodd"
                                 d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z"
                              ></path>
                           </g>
                        </svg> */}
                        <svg
                           fill="#ffffff"
                           className="w-12 h-12"
                           version="1.1"
                           id="Layer_1"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 512 512"
                           stroke="#ffffff"
                        >
                           <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <g>
                                 <g>
                                    <path d="M496,324.362h-31.702v-60.01c0-8.836-7.164-16-16-16H271.996v-60.714h127.109c8.836,0,16-7.164,16-16V76.235 c0-8.836-7.164-16-16-16h-286.21c-8.836,0-16,7.164-16,16v95.404c0,8.836,7.164,16,16,16h127.101v60.714H63.702 c-8.836,0-16,7.164-16,16v60.01H16c-8.836,0-16,7.164-16,16v95.404c0,8.836,7.164,16,16,16h95.404c8.836,0,16-7.164,16-16v-95.404 c0-8.836-7.164-16-16-16H79.702v-44.01h160.293v44.01h-31.698c-8.836,0-16,7.164-16,16v95.404c0,8.836,7.164,16,16,16h95.404 c8.836,0,16-7.164,16-16v-95.404c0-8.836-7.164-16-16-16h-31.707v-44.01h160.302v44.01h-31.702c-8.836,0-16,7.164-16,16v95.404 c0,8.836,7.164,16,16,16H496c8.836,0,16-7.164,16-16v-95.404C512,331.525,504.836,324.362,496,324.362z M95.404,356.362v63.404H32 v-63.404H95.404z M287.702,356.362v63.404h-63.404v-63.404H287.702z M128.895,155.638V92.235h254.21v63.404H128.895z M480,419.765 h-63.404v-63.404H480V419.765z"></path>{" "}
                                 </g>
                              </g>
                           </g>
                        </svg>
                        <div className="space-y-2">
                           <h3 className="font-bold text-slate-100">Diagram Editor</h3>
                           <p className="text-sm text-slate-100">
                              Customize and style UML diagrams with an easy-to-use diagram editor.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl">
                     <div className="flex h-[180px] flex-col justify-between rounded-md bg-[#000000] p-6 text-slate-200">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                           <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                           <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <g id="File / File_Add">
                                 <path
                                    id="Vector"
                                    d="M12 18V15M12 15V12M12 15H9M12 15H15M13 3.00087C12.9045 3 12.7973 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.51921 21 7.079 21 8.19694 21L15.8031 21C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20296 19 9.09561 18.9991 9M13 3.00087C13.2856 3.00347 13.4663 3.01385 13.6388 3.05526C13.8429 3.10425 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59182 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53376 18.9963 8.71451 18.9991 9M13 3.00087V5.8C13 6.9201 13 7.47977 13.218 7.90759C13.4097 8.28392 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.9991M18.9991 9H19.0002"
                                    stroke="#ffffff"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                 ></path>
                              </g>
                           </g>
                        </svg>
                        <div className="space-y-2">
                           <h3 className="font-bold text-slate-100">Free and Unlimited Storage</h3>
                           <p className="text-sm text-slate-100">Create and edit as many UML diagrams as needed.</p>
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
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="h-14 w-14"
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
                     Refer to ProUML's detailed documentation or the project's CapStone poster to learn more about the
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
         </ScrollFadeIn>
         <hr className="border-slate-200" />

         <ScrollFadeIn id="diagramFeature">
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
         </ScrollFadeIn>

         <hr className="border-slate-200" />
         <ScrollFadeIn id="shareFeature">
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
         </ScrollFadeIn>
         <hr className="border-slate-200" />

         <ScrollFadeIn id="importFeature">
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
                     When creating a new diagram, you can import Java source code in a .zip file to automatically generate a
                     UML diagram in ProUML.
                  </p>
               </div>
            </section>
         </ScrollFadeIn>
         <hr className="border-slate-200" />

         <ScrollFadeIn id="issueFeature">
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
                     Create issues in diagrams by clicking on diagram objects, then click on the issue bug button in the top
                     bar to show a popup menu to describe the issue.
                  </p>
               </div>
            </section>
         </ScrollFadeIn>
         <hr className="border-slate-200" />

         <ScrollFadeIn id="projectFeature">
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
         </ScrollFadeIn>
         <hr className="border-slate-200" />

         <ScrollFadeIn id="openSource">
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24 text-center">
               <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                     Proudly Open Source
                  </h2>
                  <p className="leading-normal text-slate-700 sm:text-lg sm:leading-7">
                     ProUML is open source and is powered by open source software. The code is available on{" "}
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
                        Everything is also documented here
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
         </ScrollFadeIn>
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

const ScrollFadeIn = ({ children, id }) => {
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
