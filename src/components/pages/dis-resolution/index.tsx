import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const  DisResolutionRoute = () => {
  return (
    <>
      <BreadCrumb title="Dispute Resolution" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal flex items-center justify-center ">
          COMPLAINTS AND NOTICES
        </h1>
      </div>
    </>
  )
}

export default DisResolutionRoute