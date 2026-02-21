import BreadCrumb from '@/components/common/bread-crumb'
import React from 'react'

const AmlPolicyRoute = () => {
  return (
    <>
      <BreadCrumb title="AML" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[16px] font-bold leading-normal flex items-center justify-center ">
          ANTI-MONEY LAUNDERING
        </h1>
      </div>
    </>
  )
}

export default AmlPolicyRoute