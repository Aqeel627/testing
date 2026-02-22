import dynamic from "next/dynamic";
const ContactUs = dynamic(() => import("@/components/pages/contact-us"));

const ContactRoute = () => {
  return (
    <>
      <ContactUs />
    </>
  );
};

export default ContactRoute;
