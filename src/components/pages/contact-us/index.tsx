"use client";

import BreadCrumb from "@/components/common/bread-crumb";
import React from "react";

export default function ContactUs() {
  return (
    <>
      <BreadCrumb title="Contact Us" showTitle={false} />

      <div className="container mx-auto px-4 mt-9">
        <div id="happy-to-help" className="mb-8">
          <h2 className="text-base font-[18px] font-extrabold mb-2 text-[#9E9EFF] underline mb-2"><a >We’re here to help!</a></h2>
          <p className="text-base">
            At&nbsp;  100Exch, we value our customers and are committed to providing excellent support.
            Whether you have a question, need assistance, or simply want to provide feedback, we’re just a message away.
            You can reach us through the following platforms:
          </p>
        </div>

        <div id="contact-options" className="mb-8">
          <h2 className="text-base font-[18px] font-extrabold mb-2 text-[#9E9EFF] underline"><a  >Contact Options:</a></h2>
          <ul className="   space-y-4">
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

        <div id="customer-support" className="mb-8">
          <h2 className="text-base font-normal mb-2"><a className="text-[#9E9EFF] underline"  >Customer Support</a></h2>
          <p className="text-base">
            Our dedicated customer support team is available 24/7 to assist you with any inquiries.
            Whether it’s about your account, a game, or any other service-related question, we’re here to ensure you have a seamless experience.
          </p>
        </div>

        <div id="email-support" className="mb-8">
          <h2 className="text-base font-normal mb-2"><a className="text-[#9E9EFF] underline"  >Email Support:</a></h2>
          <p className="text-base">
            If you prefer email, you can reach us at&nbsp;<a className="text-[#9E9EFF] underline"></a>.
          </p>
        </div>

        <div id="feedback" className="mb-8">
          <h2 className="text-base font-normal mb-2"><a className="text-[#9E9EFF] underline"  >Feedback</a></h2>
          <p className="text-base">
            We continuously strive to improve our services, and your feedback plays a crucial role in that process.
            Please feel free to share your thoughts, suggestions, or any concerns you may have.
          </p>
        </div>
      </div>


    </>
  );
}

