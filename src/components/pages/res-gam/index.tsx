import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const RasGamRoute = () => {
  const today = new Date();
  const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

  return (
    <>
      <BreadCrumb title="Responsible Gambling" showTitle={false} />

      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px] px-4 md:px-0">

        <h1 className="text-2xl md:text-[24px] font-bold leading-normal">
          Gambling with responsibility
        </h1>

        <h6 className="text-[16px] mt-2 mb-4">
          Last updated: {formattedDate}
        </h6>

        <div className="container mx-auto px-1 text-sm">

          <p className="mb-0">Please read this information carefully for your own benefit.</p>

          <p className="mb-2">
            <a className="underline text-[#9E9EFF] cursor-pointer" data-discover="true"> </a>
            is operated by <b>100Exch</b> Company Registration number <b>92605.</b>
          </p>

          {/* 🔹 Section Component style */}
          <Section id="interpretation" title="Interpretation">
            The words of which the initial letter is capitalized have meanings defined under the following conditions.
            The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </Section>

          <Section id="definitions" title="Definitions">
            For the purposes of these Terms and Conditions:
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Account</b> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><b>Company</b> refers to Our Co (either “the Company”, “We”, “Us” or “Our”).</li>
              <li><b>Service</b> refers to the Website.</li>
              <li><b>Website</b> refers to <a className="underline text-[#9E9EFF] cursor-pointer" data-discover="true"> </a></li>
              <li><b>You</b> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
            </ul>
          </Section>

          <Section id="responsible-gambling-and-self-exclusion" title="Responsible Gambling and Self Exclusion">
            Gambling means for the majority of our Users, entertainment, fun and excitement. But for some Users, gambling has negative side effects.
            In medical science, pathologic gambling is recognized as a serious sickness.
            <br /><br />
            Since our first day, we focus on minimizing problematic gambling through multiple measures to help Users maintain self-control.
            <br /><br />
            Knowledge and education are our main tools to prevent negative side effects.
          </Section>

          <Section id="information-and-contact" title="Information and Contact">
            Our Support will help you via email at all times without additional costs:
            <ul className="list-disc pl-5 space-y-1">
              <li>email: <a className="underline text-[#9E9EFF] cursor-pointer"></a></li>
            </ul>
            Our Support will not give out any information about You without Your consent.
          </Section>

          <Section id="helpful-hints-for-responsible-gambling" title="Helpful Hints for Responsible Gambling">
            We recommend considering the following hints to ensure gambling stays fun and safe:
            <ul className="list-disc pl-5 space-y-1">
              <li>Set a deposit limit based on your financial situation.</li>
              <li>Do not try to win back losses at all costs.</li>
              <li>Set a time limit for playing.</li>
              <li>Play smart: avoid gambling under stress or influence of substances.</li>
              <li>Take breaks when tired or distracted.</li>
              <li>Only one account per person.</li>
            </ul>
          </Section>

          <Section id="minor-protection" title="Minor Protection">
            To use our Service, you must be 18 years or older. Avoid exposing minors to gambling content.
          </Section>

          <Section id="self-exclusion" title="Self-Exclusion">
            If diagnosed with gambling addiction or to prevent gambling, Users can self-exclude from gambling for 6 months to 5 years.
            <ul className="list-disc pl-5 space-y-1">
              <li>Email: <a className="underline text-[#9E9EFF] cursor-pointer"> </a></li>
            </ul>
            Self Exclusion is permanent for the set time span and prevents account creation during that period.
          </Section>

        </div>
      </div>
    </>
  );
};

// 🔹 Reusable Section Component
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-[35px] py-3">
      <h5 className="text-base font-semibold mb-2 text-[19px]">
        <a href={`#${id}`} className="underline text-[#9E9EFF] cursor-pointer">
          {title}
        </a>
      </h5>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export default RasGamRoute;