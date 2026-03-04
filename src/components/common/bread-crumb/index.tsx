import Link from "next/link";
import React from "react";

const BreadCrumb = ({
  title,
  showTitle = true,
  parentClass = "",
}: {
  title: string;
  showTitle?: boolean;
  parentClass?: string;
}) => {

  return (
    <div id="breadCrumb.tsx">
    <div className={`mb-2 min-[900]:mb-2 flex flex-col gap-4 my-4 ${parentClass}`}>

      <div className="flex flex-wrap gap-4 items-start justify-end">
        <div className="flex flex-col gap-4 flex-1 basis-auto">
          {showTitle && (
            // <h6 className="text-xl font-bold min-[900]:text-2xl leading-normal">
            //   {title}
            // </h6>
                    <div className="relative flex items-center justify-center w-full mt-4 mb-3">
          {/* Left Glowing Line & Dots */}
          {/* flex-1 lagaya hai taake line auto-stretch ho */}
          <div className="flex relative items-center justify-end gap-2 w-full z-0 ">
            <div className="neon-underline -top-1 -right-1 max-sm:right-3 max-md:right-1">
              {/* <span className="neon-glow glow-main"></span> */}
              <span className="neon-line line-main"></span>

              <span className="neon-glow glow-right"></span>
              <span className="neon-line line-right"></span>
            </div>
            {/* <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#078dee] shadow-[0_0_8px_#078dee]"></div> */}
            <div
              className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] 
                bg-[#ffbbbb] 
                dark:shadow-[0_0_6px_#ff3b3b,0_0_3px_#ff7f7f] 
                "
            ></div>

            <div className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] rounded-full bg-[#078dee] shadow-[0_0_8px_#078dee]"></div>
          </div>

          {/* Heading Text */}
          {/* tracking-[0.2em] se words ke darmiyan exact waisi spacing aayegi */}
          <h2 className="mx-2 min-[500px]:mx-4 text-black dark:text-white text-[14px] min-[500px]:text-[17px] font-medium !font-extrabold tracking-[0.2em] uppercase whitespace-nowrap">
            {title}
          </h2>

          {/* Right Glowing Line & Dots */}
          <div className="relative flex items-center justify-start gap-2 w-full z-0">
            <div className="w-1 h-1 min-[500px]:w-[5px] min-[500px]:h-[5px] rounded-full bg-[#078dee] shadow-[0_0_8px_#078dee]"></div>
            <div className="w-1.25 h-1.25 bg-[#ffbbbb] dark:shadow-[0_0_6px_#ff3b3b,0_0_3px_#ff7f7f]"></div>
            <div className="neon-underline -top-1 -left-1 max-md:left-1 max-sm:left-3 z-0">
              {/* <span className="neon-glow glow-main"></span> */}
              <span className="neon-line line-main"></span>

              <span className="neon-glow glow-left"></span>
              <span className="neon-line line-left"></span>
            </div>
            {/* <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#078dee] shadow-[0_0_8px_#078dee]"></div> */}
          </div>
        </div>
          )}
          {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-normal">
            <Link href={"/"} className="leading-[1.57143] hover:underline">
              Home
            </Link>
            <span className="w-1 h-1 rounded-full bg-(--palette-text-disabled)"></span>
            <p className="text-(--palette-text-disabled) leading-[1.57143]">
              {title} 
            </p>
          </div> */}
        </div>
      </div>
    </div>
    </div>
  );
};

export default BreadCrumb;
