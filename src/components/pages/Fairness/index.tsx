import BreadCrumb from '@/components/common/bread-crumb'
import React from 'react'

const fairnessPolicyRoute = () => {
  return (
    <>
      <BreadCrumb title="Fairness & RNG Testing Methods" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal flex items-center justify-center uppercase">
         Fairness & RNG Testing Methods
        </h1>
      </div>
    </>
  )
}

export default fairnessPolicyRoute