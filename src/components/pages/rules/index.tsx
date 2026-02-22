import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

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