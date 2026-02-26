import Link from "next/link";
import React from "react";

const BreadCrumb = ({
  title,
  showTitle = true,
}: {
  title: string;
  showTitle?: boolean;
}) => {

  return (
    <div className="mb-2 min-[900]:mb-2 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-start justify-end">
        <div className="flex flex-col gap-4 flex-1 basis-auto">
          {showTitle && (
            <h6 className="text-xl font-bold min-[900]:text-2xl leading-normal">
              {title}
            </h6>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-normal">
            <Link href={"/"} className="leading-[1.57143] hover:underline">
              Home
            </Link>
            <span className="w-1 h-1 rounded-full bg-(--palette-text-disabled)"></span>
            <p className="text-(--palette-text-disabled) leading-[1.57143]">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
