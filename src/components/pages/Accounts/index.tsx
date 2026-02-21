import BreadCrumb from '@/components/common/bread-crumb'
import React from 'react'

const AccountPage = () => {
  return (
    <>
      <BreadCrumb title="Accounts" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal flex items-center justify-center uppercase">
          Accounts
        </h1>
      </div>
    </>
  )
}

export default AccountPage