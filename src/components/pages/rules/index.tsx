import BreadCrumb from '@/components/common/bread-crumb'
import React from 'react'

const RulesPage = () => {
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    return (
        <>
            <BreadCrumb title="Sport Betting Rules"/>
        </>
    )
}

export default RulesPage