import BreadCrumb from '@/components/common/bread-crumb'

const ExclusionPage = () => {
  return (
    <>
      <BreadCrumb title="Self Exclusion" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[16px] font-bold leading-normal flex items-center justify-center uppercase underline">
         SELF-EXCLUSION
        </h1>
      </div>
    </>
  )
}

export default ExclusionPage