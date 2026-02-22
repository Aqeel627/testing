import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const fairnessPolicyRoute = () => {
  return (
    <div className='mt-8 md-mt-7 min-[960px]:mt-0 min-[1200px]:mt-5'>
      <BreadCrumb title="Fairness & RNG Testing Methods" showTitle={false} />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px] py-4 mt-4 md:mt-[-8px] min-[900px]:mt-6 min-[1200px]:mt-6">

        <h1 className="text-2xl md:text-[16px] underline font-bold leading-normal flex items-center justify-center uppercase md:my-4" >
          Fairness & RNG Testing Methods
        </h1>

        {/* 👇 Yahan se exact aapka diya hua structure shuru ho raha hai */}
        <div className="MuiBox-root css-0 text-(--primary-text-color)">

          <p className="mb-4">
            <span>
              <span>
                <span>
                  <span>
                    One of our main concerns as an online gaming operator is to uphold fair gaming.
                    <br />
                    <br />
                    {/* 👇 Data replaced here */}
                    All online products provided by 100Exch are supplied by licensed companies with approved status from Anjouan eGaming Authorities.
                  </span>
                </span>
              </span>
            </span>
          </p>

          <p className="mb-4">
            <span>
              <span>
                <span style={{ fontFamily: '"Segoe UI", sans-serif' }}>
                  <span>
                    With the exception of sports betting and live casino games, in order to ensure the integrity of the casino games, a Random Number Generator (RNG) is always used to determine the random outcome of such games.
                    <br />
                    <br />
                    This is a standard industry system which ensures consistently random results which has also been extensively tested by running and analyzing thousands of game rounds. The randomness of the RNG provides a credible and fair gaming environment.
                  </span>
                </span>
              </span>
            </span>
          </p>

          <p className="mb-4">
            <span>
              <span>
                <span style={{ fontFamily: '"Segoe UI", sans-serif' }}>
                  <span>
                    The Return to Player (RTP) value is a theoretical calculation of the expected percentage of wagers that a specific game will return to player after a significant amount of plays (e.g. hundreds of million game plays). While every single game play is unpredictable and it is possible to win a big amount or lose your bet, the average return of a specific game in the long run will approach the Theoretical RTP value.
                    <br />
                    <br />
                    We are monitoring the players’ payout ratio on a regular basis and we cooperate with gambling regulatory authorities to ensure our compliance with the legislation of relevant jurisdictions.
                  </span>
                </span>
              </span>
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default fairnessPolicyRoute