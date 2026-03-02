import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

// 1. DATA ARRAY: Dynamic data for Self Exclusion
const exclusionData = [
  // Pehli main heading (Center)
  { isHeading: true, isCenter: true, text: "SELF-EXCLUSION" },
  {
    text: "If you feel you are at risk of developing a gambling problem or believe you currently have a gambling problem, please consider using Self-Exclusion which prevents you gambling with GJEXCH for a specified period of 3 months, 6 months, 1 year, 2 years, 3 years, 4 years, 5 years or permanently.",
  },
  {
    text: "If you want to stop playing for other reasons, please consider a Time-Out or using Account Closure.",
  },

  // Sub-heading (Left aligned)
  {
    isHeading: true,
    isCenter: false,
    text: "What happens when you self-exclude?",
  },
  {
    text: "During a period of Self-Exclusion you will not be able to use your account for betting, although you will still be able to login and withdraw any remaining balance. It will not be possible to re-open your account for any reason, and GJEXCH will do all it can to detect and close any new accounts you may open.",
  },

  // Sub-heading (Left aligned)
  { isHeading: true, isCenter: false, text: "Next steps" },
  {
    text: "Whilst we will remove you from our marketing databases, we also suggest that you remove GJEXCH from your notifications and delete/uninstall all GJEXCH apps, downloads and social media links. You may also wish to consider installing software that blocks access to gambling websites, click here for more information.",
  },
  {
    text: "We recommend that you seek support from a problem gambling support service to help you deal with your problem.",
  },
  {
    text: "You can self-exclude your account in the My Gambling Controls section of Members by choosing Self-Exclusion.",
  },
  {
    text: "Alternatively you can contact our customer care team for assistance and further information.",
  },

  // Sub-heading (Left aligned)
  { isHeading: true, isCenter: false, text: "Self-Exclusion Notice" },
  {
    text: "Should you opt to self-exclude from GJEXCH, we strongly recommend that you seek exclusion from all other gambling operators you have an account with.",
  },
  {
    text: "You can self-exclude by contacting other gambling operators directly or you can exclude from other licensed operators by completing a Self-Exclusion Notice form.",
  },
  {
    text: "Once completed the Self-Exclusion Notice form should be submitted to the nominated site, sports bookmaker or betting exchange operator.",
  },
];

const ExclusionPage = () => {
  return (
    <div id="exclusion.tsx">
      <div className="">
        <BreadCrumb title="Self Exclusion"/>
        <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px] py-4 mt-4 min-[900px]:mt-6 min-[1200px]:mt-6">
          <div className="MuiBox-root css-0 text-(--primary-text-color)">
            {/* Mapping the array to render paragraphs dynamically */}
            {exclusionData.map((item, index) => (
              <p
                key={index}
                className="mb-4"
                style={{ textAlign: item.isCenter ? "center" : "left" }}
              >
                <span style={{ fontSize: "12pt" }}>
                  <span style={{ fontFamily: '"Segoe UI", sans-serif' }}>
                    {/* Agar Heading hai to Bold aur Underline */}
                    {item.isHeading && (
                      <strong>
                        <u>
                          <span>{item.text}</span>
                        </u>
                      </strong>
                    )}

                    {/* Agar Normal Paragraph hai */}
                    {!item.isHeading && <span>{item.text}</span>}
                  </span>
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusionPage;
