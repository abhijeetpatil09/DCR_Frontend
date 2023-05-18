import React from 'react';
import GroupMLogo from '../../Assets/logo-download-01.png';
import HTWLogo from '../../Assets/hoonartek-logo.png';
const LandingPage = () => {

    return (
        <div>
            <header className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="relative z-50 flex justify-between">
                        <div className="flex items-center md:gap-x-12">
                            <a className='flex flex-row items-center' aria-label="Home" href="/#">
                                <img src={HTWLogo} alt='Image_Description' className=" flex flex-grow h-10 pl-0 pr-4   border-r-2 border-coal" />
                                <img src={GroupMLogo} alt='Image_Description' className=" flex flex-grow h-10 pl-0 pr-4" />
                            </a>
                            <div className="hidden md:flex md:gap-x-6">
                                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/#features">Features</a>
                                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/#pricing">Platform</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-5 md:gap-x-8">
                            <div className="hidden md:block">
                                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/login">Sign in</a>
                            </div>
                            <a className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100" href="/register">
                                <span>Get started <span className="hidden lg:inline">today</span></span>
                            </a>
                            {/* Mobile View */}
                            <div className="-mr-1 md:hidden">
                                <div data-headlessui-state="">
                                    <button className="[&amp;:not(:focus-visible)]:focus:outline-none relative z-10 flex h-8 w-8 items-center justify-center" aria-label="Toggle Navigation" type="button" aria-expanded="false" data-headlessui-state="" id="headlessui-popover-button-:R3p6:">
                                        <svg aria-hidden="true" className="h-3.5 w-3.5 overflow-visible stroke-slate-700" fill="none" stroke-width="2" stroke-linecap="round">
                                            <path d="M0 1H14M0 7H14M0 13H14" className="origin-center transition"></path>
                                            <path d="M2 2L12 12M12 2L2 12" className="origin-center scale-90 opacity-0 transition"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
                    <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
                        Secure data collaborative intelligence using 
                        <span className="relative whitespace-nowrap text-blue-600">
                            <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none">
                                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                            </svg>
                            <span className="relative">clean room.</span>
                        </span>
                       
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">Welcome to our innovative solution for secure data collaboration. With our state-of-the-art Cleanrooms, you can protect sensitive information while fostering efficient collaboration across teams, partners, and clients.</p>
                    <div className="mt-10 flex justify-center gap-x-6">
                        <a className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300" href="/register">
                            Get started today
                        </a>
                        <a className="group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300 focus:outline-none focus-visible:outline-blue-600 focus-visible:ring-slate-300 active:bg-slate-100 active:text-slate-600" href="#">
                            <svg aria-hidden="true" className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current">
                                <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z"></path>
                            </svg>
                            <span className="ml-3">Watch video</span>
                        </a>
                    </div>
                    <div className="mt-36 lg:mt-44">
                        <p className="font-display text-base text-slate-900">Trusted by these six companies so far</p>
                        <ul role="list" className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0">
                            <li>
                                <ul role="list" className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
                                    <li className="flex"><img alt="Transistor" loading="lazy" width="158" height="48" decoding="async" data-nimg="1"  src="https://salient.tailwindui.com/_next/static/media/transistor.7274e6c3.svg" /></li>
                        <li className="flex"><img alt="Tuple" loading="lazy" width="105" height="48" decoding="async" data-nimg="1"  src="https://salient.tailwindui.com/_next/static/media/tuple.74eb0ae0.svg" /></li>
                        <li className="flex"><img alt="StaticKit" loading="lazy" width="127" height="48" decoding="async" data-nimg="1"  src="https://salient.tailwindui.com/_next/static/media/statickit.d7937794.svg" /></li>
                                </ul>
                            </li>
                            <li>
                                <ul role="list" className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
                                    <li className="flex"><img alt="Mirage" loading="lazy" width="138" height="48" decoding="async" data-nimg="1"  src="https://salient.tailwindui.com/_next/static/media/mirage.18d2ec4e.svg" /></li>
                        <li className="flex"><img alt="Laravel" loading="lazy" width="136" height="48" decoding="async" data-nimg="1"   src="https://salient.tailwindui.com/_next/static/media/laravel.7deed17e.svg" /></li>
                        <li className="flex"><img alt="Statamic" loading="lazy" width="147" height="48" decoding="async" data-nimg="1"   src="https://salient.tailwindui.com/_next/static/media/statamic.6da5ebfb.svg" /></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <section id="features" aria-label="Features for running your books" className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32">
                    <img alt="" loading="lazy" width="2245" height="1636" decoding="async" data-nimg="1" className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"   src="/_next/static/media/background-features.5f7a9ac9.jpg" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
                            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">Collaborative Intelligence</h2>
                            <p className="mt-6 text-lg tracking-tight text-blue-100">Seamlessly collaborate, share, and derive insights from vour data, revolutionizing the way you work with data.</p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
                            <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                                <div className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal" role="tablist" aria-orientation="vertical">
                                    <div className="group relative rounded-full bg-white px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:bg-white/10 lg:p-6 lg:ring-1 lg:ring-inset lg:ring-white/10">
                                        <h3>
                                            <button className="font-display [&amp;:not(:focus-visible)]:focus:outline-none text-lg text-blue-600 lg:text-white" id="headlessui-tabs-tab-:R2ba9m:" role="tab" type="button" aria-selected="true" tabIndex="0" data-headlessui-state="selected" aria-controls="headlessui-tabs-panel-:Rda9m:"><span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>Low Code and No code UI </button>
                                        </h3>
                                        <p className="mt-2 hidden text-sm text-white lg:block">Low Code and No Code UI for Tailored User Experiences eliminating the need of knowing technical details to use data clean room. </p>
                                    </div>
                                    <div className="group relative rounded-full px-4 py-1 hover:bg-white/10 lg:rounded-l-xl lg:rounded-r-none lg:p-6 lg:hover:bg-white/5">
                                        <h3>
                                            <button className="font-display [&amp;:not(:focus-visible)]:focus:outline-none text-lg text-blue-100 hover:text-white lg:text-white" id="headlessui-tabs-tab-:R2ja9m:" role="tab" type="button" aria-selected="false" tabIndex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-:Rla9m:"><span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>Smooth Onboarding</button>
                                        </h3>
                                        <p className="mt-2 hidden text-sm text-blue-100 group-hover:text-white lg:block">Get started quickly and invite partners to securely collaborate without much effort. </p>
                                    </div>
                                    <div className="group relative rounded-full px-4 py-1 hover:bg-white/10 lg:rounded-l-xl lg:rounded-r-none lg:p-6 lg:hover:bg-white/5">
                                        <h3>
                                            <button className="font-display [&amp;:not(:focus-visible)]:focus:outline-none text-lg text-blue-100 hover:text-white lg:text-white" id="headlessui-tabs-tab-:R2ra9m:" role="tab" type="button" aria-selected="false" tabIndex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-:Rta9m:"><span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>Governance</button>
                                        </h3>
                                        <p className="mt-2 hidden text-sm text-blue-100 group-hover:text-white lg:block">Meet regulatory requirements and maintain compliance with industry standards. Cleanrooms enable you to track and monitor data interactions, providing an audit trail for governance and compliance purposes. </p>
                                    </div>
                                    <div className="group relative rounded-full px-4 py-1 hover:bg-white/10 lg:rounded-l-xl lg:rounded-r-none lg:p-6 lg:hover:bg-white/5">
                                        <h3>
                                            <button className="font-display [&amp;:not(:focus-visible)]:focus:outline-none text-lg text-blue-100 hover:text-white lg:text-white" id="headlessui-tabs-tab-:R33a9m:" role="tab" type="button" aria-selected="false" tabIndex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-:R15a9m:"><span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>Secure Collaboration Workspace</button>
                                        </h3>
                                        <p className="mt-2 hidden text-sm text-blue-100 group-hover:text-white lg:block">DataHeaven serves as a dedicated workspace for collaborative data analysis and exploration. Users can collaborate within a controlled and secure environment. </p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-7">
                                <div id="headlessui-tabs-panel-:Rda9m:" role="tabpanel" tabIndex="0" data-headlessui-state="selected" aria-labelledby="headlessui-tabs-tab-:R2ba9m:">
                                    <div className="relative sm:px-6 lg:hidden">
                                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl"></div>
                                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">Keep track of everyone's salaries and whether or not they've been paid. Direct deposit not supported.</p>
                                    </div>
                                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"><img alt="" fetchpriority="high" width="2174" height="1464" decoding="async" data-nimg="1" className="w-full"   sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayroll.517af4e7.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                                <div id="headlessui-tabs-panel-:Rla9m:" role="tabpanel" tabIndex="-1" hidden="" style={{display:'none'}}  data-headlessui-state="" aria-labelledby="headlessui-tabs-tab-:R2ja9m:">
                                    <div className="relative sm:px-6 lg:hidden">
                                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl"></div>
                                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">All of your receipts organized into one place, as long as you don't mind typing in the data by hand.</p>
                                    </div>
                                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"><img alt="" fetchpriority="high" width="2174" height="1464" decoding="async" data-nimg="1" className="w-full"   sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpenses.3f331919.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                                <div id="headlessui-tabs-panel-:Rta9m:" role="tabpanel" tabIndex="-1" hidden="" style={{display:'none'}}  data-headlessui-state="" aria-labelledby="headlessui-tabs-tab-:R2ra9m:">
                                    <div className="relative sm:px-6 lg:hidden">
                                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl"></div>
                                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">We only sell our software to companies who don't deal with VAT at all, so technically we do all the VAT stuff they need.</p>
                                    </div>
                                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"><img alt="" fetchpriority="high" width="2174" height="1464" decoding="async" data-nimg="1" className="w-full"   sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvat-returns.7402820f.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                                <div id="headlessui-tabs-panel-:R15a9m:" role="tabpanel" tabIndex="-1" hidden="" style={{display:'none'}}  data-headlessui-state="" aria-labelledby="headlessui-tabs-tab-:R33a9m:">
                                    <div className="relative sm:px-6 lg:hidden">
                                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl"></div>
                                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">Easily export your data into an Excel spreadsheet where you can do whatever the hell you want with it.</p>
                                    </div>
                                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"><img alt="" fetchpriority="high" width="2174" height="1464" decoding="async" data-nimg="1" className="w-full"   sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freporting.2ad6f065.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="secondary-features" aria-label="Features for simplifying everyday business tasks" className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl md:text-center">
                            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">Simplify everyday business tasks.</h2>
                            <p className="mt-4 text-lg tracking-tight text-slate-700">Because you’d probably be a little confused if we suggested you complicate your everyday business tasks instead.</p>
                        </div>
                        <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
                            <div>
                                <div className="mx-auto max-w-2xl">
                                    <div className="w-9 rounded-lg bg-blue-600">
                                        <svg aria-hidden="true" className="h-9 w-9" fill="none">
                                            <defs>
                                                <linearGradient id=":R2mdm:" x1="11.5" y1="18" x2="36" y2="15.5" gradientUnits="userSpaceOnUse">
                                                    <stop offset=".194" stopColor="#fff"></stop>
                                                    <stop offset="1" stopColor="#6692F1"></stop>
                                                </linearGradient>
                                            </defs>
                                            <path d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5" stroke="url(#:R2mdm:)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-sm font-medium text-blue-600">Match Rate</h3>
                                    <p className="font-display mt-2 text-xl text-slate-900">DataHeaven presents a powerful use case for Match Rate, showcasing the capabilities of Snowflake Data Clean Room. With Match Rate, you can efficiently match and merge data from Provider’s date while maintaining a secure and controlled environment.  </p>
                                    <p className="mt-4 text-sm text-slate-600">Match Rate, coupled with Snowflake Data Clean Room, empowers organizations to achieve accurate and reliable data matching. With our solution, you can streamline data consolidation, enhance data quality, and drive valuable insights without compromising data security. </p>
                                </div>
                                <div className="relative mt-10 pb-10">
                                    <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6"></div>
                                    <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"><img alt="" loading="lazy" width="1688" height="856" decoding="async" data-nimg="1" className="w-full" style={{color:'transparent'}} sizes="52.75rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=16&amp;q=75 16w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=32&amp;q=75 32w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=48&amp;q=75 48w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=64&amp;q=75 64w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=96&amp;q=75 96w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=128&amp;q=75 128w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=256&amp;q=75 256w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=384&amp;q=75 384w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                            </div>
                            <div>
                                <div className="mx-auto max-w-2xl">
                                    <div className="w-9 rounded-lg bg-blue-600">
                                        <svg aria-hidden="true" className="h-9 w-9" fill="none">
                                            <path opacity=".5" d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff"></path>
                                            <path opacity=".3" d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff"></path>
                                            <path d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-sm font-medium text-blue-600">Customer Enrichment</h3>
                                    <p className="font-display mt-2 text-xl text-slate-900">With our solution, you can enrich customer data, gain valuable insights, and deliver personalized experiences while ensuring the highest standards of data security and privacy. </p>
                                    <p className="mt-4 text-sm text-slate-600">Secure Data Collaboration, DataHeaven with Snowflake Data Clean Room provides a controlled environment for collaborating with internal and external stakeholders, allowing you to securely access and share customer data for enrichment purposes. </p>
                                </div>
                                <div className="relative mt-10 pb-10">
                                    <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6"></div>
                                    <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"><img alt="" loading="lazy" width="1688" height="856" decoding="async" data-nimg="1" className="w-full" style={{color:'transparent'}} sizes="52.75rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=16&amp;q=75 16w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=32&amp;q=75 32w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=48&amp;q=75 48w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=64&amp;q=75 64w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=96&amp;q=75 96w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=128&amp;q=75 128w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=256&amp;q=75 256w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=384&amp;q=75 384w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                            </div>
                            <div>
                                <div className="mx-auto max-w-2xl">
                                    <div className="w-9 rounded-lg bg-blue-600">
                                        <svg aria-hidden="true" className="h-9 w-9" fill="none">
                                            <path opacity=".5" d="M25.778 25.778c.39.39 1.027.393 1.384-.028A11.952 11.952 0 0 0 30 18c0-6.627-5.373-12-12-12S6 11.373 6 18c0 2.954 1.067 5.659 2.838 7.75.357.421.993.419 1.384.028.39-.39.386-1.02.036-1.448A9.959 9.959 0 0 1 8 18c0-5.523 4.477-10 10-10s10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33c-.35.427-.354 1.058.036 1.448Z" fill="#fff"></path>
                                            <path d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605ZM21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z" fill="#fff"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-sm font-medium text-blue-600">Contacts</h3>
                                    <p className="font-display mt-2 text-xl text-slate-900">Organize all of your contacts, service providers, and invoices in one place.</p>
                                    <p className="mt-4 text-sm text-slate-600">This also isn’t actually a feature, it’s just some friendly advice. We definitely recommend that you do this, you’ll feel really organized and professional.</p>
                                </div>
                                <div className="relative mt-10 pb-10">
                                    <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6"></div>
                                    <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"><img alt="" loading="lazy" width="1688" height="856" decoding="async" data-nimg="1" className="w-full" style={{color:'transparent'}} sizes="52.75rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=16&amp;q=75 16w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=32&amp;q=75 32w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=48&amp;q=75 48w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=64&amp;q=75 64w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=96&amp;q=75 96w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=128&amp;q=75 128w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=256&amp;q=75 256w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=384&amp;q=75 384w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=3840&amp;q=75" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:mt-20 lg:block">
                            <div className="grid grid-cols-3 gap-x-8" role="tablist" aria-orientation="horizontal">
                                <div className="relative">
                                    <div className="w-9 rounded-lg bg-blue-600">
                                        <svg aria-hidden="true" className="h-9 w-9" fill="none">
                                            <defs>
                                                <linearGradient id=":Rardm:" x1="11.5" y1="18" x2="36" y2="15.5" gradientUnits="userSpaceOnUse">
                                                    <stop offset=".194" stopColor="#fff"></stop>
                                                    <stop offset="1" stopColor="#6692F1"></stop>
                                                </linearGradient>
                                            </defs>
                                            <path d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5" stroke="url(#:Rardm:)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-sm font-medium text-blue-600">
                                        <button className="[&amp;:not(:focus-visible)]:focus:outline-none" id="headlessui-tabs-tab-:Rirdm:" role="tab" type="button" aria-selected="true" tabIndex="0" data-headlessui-state="selected" aria-controls="headlessui-tabs-panel-:Rbbdm:"><span className="absolute inset-0"></span>Match Rate</button>
                                    </h3>
                                    <p className="font-display mt-2 text-xl text-slate-900">DataHeaven presents a powerful use case for Match Rate.</p>
                                    <p className="mt-4 text-sm text-slate-600">Match Rate, coupled with Snowflake Data Clean Room, empowers organizations to achieve accurate and reliable data matching. With our solution, you can streamline data consolidation, enhance data quality, and drive valuable insights without compromising data security. </p>
                                </div>
                                <div className="relative opacity-75 hover:opacity-100">
                                    <div className="w-9 rounded-lg bg-slate-500">
                                        <svg aria-hidden="true" className="h-9 w-9" fill="none">
                                            <path opacity=".5" d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff"></path>
                                            <path opacity=".3" d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff"></path>
                                            <path d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-sm font-medium text-slate-600">
                                        <button className="[&amp;:not(:focus-visible)]:focus:outline-none" id="headlessui-tabs-tab-:Rkrdm:" role="tab" type="button" aria-selected="false" tabIndex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-:Rjbdm:"><span className="absolute inset-0"></span>Customer Enrichment</button>
                                    </h3>
                                    <p className="font-display mt-2 text-xl text-slate-900">Never lose track of what’s in stock with accurate inventory tracking.</p>
                                    <p className="mt-4 text-sm text-slate-600">We don’t offer this as part of our software but that statement is inarguably true. Accurate inventory tracking would help you for sure.</p>
                                </div>
                                <div className="relative opacity-75 hover:opacity-100">
                                    <div className="w-9 rounded-lg bg-slate-500">
                                        <svg aria-hidden="true" className="h-9 w-9" fill="none">
                                            <path opacity=".5" d="M25.778 25.778c.39.39 1.027.393 1.384-.028A11.952 11.952 0 0 0 30 18c0-6.627-5.373-12-12-12S6 11.373 6 18c0 2.954 1.067 5.659 2.838 7.75.357.421.993.419 1.384.028.39-.39.386-1.02.036-1.448A9.959 9.959 0 0 1 8 18c0-5.523 4.477-10 10-10s10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33c-.35.427-.354 1.058.036 1.448Z" fill="#fff"></path>
                                            <path d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605ZM21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z" fill="#fff"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-sm font-medium text-slate-600">
                                        <button className="[&amp;:not(:focus-visible)]:focus:outline-none" id="headlessui-tabs-tab-:Rmrdm:" role="tab" type="button" aria-selected="false" tabIndex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-:Rrbdm:"><span className="absolute inset-0"></span>Secure Data Collaboration</button>
                                    </h3>
                                    <p className="font-display mt-2 text-xl text-slate-900">Organize all of your contacts, service providers, and invoices in one place.</p>
                                    <p className="mt-4 text-sm text-slate-600">This also isn’t actually a feature, it’s just some friendly advice. We definitely recommend that you do this, you’ll feel really organized and professional.</p>
                                </div>
                            </div>
                            <div className="rounded-4xl relative mt-20 overflow-hidden bg-slate-200 px-14 py-16 xl:px-16">
                                <div className="-mx-5 flex">
                                    <div className="[&amp;:not(:focus-visible)]:focus:outline-none px-5 transition duration-500 ease-in-out" style={{transform:'translateX(-0%)'}} aria-hidden="false" id="headlessui-tabs-panel-:Rbbdm:" role="tabpanel" tabIndex="0" data-headlessui-state="selected" aria-labelledby="headlessui-tabs-tab-:Rirdm:">
                                        <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"><img alt="" loading="lazy" width="1688" height="856" decoding="async" data-nimg="1" className="w-full" style={{color:'transparent'}} sizes="52.75rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=16&amp;q=75 16w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=32&amp;q=75 32w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=48&amp;q=75 48w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=64&amp;q=75 64w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=96&amp;q=75 96w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=128&amp;q=75 128w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=256&amp;q=75 256w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=384&amp;q=75 384w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofit-loss.2a2f85d5.png&amp;w=3840&amp;q=75" /></div>
                                    </div>
                                    <div className="[&amp;:not(:focus-visible)]:focus:outline-none px-5 opacity-60 transition duration-500 ease-in-out" style={{transform:'translateX(-0%)'}} aria-hidden="true" id="headlessui-tabs-panel-:Rjbdm:" role="tabpanel" tabIndex="-1" data-headlessui-state="" aria-labelledby="headlessui-tabs-tab-:Rkrdm:">
                                        <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"><img alt="" loading="lazy" width="1688" height="856" decoding="async" data-nimg="1" className="w-full" style={{color:'transparent'}} sizes="52.75rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=16&amp;q=75 16w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=32&amp;q=75 32w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=48&amp;q=75 48w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=64&amp;q=75 64w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=96&amp;q=75 96w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=128&amp;q=75 128w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=256&amp;q=75 256w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=384&amp;q=75 384w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finventory.14ec7758.png&amp;w=3840&amp;q=75" /></div>
                                    </div>
                                    <div className="[&amp;:not(:focus-visible)]:focus:outline-none px-5 opacity-60 transition duration-500 ease-in-out" style={{transform:'translateX(-0%)'}} aria-hidden="true" id="headlessui-tabs-panel-:Rrbdm:" role="tabpanel" tabIndex="-1" data-headlessui-state="" aria-labelledby="headlessui-tabs-tab-:Rmrdm:">
                                        <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"><img alt="" loading="lazy" width="1688" height="856" decoding="async" data-nimg="1" className="w-full" style={{color:'transparent'}} sizes="52.75rem" srcSet="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=16&amp;q=75 16w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=32&amp;q=75 32w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=48&amp;q=75 48w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=64&amp;q=75 64w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=96&amp;q=75 96w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=128&amp;q=75 128w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=256&amp;q=75 256w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=384&amp;q=75 384w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=640&amp;q=75 640w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=750&amp;q=75 750w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=828&amp;q=75 828w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=1080&amp;q=75 1080w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=1200&amp;q=75 1200w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=1920&amp;q=75 1920w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=2048&amp;q=75 2048w, https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=3840&amp;q=75 3840w" src="https://salient.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcontacts.a61dce95.png&amp;w=3840&amp;q=75" /></div>
                                    </div>
                                </div>
                                <div className="rounded-4xl pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-900/10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="get-started-today" className="relative overflow-hidden bg-blue-600 py-32">
                    <img alt="" loading="lazy" width="2347" height="1244" decoding="async" data-nimg="1" className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" style={{color:'transparent'}} src="https://salient.tailwindui.com/_next/static/media/background-call-to-action.6a5a5672.jpg" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-lg text-center">
                            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">Get started today</h2>
                            <p className="mt-4 text-lg tracking-tight text-white">It’s time to take control of your books. Buy our software so you can feel like you’re doing something productive.</p>
                            <a className="group mt-10 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-blue-200 active:text-slate-600" href="/register">Get started today</a>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-16 flex flex-col items-center  ">
                        <img src={HTWLogo} alt='Image_Description' className=" w-30" />  
                        
                        <nav className="mt-10 text-sm" aria-label="quick links">
                            <div className="-my-1 flex justify-center gap-x-6">
                                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/#features">Features</a>
                                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/#testimonials">Platform</a>
                                {/* <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/#pricing">Case study</a> */}
                            </div>
                        </nav>
                    </div>
                    <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
                        <div className="flex gap-x-6">
                            <a className="group" aria-label="TaxPal on Twitter" target="_blank" href="/privacy-policy">
                                Privacy Policy
                            </a>
                            <a className="group" aria-label="TaxPal on GitHub" target="_blank" href="/terms-and-conditions">
                                Terms and Conditions
                            </a>
                        </div>
                        <p className="mt-6 text-sm text-slate-500 sm:mt-0">
                            Copyright ©
                            2023 
                            Hoonar Tekwurks Private Ltd.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
};

export default LandingPage;