import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

export default function About() {
  return (
    <>
      <div id="about.tsx">
        <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">

          
          <BreadCrumb title="About" />

          <Section id="welcome" title="Welcome to GJEXCH">
            At GJEXCH, we are passionate about providing a safe, exciting, and
            fair online gaming experience. Founded with the vision to
            revolutionize the world of online gaming, we strive to bring
            cutting-edge technology and a user-friendly interface to our global
            community of players.
          </Section>

          <Section id="who-we-are" title="Who We Are">
            GJEXCH is a Curacao-based company with a mission to deliver
            exceptional online gaming experiences. Licensed and regulated by the
            Curacao Gaming Control Board, we are committed to operating with the
            highest standards of transparency, security, and integrity.
          </Section>

          <Section id="our-mission" title="Our Mission">
            Our mission is simple: to create a thrilling and secure gaming
            environment where players can enjoy a wide variety of online games. We
            believe in putting our players first, ensuring that every game is
            fair, every transaction is secure, and every player feels valued.
          </Section>

          <Section id="what-we-offer" title="What We Offer">
            <ul className="list-disc pl-8 text-sm space-y-2">
              <li>
                <b>Diverse Gaming Options:</b> From classic casino games to
                innovative new titles, we offer a broad range of options to suit
                every player’s taste.
              </li>
              <li>
                <b>Fair Play:</b> Our games are independently tested and certified
                to ensure every outcome is random and unbiased.
              </li>
              <li>
                <b>Top-Tier Security:</b> Advanced security measures protect your
                data and financial transactions.
              </li>
              <li>
                <b>Customer Support:</b> 24/7 support to assist you anytime.
              </li>
            </ul>
          </Section>

          <Section id="our-values" title="Our Values">
            <ul className="list-disc pl-8 text-sm space-y-2">
              <li>
                <b>Integrity:</b> We operate with honesty and transparency.
              </li>
              <li>
                <b>Innovation:</b> Exploring new technologies to enhance our
                platform.
              </li>
              <li>
                <b>Community:</b> Building a supportive and inclusive environment.
              </li>
            </ul>
          </Section>

          <Section
            id="our-commitment-to-responsible-gaming"
            title="Our Commitment to Responsible Gaming"
          >
            At GJEXCH, we understand gaming should be entertainment, not stress.
            We promote responsible gaming and provide tools to manage habits.
          </Section>

          <Section id="join-us" title="Join Us">
            Whether you’re a seasoned player or new to online gaming, Ace Gaming
            N.V. welcomes you to join our community and experience thrilling
            gaming.
          </Section>

          <Section id="contact-us" title="Contact Us">
            Have questions? Reach out anytime at{" "}
            <a
              href="mailto:support@gjexch.com"
              className="text-blue-500 underline"
            >
              {/* support@gjexch.com */}
            </a>
          </Section>
        </div>
      </div>
    </>
  );
}

//    Reusable Section Component

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
      <h5 className="text-lg md:text-xl font-bold leading-6 mb-2">
        <a href={`#${id}`} className="text-(--primary-color) underline">
          {title}
        </a>
      </h5>

      {/* 👇 Changed from <p> to <div> */}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
