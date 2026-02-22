import dynamic from "next/dynamic";
import Link from "next/link";
const Icon = dynamic(() => import("@/icons/icons"));

export default function NotFoundComponent() {
  return (
    <div className="w-full mx-auto flex flex-auto text-center flex-col p-[24px] min-[900px]:py-[80px] max-w-[448px]">
      <div className="w-full mx-auto box-border px-[16px] min-[600px]:px-6 min-[1200px]:max-w-[1200px]">
        <div className="pt-8 min-[900px]:pt-0 min-[1200px]:pt-5">
          <h3 className="mt-0 mx-0 mb-[1rem] font-bold text-2xl min-[600px]:text-[26px] min-[900px]:text-[30px] min-[1200px]:text-[32px] leading-[1.5]">
            Sorry, page not found!
          </h3>
          <p className="m-0 font-sans font-normal text-base leading-[1.5] text-[#919EAB]">
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </p>
          <div className="flex justify-center">
            <Icon
              name="notFound"
              className="my-10 min-[600px]:my-20 w-[320px]"
            />
          </div>
          <Link
            href="/"
            className="inline-flex mt-[7px] bg-[var(--foreground)] text-[var(--background)] dark:bg-[var(--palette-common-white)] dark:text-[#171717] items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-sans font-bold leading-[1.71429] normal-case min-w-16 text-[0.9375rem] shadow-none h-12 outline-none m-0 no-underline border-0 rounded-lg py-2 px-4 transition-all hover:opacity-90 hover:scale-[1.02]"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}
