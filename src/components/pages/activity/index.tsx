import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const  ActivityPage = () => {
  return (
    <>
      <BreadCrumb title="Activities"/>
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

      </div>
    </>
  )
}

export default ActivityPage