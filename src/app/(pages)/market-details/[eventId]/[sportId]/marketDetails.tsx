"use client"
import Icon from '@/icons/icons'
import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function MarketDetails() {

    const navTabs = ["ALL", "BOOKMAKER", "ODDS"];

    const [activeTab, setActiveTab] = useState("ALL");
    const tabsListRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    const updateIndicator = useCallback(() => {
        if (!tabsListRef.current || !activeTab) return;

        const activeBtn = tabsListRef.current.querySelector(`button[data-tab="${activeTab}"]`) as HTMLElement;

        if (activeBtn) {
            setIndicatorStyle({
                left: activeBtn.offsetLeft,
                width: activeBtn.offsetWidth,
                opacity: 1,
            });
        }
    }, [activeTab]);

    useEffect(() => {
        const timeout = setTimeout(() => updateIndicator(), 100);
        window.addEventListener("resize", updateIndicator);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", updateIndicator);
        };
    }, [updateIndicator]);
    return (
        <div className='w-full mx-auto box-border flex flex-auto flex-col pt-2 pb-2'>

            <div className="mb-2 min-[900px]:mb-[16px]">
                <div className='flex flex-wrap items-center gap-1.5 min-[900px]:gap-2.5 max-w-full overflow-hidden'>
                    <div className="grow">
                        <div className=" flex flex-wrap gap-2 min-[900px]:gap-4">
                            <span className='h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] px-1.5 gap-2.5'>
                                <a href="" className="inline-flex">
                                    Home
                                </a>
                            </span>
                            <span className='h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5'>
                                <span className='text-[#68CDF9]'>
                                    <Icon name="play" className='w-5 h-5' />
                                </span>
                                <a href="" className="inline-flex">
                                    Cricket
                                </a>
                            </span>
                            <span className='h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5'>
                                <span className='text-[#68CDF9]'>
                                    <Icon name="play" className='w-5 h-5' />
                                </span>
                                <a href="" className="inline-flex">
                                    ICC Men's T20 World Cup
                                </a>
                            </span>
                            <span className='h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5'>
                                <span className='text-[#68CDF9]'>
                                    <Icon name="play" className='w-5 h-5' />
                                </span>
                                <a href="" className="inline-flex">
                                    ICC Men's T20 World Cup
                                </a>
                            </span>

                        </div>
                    </div>
                </div>
            </div>


            <div className="text-white bg-[#919eab0a] w-full border-[1px] border-dashed border-[#919eab29] rounded-[8px] overflow-hidden">
                <div className="flex justify-start items-center relative no-underline w-full box-border text-left py-2 px-4 flex-wrap rounded-2">
                    <div className='flex-auto min-w-0 m-0'>
                        <h5 className='text-[1rem] font-bold leading-[1.5] mb-[-2px]'>
                            ICC Men's T20 World Cup
                        </h5>

                        <span className='text-[0.875rem] leading-[1.57143]'>
                            <div className='flex gap-2 items-center'>
                                <time className='text-[0.785rem] font-semibold leading-[1.57143] text-[#919EAB]'>
                                    07-02-2026 10:30
                                </time>
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-1 min-[900px]:mt-2 flex bg-[#28323D] rounded-[8px] min-h-[48px] overflow-hidden w-full max-w-full">
                <div className="relative flex items-center flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    <div ref={tabsListRef} className="flex p-2 !pb-[6px] relative z-[1] w-full items-center relative">
                        <div
                            className="absolute bg-[#141A21] rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 h-[32px]"
                            style={{
                                left: `${indicatorStyle.left}px`,
                                top: '24px',
                                transform: 'translateY(-50%)',
                                width: `${indicatorStyle.width}px`,
                                opacity: indicatorStyle.opacity,
                            }}
                        />

                        {navTabs.map((tab, idx) => (
                            <button
                                key={idx}
                                data-tab={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] font-semibold px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 ${activeTab === tab ? "text-[#68CDF9]" : "text-[#919EAB]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='mt-1 px-1 min-[900px]:mt-2 min-[900px]:px-2 text-[#68CDF9] flex flex-row flex-nowrap justify-between items-center h-8 w-full cursor-pointer text-xs font-bold  bg-[#078dee29] rounded-[6px] whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]'>
                <div className="grow">
                    <span className='font-semibold text-[0.875rem] leading-[1.57143]'>Bookmaker</span>
                </div>
                <button className="inline-flex items-center justify-center relative box-border bg-transparent cursor-pointer select-none align-middle appearance-none font-sans text-center text-inherit text-lg outline-none border-0 m-0 no-underline flex-none rounded-full transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] p-[5px]">
                    <Icon name="arrowDown" className='w-5 h-5' />
                </button>
            </div>


            <div className="h-auto transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-visible">
                <div className='flex w-full'>
                    <div className='w-full flex flex-wrap gap-x-2 gap-y-2 mt-0.5 min-[900px]:mt-1'>
                        <div className='border-[1px] border-dashed border-[#919eab29] rounded-[4px]'>

                            <div className='px-1 min-[900px]:px-2 text-[#68CDF9] bg-[#078dee29] flex flex-col h-[32px] max-h-[32px] w-full cursor-pointer font-bold text-[0.75rem]'>
                                <div className='min-h-8 max-h-8 relative flex flex-row flex-nowrap flex-1 items-center gap-1 min-[900px]:gap-2'>
                                    <div className='flex flex-wrap items-center min-w-0 flex-[1_1_6rem]'>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    )
}
