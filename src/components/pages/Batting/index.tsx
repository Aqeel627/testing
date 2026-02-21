"use client";
import BreadCrumb from '@/components/common/bread-crumb'
import React, { useState } from 'react'

const BettingRoute = () => {
  // Accordion ko open/close karne ke liye state
  const [openTab, setOpenTab] = useState<string | null>(null);

  const toggleTab = (tab: string) => {
    setOpenTab(openTab === tab ? null : tab);
  };

  return (
    <div className='mt-8 md-mt-7 min-[960px]:mt-0 min-[1200px]:mt-5'>
      {/* Breadcrumb jaisa aapne likha tha */}
      <BreadCrumb title="Sport Betting Rules"/>
      
      <div className="w-full max-w-6xl mx-auto flex flex-col flex-grow scroll-mt-[40px] py-6">
        
        {/* ----------------- CRICKET ACCORDION ----------------- */}
        <div className="mb-4 bg-(--palette-background-paper) rounded-[16px] overflow-hidden shadow-md">
          {/* Header */}
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer text-(--primary-text-color) hover:bg-[#1b2636] transition-colors"
            onClick={() => toggleTab('cricket')}
          >
            <span className="font-bold text-[14px]  tracking-wide text-(--primary-text-color)">Cricket</span>
            
            {/* Right Chevron Icon (>) - Bilkul image jaisa */}
            <svg 
              className={`w-4 h-4 text-(--primary-text-color) mr-4 font-bold transition-transform duration-300 ${openTab === 'cricket' ? 'rotate-90' : 'rotate-0'}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Content */}
          <div className={`transition-all duration-300 ease-in-out ${openTab === 'cricket' ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-[26px] pt-2 text-(--primary-text-color) text-sm md:text-base ">
              <p className="sport-rule mb-3">ALTHOUGH CONTENT ON OUR PLATFORM LIVE VIDEO IS ADVERTISED AS "LIVE", YOU SHOULD BE AWARE THAT OUR PLATFORM LIVE VIDEO IS SUBJECT TO A TIME DELAY. The precise length of the time delay will vary depending on a number of factors, but you should typically expect a time delay of between 2 and 5 seconds behind the actual event. The time delay may sometimes be significantly longer than this.</p>
              <p className="sport-rule mb-3">IF YOU RELY ON OUR PLATFORM LIVE VIDEO TO PLACE BETS, YOU DO SO ENTIRELY AT YOUR OWN RISK. We accepts no responsibility for any loss suffered by you as a result of your reliance on our Live Video.</p>
              <p className="sport-rule mb-3">You may not use a VPN, proxy or similar services or devices that mask or manipulate the identification of your real location.</p>
              <p className="sport-rule caps-on mb-3 uppercase">We do not void bets if you place bet programmatically, i.e: Bots.</p>
              <p className="sport-rule caps-on mb-3 uppercase">We do not void bets if more than one user place bet using same network/ip.</p>
              <p className="sport-rule caps-on mb-5 uppercase">In the event we suspect you are in breach of the provisions of this Clause or any kind of fixing or are attempting to rely on them for a fraudulent purpose, we reserve the right to take any action necessary in order to investigate the matter, including informing the relevant law enforcement agencies, Void winning bets.</p>
              
              <h3 className="font-bold text-lg text-white mb-2">Line Market</h3>
              <ol className="list-decimal pl-5 mb-5 space-y-2">
                <li className="uppercase">If you place back and lay bets on the same run within 30 seconds, any profit-making bets will be deleted.</li>
                <li className="uppercase">If you use multiple accounts to circumvent Rule 1, any profit-making bets will be deleted.</li>
              </ol>
              
              <h3 className="font-bold text-lg text-white mb-2">Fancy</h3>
              <ol className="list-decimal pl-5 mb-5 space-y-2">
                <li>All fancy bets will be validated when match has been tied.</li>
                <li>All advance fancy will be suspended before toss or weather condition.</li>
                <li>In case technical error or any circumstances any fancy is suspended and does not resume result will be given all previous bets will be valid (based on haar/jeet).</li>
                <li>If any case wrong rate has been given in fancy that particular bets will be cancelled.</li>
                <li>In any circumstances management decision will be final related to all exchange items. Our scorecard will be considered as valid if there is any mismatch in online portal.</li>
                <li>Due to any technical error market is open and result has came all bets after result will be deleted.</li>
                <li>Penalty runs will not be counted in any fancy.</li>
                <li>In case batsmen is injured he/she has made 19 runs the market will be settled at 19 and all bets placed on more than 19 runs will voided.</li>
                <li>Batsman 50/100 run market will be settled at current batsman runs if batsman is injured, inning has been declared or team is all out.</li>
                <li>Next Men Out market will be voided if batsman is injured.</li>
                <li>For Advance Fancy Batsman market following conditions will be applied according to Match Type and overs has not been reduced:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Test:</strong> Market will be valid if any of the following condition is met. Player comes to play until 80 overs of respective inning</li>
                    <li><strong>One Day:</strong> Market will be valid if any of the following condition is met. Player comes to play until 25 overs of respective inning</li>
                    <li><strong>T-20:</strong> Market will be valid if any of the following condition is met. Player comes to play until 10 overs of respective inning</li>
                  </ul>
                </li>
              </ol>

              <h3 className="font-bold text-lg text-white mb-2">TEST-MATCHES</h3>
              <ol className="list-decimal pl-5 mb-5 space-y-2">
                <li>Complete session valid in test.</li>
                <li>In Case of team all out, running session/only-over/over-by-over will be settled at current score.</li>
                <li>In Case inning is declared by team, remaining overs of session will counted from next inning.
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <p className="text-gray-400 text-sm">I.e:- Current over is 167.4 and 170 OVER SESSION is running and inning has been declared by team, following conditions will be applied</p>
                    <li>Over will be rounded to 168</li>
                    <li>Remaining 2 overs will be counted from next inning</li>
                    <li>Only-Over/Over-by-over will be voided.</li>
                  </ul>
                </li>
                <li>1st day 1st session must be played minimum 25 overs otherwise 1st day 1st session will be voided.</li>
                <li>1st day 2nd session must be played 50 overs in total otherwise 1st day 2nd session will be voided.</li>
                <li>1st day must be played 80 overs in total otherwise 1st day total run will be voided.</li>
                <li>Test match both advance session is valid.</li>
                <li>In test both lambi paari / inning run is valid in advance fancy.</li>
              </ol>

              <h3 className="font-bold text-lg text-white mb-2">IPL</h3>
              <ol className="list-decimal pl-5 mb-5 space-y-2">
                <li>Super over will not be counted</li>
                <li>If Tournament of 74 matches gets reduced due to any reason except Match abandoned due to rain/bad light, all the special fancies will be voided.</li>
                <li>If Tournament is cancelled due to any reason, all settled markets will be valid.</li>
                <li>Total 1st over runs: Average 5 runs will be given in case match abandoned or over reduced (only 1st innings valid)</li>
                <li>Total 1st 6 over run:- Average 46 runs will be given in case match abandoned or over reduced (Only 1st Innings valid)</li>
                <li>Total fours: Average 26 fours will be given in case match abandoned or over reduced</li>
                <li>Total sixes: Average 13 sixes will be given in case match abandoned or over reduced</li>
                <li>Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced</li>
                <li>Total Wides - Average 9 wides will be given in case match abandoned or over reduced</li>
                <li>Total Extras - Average 16 extras will be given in case match abandoned or over reduced</li>
                <li>Total Fifties - Average 2 fifties will be given in case match abandoned or over reduced</li>
                <li>Total Caught outs: Average 8 caught out will be given in case match abandoned or over reduced</li>
                <li>Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced</li>
                <li>Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced</li>
                <li>Total No ball:- Average 1 No ball will be given in case match abandoned or over reduced</li>
                <li>Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced</li>
                <li>Highest innings run - Both innings are valid</li>
                <li>Lowest innings run - Only first innings is valid</li>
                <li>Highest over run: Both innings are valid</li>
                <li>Highest Match 1st over run in individual match: Only first innings is valid</li>
                <li>Highest Fours in individual match: Both innings are valid</li>
                <li>Highest Sixes in individual match: Both innings are valid</li>
                <li>Highest Extras in individual match: Both innings are valid</li>
                <li>Highest Wicket in individual match: Both innings are valid</li>
                <li>Highest 6 over run: Both innings are valid</li>
              </ol>

              <h3 className="font-bold text-lg text-white mb-2">ODI World Cup</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>48 Matches will be counted in fancy market.</li>
                <li>Super over will not be counted.</li>
                <li>If Tournament of 48 matches gets reduced due to any reason except Match abandoned due to rain/bad light, all the special fancies will be voided.</li>
                <li>If Tournament is cancelled due to any reason, all settled markets will be valid.</li>
                <li>Total 1st over runs: Average 4 runs will be given in case match abandoned or over reduced (only 1st innings valid).</li>
                <li>Total 1st 10 over run: Average 52 runs will be given in case match abandoned or over reduced (Only 1st Innings valid).</li>
                <li>Total fours: Average 48 fours will be given in case match abandoned or over reduced.</li>
                <li>Total sixes: Average 11 sixes will be given in case match abandoned or over reduced.</li>
                <li>Total Wickets: Average 15 Wickets will be given in case match abandoned or over reduced.</li>
                <li>Total Wides: Average 16 wides will be given in case match abandoned or over reduced.</li>
                <li>Total Extras: Average 27 extras will be given in case match abandoned or over reduced.</li>
                <li>Total Fifties: Average 3 fifties will be given in case match abandoned or over reduced (Centuries/Double centuries will not be counted in this market).</li>
                <li>Total Centuries: Average 1 centuries will be given in case match abandoned or over reduced (Double centuries will not be counted in this market).</li>
                <li>Total Caught outs: Average 10 caught out will be given in case match abandoned or over reduced.</li>
                <li>Total Bowled: Average 3 Bowled out will be given in case match abandoned or over reduced.</li>
                <li>Total LBW: Average 2 LBW will be given in case match abandoned or over reduced.</li>
                <li>Total Run out: Average 1 Run out will be given in case match abandoned or over reduced.</li>
                <li>Total No ball: Average 2 No ball will be given in case match abandoned or over reduced.</li>
                <li>Highest innings run: Only first innings is valid.</li>
                <li>Lowest innings run: Only first innings is valid.</li>
                <li>Highest partnership: Both innings are valid.</li>
                <li>Tournament top batsman run: Both innings are valid.</li>
                <li>Highest Match 1st over run in individual match: Only first innings is valid.</li>
                <li>Highest Match 1st 10 over run in individual match: Only first innings is valid.</li>
                <li>Highest over run: Both innings are valid.</li>
                <li>Highest maiden over: Average 3 maiden ove will be given in case match abandoned or over reduced.</li>
                <li>Highest Fifties: Centuries/Double centuries will not be counted in this market.</li>
                <li>Highest Centuries: Double centuries will not be counted in this market.</li>
                <li>How Many Players Injured By Conclusion: Player replaced by head injury, i.e:- In South Africa vs Australia match C Green replaced by M Labuschagne.</li>
                <li>Lowest Runs Given By Any Bowler In Individual Match: Bowler must bowl 10 overs.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* ----------------- CASINO ACCORDION ----------------- */}
        <div className="mb-4 bg-(--palette-background-paper) rounded-[16px] overflow-hidden shadow-md">
          {/* Header */}
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer text-(--primary-text-color)hover:bg-[#1b2636] transition-colors"
            onClick={() => toggleTab('casino')}
          >
            <span className="font-bold text-[14px] tracking-widetext-(--primary-text-color)">Casino</span>
            
            {/* Right Chevron Icon (>) */}
            <svg 
              className={`w-4 h-4 text-(--primary-text-color) mr-4 font-bold transition-transform duration-300 ${openTab === 'casino' ? 'rotate-90' : 'rotate-0'}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Content */}
          <div className={`transition-all duration-300 ease-in-out ${openTab === 'casino' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-5 pt-2 text-[#b0bec5] text-sm md:text-base">
              <ol className="list-decimal pl-5">
                <li className="uppercase">In all casino's except our own casino max payout is 40x.</li>
              </ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BettingRoute