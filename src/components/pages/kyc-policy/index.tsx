import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const KPolicy = () => {
  return (
    <>
      <div id="k-policy.tsx">
        <BreadCrumb title="KYC Policy" showTitle={false} />
        <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">
          <div className="space-y-3 mt-9">
            <p className="text-center mb-3 text-[12pt] font-sans font-bold underline">
              KNOW YOUR CUSTOMER POLICY
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              To maintain the highest level of security, we require all our
              members to provide us with certain documentation in order to
              validate their accounts.
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Please note that the identification procedures shall be done
              before a cardholder starts operating and using services of our
              merchants.
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold">
              Why do I need to provide documentation?
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              There are several reasons:
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              We are committed to providing a socially responsible platform for
              online gaming. All of our members must be 18 or older and we are
              bound by our licensing agreement to verify this.
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Secondly, as a respected online and global company it is in our
              interests to guarantee maximum security on all transactions.
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Thirdly, our payment processors require that our policies are in
              line with international banking standards. A proven business
              relationship with each and every member is mandatory for the
              protection of all parties. Our licensing agreement also obliges us
              to comply with this.
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Finally, by ensuring that your account details are absolutely
              correct, the inconvenience of 'missing payments' can be avoided.
              It can take weeks (and sometimes months) to trace, recall and
              resend using the correct information. This lengthy process also
              results in additional fees from our processors.
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold underline">
              What documents do I need to provide?
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold">Proof of ID:</p>

            <p className="mb-3 text-[12pt] font-sans">
              A colour copy of a valid government issued form of ID (Driver's
              License, Passport, Country ID or Military ID)
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold">
              Proof of Address
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              A copy of a recent utility bill showing your address
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Note: If your government ID shows your address, you do not need to
              provide further proof of address.
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Additional documentation might be required depending on the
              withdrawal method you choose
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold">
              When do I need to provide these documents?
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              We greatly appreciate your cooperation in providing these at your
              earliest possible convenience to avoid any delays in processing
              your transactions. We must be in receipt of the documents before
              any cash transactions can be sent back to you. Under special
              circumstances we may require the documents before further activity
              (deposits and wagering) can take place on your account
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Please understand, if we do not have the required documents on
              file, your pending withdrawals will be cancelled and credited back
              to your account. You will be notified when this happens via the
              notification system.
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold">
              How can I Email you these documents?
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              Please scan your documents, or take a high quality digital camera
              picture, save the images as jpegs, then email us using our
              official email.
            </p>

            <p className="mb-3 text-[12pt] font-sans font-bold">
              How do I know my documents are safe with you?
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              The security of your documentation is of paramount importance. All
              files are protected with the highest level of encryption at every
              step of the review process. All documentation received is treated
              with the utmost respect and confidentiality.
            </p>

            <p className="mb-3 text-[12pt] font-sans">
              We’d like to thank you for your cooperation in helping us make
              BetPro.com a safer place to play. As always, if you have any
              questions about this policy, or anything else, don’t hesitate to
              contact us using the contact us links on this page
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KPolicy;
