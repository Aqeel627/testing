import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

export default function ContactUs() {
  return (
    <>
    <div id="contactUs.tsx">
      <BreadCrumb title="Contact Us" showTitle={false} />

      <div className="container mx-auto px-4 mt-9 flex flex-col gap-8">

        {/* Section: Happy to Help */}
        <div id="happy-to-help">
          <h2 className="text-base font-[18px] font-extrabold mb-2 text-[#9E9EFF] underline">
            <a href="#happy-to-help" className="cursor-pointer">We’re here to help!</a>
          </h2>
          <p className="text-base">
            At GJEXCH, we value our customers and are committed to providing excellent support.
            Whether you have a question, need assistance, or simply want to provide feedback, we’re just a message away.
            You can reach us through the following platforms:
          </p>
        </div>

        {/* Section: Contact Options */}
        <div id="contact-options">
          <h2 className="text-base font-[18px] font-extrabold mb-2 text-[#9E9EFF] underline">
            <a href="#contact-options" className="cursor-pointer">Contact Options:</a>
          </h2>
          <ul className="space-y-4 pl-4 list-disc">
            <li>
              <p className="font-medium">WhatsApp:</p>
              <p>Connect with us on WhatsApp for instant support.</p>
            </li>
            <li>
              <p className="font-medium">Telegram:</p>
              <p>Prefer using Telegram? Reach out to us there!</p>
            </li>
            <li>
              <p className="font-medium">Instagram:</p>
              <p>Follow us on Instagram and send us a direct message.</p>
            </li>
            <li>
              <p className="font-medium">Facebook:</p>
              <p>Join our Facebook community and send us a message.</p>
            </li>
          </ul>
        </div>

        {/* Section: Customer Support */}
        <div id="customer-support">
          <h2 className="text-base font-normal mb-2">
            <a href="#customer-support" className="text-[#9E9EFF] underline cursor-pointer">Customer Support</a>
          </h2>
          <p className="text-base">
            Our dedicated customer support team is available 24/7 to assist you with any inquiries.
            Whether it’s about your account, a game, or any other service-related question, we’re here to ensure you have a seamless experience.
          </p>
        </div>

        {/* Section: Email Support */}
        <div id="email-support">
          <h2 className="text-base font-normal mb-2">
            <a href="#email-support" className="text-[#9E9EFF] underline cursor-pointer">Email Support:</a>
          </h2>
          <p className="text-base">
            If you prefer email, you can reach us at&nbsp;
            <a href="mailto:support@GJEXCH.com" className="text-[#9E9EFF] underline cursor-pointer"></a>.
          </p>
        </div>

        {/* Section: Feedback */}
        <div id="feedback">
          <h2 className="text-base font-normal mb-2">
            <a href="#feedback" className="text-[#9E9EFF] underline cursor-pointer">Feedback</a>
          </h2>
          <p className="text-base">
            We continuously strive to improve our services, and your feedback plays a crucial role in that process.
            Please feel free to share your thoughts, suggestions, or any concerns you may have.
          </p>
        </div>

      </div>
      </div>
    </>
  );
}