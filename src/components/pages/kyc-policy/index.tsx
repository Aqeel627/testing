import BreadCrumb from '@/components/common/bread-crumb'
import React from 'react'

const KPolicy = () => {
  return (
    <>
      <BreadCrumb title="KYC Policy" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[16px] font-bold leading-normal flex items-center justify-center ">
          KNOW YOUR CUSTOMER POLICY
        </h1>
      </div>
    </>
  )
}

export default KPolicy