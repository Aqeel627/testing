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

        <h6 className="text-[16px] mt-2 mb-4">
          Last updated: {formattedDate}
        </h6>

        <div className="container mx-auto px-1">
          <p className="  text-base mb-0 text-[14px]">Please read this information carefully for your own benefit.</p>
          <p className="  text-base mb-2 text-[14px]">
            <a className="underline text-[#9E9EFF]" data-discover="true"> </a>
            is operated by <b>100Exch</b> Company Registration number <b>92605.</b>
          </p>

          <div id="interpretation" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]" >Interpretation</a>
            </h5>
            <p className="text-base mb-2 text-[14px]">The words of which the initial letter is capitalized have meanings defined under the following conditions.</p>
            <p className="text-base mb-2 text-[14px]">The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          </div>

          <div id="definitions" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]"  >Definitions</a>
            </h5>
            <p className="text-base mb-2 text-[14px]">For the purposes of these Terms and Conditions:</p>
            <ul className="list-disc pl-5    text-sm">
              <li><b>Account</b> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><b>Company</b> (referred to as either “the Company”, “We”, “Us” or “Our” in this Agreement) refers to Our Co</li>
              <li><b>Service</b> refers to the Website.</li>
              <li><b>Website</b> refers to <a className="underline text-[#9E9EFF]" data-discover="true"></a></li>
              <li><b>You</b> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>
          </div>

          <div id="responsible-gambling-and-self-exclusion" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]"  >Responsible Gambling and Self Exclusion</a>
            </h5>
            <p className="text-base mb-2 text-[14px]">
              Gambling means for the majority of our Users, entertainment, fun and excitement. But we also know that for some of our Users gambling has negative side effects.
              In the medical science is pathologic gambling since many years as serious sickness recognised.
            </p><br />
            <p className="text-base mb-2 text-[14px]">
              Since our first day we think about this problematic and try out best to help. Under “Responsible Gambling” We understand multiple steps of measures, with which a gambling provider can help to lower the possibility of negative side effects appearing. -In case they already appear we also try to take active steps against them.
            </p><br />
            <p className="text-base mb-2 text-[14px]">
              The most important instrument against negative side effects from gambling are knowledge and education about the risks of gambling too support our Users self-control in order to make sure they do not suffer from negative side effects.
            </p>
          </div>

          <div id="information-and-contact" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]"  >Information and contact</a>
            </h5>
            <p className="text-base mb-2 text-[14px]">Our Support will help you via email at all time without any additional costs for you:</p>
            <ul className="list-disc pl-5    text-sm">
              <li>email: <a className="underline text-[#9E9EFF]"  ></a></li>
            </ul>
            <p className="text-base mb-2 text-[14px]">Our Support will of course not give out any information about You without Your consent to anyone else</p>
            <p className="text-base mb-2 text-[14px]">In addition you also can take a self-test, if You are already gambling addicted at:

            </p>
            <p className="text-base mb-2 text-[14px]">And you can also find additional information about gambling addictions at:

            </p>
          </div>

          <div id="helpful-hints-for-responsible-gambling" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]"  >Helpful hints for responsible gambling at</a>
              &nbsp;<a className="underline text-[#9E9EFF]" data-discover="true"> </a>
            </h5>
            <p className="text-base mb-2">We recommend you think about the following hints, before gambling in order to insure gambling stays fun for You and without any negative side effects:</p>
            <ul className="list-disc pl-5    text-sm">
              <li>Set yourself a deposit limit  {" "}Before you start to gambling think about how much you can afford to gamble with according to Your financial situation. Play with amounts which are for fun and for Your entertainment</li>
              <li>Do not try to win back a loss at every cost  {" "}Try to not take too huge risks to win back what You lost before at any cost. Play for Entertainment and not to earn money.</li>
              <li>Set yourself a time limit  {" "}Set yourself a time limit and do not break it. Keep in mind gambling should stay in balance with your other hobbies and not be Your only hobby.</li>
              <li>Play smart:  {" "}It is smarter to not play, when You are extremely stressed, depressed or under too much pressure. Also do not play when you are under the influence of Medications, Drugs or Alcohol.</li>
              <li>Take breaks:  {" "}You should take breaks when You notice, that You get tired or can´t concentrate anymore</li>
              <li>Only one account:  {" "}To make it easier to have an overview how much time and money You spend on gambling it is highly advised to not create more than one Account per Person.</li>
            </ul>
          </div>

          <div id="minor-protection" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]"  >Minor Protection</a>
            </h5>
            <p className="text-base mb-2 text-[14px]">To use our Service, You have to be 18 years or older. To avoid abuse, keep Your login data safe from any minors near You.</p>
            <p className="text-base mb-2 text-[14px]">Principally we recommend a filter program to avoid minors, especially children, to access any context on the internet, which is not healthy for them.</p>
            <p className="text-base mb-2 text-[14px]">For parents we can recommend a list of internet filters, to support them, from keeping their children from any context, which was not made for them:  {" "}

            </p>
          </div>

          <div id="self-exclusion" className="mb-6">
            <h5 className="text-base font-semibold mb-2 text-[19px]">
              <a className="underline text-[#9E9EFF]"  >Self-Exclusion:</a>
            </h5>
            <p className="text-base mb-2 text-[14px]">In case You are diagnosed with a gambling addiction or try to stay away from gambling for a different reason, we want to assist you to stay away from anything, that does nothing good for you. “Self-Exclusion” means, that You exclude yourself, out of Your own choice, from all gambling services. This exclusion cannot be undone for a set amount of time. If you wish to self-exclude yourself from gambling, please message our support and give them a time span between 6 months and 5 years. They also will explain you all future steps and what is needed from you.</p>
            <ul className="list-disc pl-5    text-sm">
              <li>email: <a className="underline text-[#9E9EFF]"  > </a></li>
            </ul>
            <p className="text-base mb-2 text-[14px]">Please keep in mind that Self Exclusion is permanent for the set time span and will not be undone for your own protection.</p>
            <p className="text-base mb-2 text-[14px]">During Self Exclusion you are not allowed to create a new Account and every attempt to create a new Account during Self Exclusion is a violation of our Terms of Service and may result in the permanent ban of your original account.</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default RasGamRoute