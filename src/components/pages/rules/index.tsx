import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const RulesPage = () => {
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    return (
        <>
            <div id="rules.tsx">
                <BreadCrumb title="Sport Betting Rules" />
            </div>
        </>
    )
}

export default RulesPage