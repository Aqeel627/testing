"use client";

import dynamic from "next/dynamic";

const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const DisResolutionRoute = () => {
  return (
    <>
      {/* Breadcrumb */}
      <BreadCrumb title="Dispute Resolution" showTitle={false} />

      {/* Main Content */}
      <div className="w-full mt-6  mx-auto flex flex-col flex-grow scroll-mt-[40px] px-4 md:px-6">

        {/* Page Heading */}
        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal text-center mb-6">
          COMPLAINTS AND NOTICES
        </h1>

        {/* Ordered List */}
        <ol className="list-decimal list-inside space-y-4 text-base font-serif [font-family:Aptos,sans-serif] font-normal">

          <li>
            <strong>No claim or dispute with regard to:</strong>
            <ol className="ml-6 mt-2 space-y-2">
              <li>
                <span className="font-semibold">a.</span> The acceptance or settlement of a bet which You have made using the Services will be considered more than thirty days after the date of the original transaction; and
              </li>
              <li>
                <span className="font-semibold">b.</span> A game which You have played using the Services will be considered more than twelve weeks after the date on which the relevant transaction or game play took place.
              </li>
            </ol>
          </li>

          <li>
            Should You wish to make a complaint regarding the Services, as a first step You should, as soon as reasonably practicable, contact Customer Support Services about Your complaint, which will be escalated as necessary within our Customer Support Services team until resolution.
          </li>

          <li>
            If there is a dispute arising from the Terms of Use which cannot be resolved by Customer Services having been escalated in accordance with paragraph <strong>2</strong>, You can request that the matter be addressed by a manager or supervisor. We will endeavour to resolve the matter to your satisfaction either immediately or by contacting You subsequently.
          </li>

          <li>
            You acknowledge that our random number generator will determine the outcome of the games played through the Services and You accept the outcomes of all such games. You further agree that in the unlikely event of a disagreement between the result that appears on Your screen and the game server used by the Operator, the result that appears on the game server will prevail, and You acknowledge and agree that our records will be the final authority in determining the terms and circumstances of Your participation in the relevant online gaming activity and the results of this participation.
          </li>

          <li>
            When we wish to contact You, we may do so using any of Your Contact Details. Notices will be deemed to have been properly served and received by You immediately after an email is sent or after we have communicated with You directly by phone (including where we leave You a voicemail), or three days after the date of posting of any letter. In proving the service of any notice, it will be sufficient to prove, in the case of a letter, that such letter was properly addressed, stamped and placed in the post; in the case of an email, that such email was sent to the specified email address (if any) in Your Contact Details at the time that any such email was sent.
          </li>

          <li>
            The Company reserves the right to deduct administrative and transaction fees and any fees that the Company is obliged to pay to the competent authorities due to a customer’s complaint to our regulators or any other third party competent of publishing such complaints.
          </li>

          <li>
            If The company is unable to settle the dispute to the satisfaction of the Customer, the Customer may refer the complaint, together with all relevant facts, to the relevant authority if the matter remains unsettled.
          </li>
        </ol>

        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal text-center mb-6">
          TRANSFER OF RIGHTS AND OBLIGATIONS </h1>

        <ol className="mb-4 list-decimal space-y-4">
          <li className="text-sm font-sans">
            We reserve the right to transfer, assign, and sublicense or pledge the Terms of Use (an "assignment"), in whole or in part, to any person without notice to You, provided that any such assignment will be on the same terms or terms that are no less advantageous to You.
          </li>
          <li className="text-sm font-sans">
            You may not assign, sublicense or otherwise transfer in any manner whatsoever any of Your rights or obligations under the Terms of Use.
          </li>
        </ol>

        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal text-center mb-6">
          EVENTS OUTSIDE OF OUR CONTROL </h1>

        <ol className="mb-4 list-decimal space-y-4">
          <li className="text-sm font-sans">
            We will not be liable or responsible for any failure to perform, or delay in performance of, any of our obligations under the Terms of Use that is caused by events outside our reasonable control, including (without limitation) any telecommunications network failures, power failures, failures in third party computer (or other) equipment, fire, lightning, explosion, flood, severe weather, industrial disputes or lock-outs, terrorist activity and acts of government or other competent authorities (a "Force Majeure Event").
          </li>
          <li className="text-sm font-sans">
            Our performance is deemed to be suspended for the period that the Force Majeure Event continues, and we will have an extension of time for performance for the duration of that period. We will use our reasonable endeavours to bring the Force Majeure Event to a close or to find a solution by which our obligations may be performed despite the Force Majeure Event.
          </li>
        </ol>

        {/* Page Heading */}
        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal text-center mb-6">
          LEGAL ASPECTS </h1>

        <ol className="mb-4 list-decimal space-y-4">
          <li className="text-sm font-sans">
            The company states explicitly that bet placement and betting organization, as well as participation in sports betting, multiplayer poker, casino games and lottery style games may be restricted by law or even prohibited in some countries. Such restrictions or prohibitions may be imposed even if the company obtained the necessary permission (license for betting or organizing gaming) to place bets and for betting organizations. The User should note that if the placement of bets or participation in sports betting, multiplayer poker and games such as lotteries is prohibited or permitted only under certain conditions, which are not followed, the responsibility for any harm caused by this, rests solely with the User. The client must also take note that the company is not required to provide clients with information, instructions and warnings in a wider range than in the present paragraph. In particular, the company is not liable for damages suffered by the User due to the violation of the relevant legislative prohibitions functioning in his/her country.
          </li>
          <li className="text-sm font-sans">
            By rating or participating in the games, the User confirms that he has reached the lowest age of consent set by the law of his country, and confirms his/her capacity to enter into the agreement with the company. In case of non-fulfilment of these requirements the User’s account will be closed and necessary measures will be applied.
          </li>
          <li className="text-sm font-sans">
            The User agrees that his personal information, provided to the company during the pool betting, games in multiplayer poker, casino games and games such as lotteries, as well as in any other game, is stored and used by automatic means.
          </li>
          <li className="text-sm font-sans">
            By registering, the User confirms the exclusive intellectual property of the company’s regulations, as well as the system controlled by them.
          </li>
          <li className="text-sm font-sans">
            The Company reserves the right to inform Users about special promotions and new products by telephone and e-mail.
          </li>
          <li className="text-sm font-sans">
            Legal relations between the User and the company are a subject to the laws of Curacao and are regulated by it with the exception of the appropriate legal rules of international private law. The place of performance of all obligations for betting and gaming, as well as at the appropriate bets, is Curacao. All disputes arising over or regarding bets made by customers are resolved if it does not contradict the law, by the court in Curacao, which has the relevant territorial and subject matter jurisdiction.
          </li>
          <li className="text-sm font-sans">
            The Company expressly states that it does not provide users with any advice (consultation) on tax matters and/or legal matters.
          </li>
          <li className="text-sm font-sans">
            No disputes about the bets can lead to a lawsuit, legal action or claims on bookmaker licenses if the company complies with the provisions of arbitration.
          </li>
          <li className="text-sm font-sans">
            In case of any claims and disputes from the Users’ side and people representing their parties, the company’s liabilities are limited by the size of bets or its possible winnings.
          </li>
          <li className="text-sm font-sans">
            In case of any disputes or claims the database of the company has priority over any other data.
          </li>
          <li className="text-sm font-sans">
            If there is discrepancy between the English version of these rules and the translation into another language, the English version is considered to be the correct one.
          </li>
          <li className="text-sm font-sans">
            Any matters of dispute including claims about the results of the event are accepted to be reviewed by the bookmaker’s office within 5 days of the end of the sporting event.
          </li>
          <li className="text-sm font-sans">
            The company does not hold Users’ funds in segregated or separately protected bank accounts. It is important for the User to understand that deposits of the company are not held in banks and no interest is accrued upon them.
          </li>
        </ol>
      </div>
    </>
  );
};

export default DisResolutionRoute;