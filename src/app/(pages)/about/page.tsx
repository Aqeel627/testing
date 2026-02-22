import dynamic from "next/dynamic";
const About = dynamic(() => import("@/components/pages/about"));

const AboutRoute = () => {
  return (
    <>
      <About />
    </>
  );
};

export default AboutRoute;
