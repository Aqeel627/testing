import BreadCrumb from '@/components/common/bread-crumb'

const PrivatPolicyPage = () => {
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    return (
        <>
            <BreadCrumb title="Privacy Policy" showTitle={false} />
            <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

                <h1 className="text-2xl md:text-[16px] font-bold leading-normal underline uppercase flex items-center justify-center">
                    PRIVACY AND MANAGEMENT OF PERSONAL DATA
                </h1>
            </div>
        </>
    )
}

export default PrivatPolicyPage