import BreadCrumb from '@/components/common/bread-crumb'
import DateFilter from '@/components/common/date-filter';
import React from 'react'

const StatementPage = () => {
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    return (
        <>
            <BreadCrumb title="statement"/>
            <DateFilter/>
        </>
    )
}

export default StatementPage