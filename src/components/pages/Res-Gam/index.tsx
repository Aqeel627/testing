import BreadCrumb from '@/components/common/bread-crumb'
import React from 'react'

const RasGamRoute = () => {
  const today = new Date();
  const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  return (
    <>
      <BreadCrumb title="Responsible Gambling" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[24px] font-bold leading-normal">
          Gambling with responsibility
        </h1>

        <h6 className="text-[16px] mt-2">
          Last updated: {formattedDate}
        </h6>

        <div className="py-2"></div>

      </div>
    </>
  )
}

export default RasGamRoute