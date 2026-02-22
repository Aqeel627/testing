import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));
const DateFilter = dynamic(() => import("@/components/common/date-filter"));

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