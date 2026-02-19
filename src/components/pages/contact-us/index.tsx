"use client";

import BreadCrumb from "@/components/common/bread-crumb";
import React from "react";

export default function ContactUs() {
  return (
    <>
      <BreadCrumb title="Contact Us" showTitle={false} />

      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

        <h1 className="text-2xl md:text-[24px] font-bold leading-normal">
          Contact Us
        </h1>

        <div className="py-2" />

        <Section id="happy-to-help" title="We’re here to help!">
          <p>
            At 100Exch, we value our customers and are committed to providing
            excellent support. Whether you have a question, need assistance, or
            simply want to provide feedback, we’re just a message away. You can
            reach us through the following platforms:
          </p>
        </Section>

        <Section id="contact-options" title="Contact Options:">
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-semibold">WhatsApp:</span>{" "}
              Connect with us on WhatsApp for instant support.
            </li>

            <li>
              <span className="font-semibold">Telegram:</span>{" "}
              Prefer using Telegram? Reach out to us there!
            </li>

            <li>
              <span className="font-semibold">Instagram:</span>{" "}
              Follow us on Instagram and send us a direct message.
            </li>

            <li>
              <span className="font-semibold">Facebook:</span>{" "}
              Join our Facebook community and send us a message.
            </li>
          </ul>
        </Section>

        <Section id="customer-support" title="Customer Support">
          <p>
            Our dedicated customer support team is available 24/7 to assist you
            with any inquiries. Whether it’s about your account, a game, or any
            other service-related question, we’re here to ensure you have a
            seamless experience.
          </p>
        </Section>

        <Section id="email-support" title="Email Support:">
          <p>
            If you prefer email, you can reach us at{" "}
            {/* <a
              href="mailto:support@auexch.com"
              className="text-[#9E9EFF] underline"
            >
              support@auexch.com
            </a> */}
          </p>
        </Section>

        <Section id="feedback" title="Feedback">
          <p>
            We continuously strive to improve our services, and your feedback
            plays a crucial role in that process. Please feel free to share your
            thoughts, suggestions, or any concerns you may have.
          </p>
        </Section>

      </div>
    </>
  );
}

  //  Reusable Section Component

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
    <div id={id} className="scroll-mt-[35px] py-4">
      <h2 className="text-lg md:text-xl font-bold mb-2">
        <a href={`#${id}`} className="text-[#9E9EFF] underline">
          {title}
        </a>
      </h2>

      <div className="text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
