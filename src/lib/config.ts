export const BASE_URL = "";
export const BASE_URL_WS = "";

// export const BASE_URL = "https://gjexch.com";
// export const BASE_URL_WS = "https://gjexch.com";

export const CONFIG = {
  SiteName: "exchange",
  siteKey: "10",

  // new api's start
  events: BASE_URL + "/api/v1/events",
  eventsTime: 300,

  marketList: BASE_URL + "/api/v1/markets",
  // new api's end

  domain: "https://gjexch.com/",
  miniCasinoIframeUrl: "https://minicasino.ludoexchange.com",

  playerLogin: BASE_URL + "/app/users/playerLogin",
  getUserBalance: BASE_URL + "/app/exchange/users/userBalance", 
  changeUserPassword: BASE_URL + "/app/exchange/users/userChangePassword",

  getUserBetStake: BASE_URL + "/app/exchange/users/userBetStakeList",
  getUserBetStakeTime: 518400,

  userUpdateStackValueURL: BASE_URL + "/app/exchange/users/updateUserBetStake",
  getAllMarketplURL: BASE_URL + "/app/exchange/users/pl/getMatchOddsPl",
  placeBetURL: BASE_URL + "/app/exchange/users/placebet",
  userAccountStatement: BASE_URL + "/app/exchange/users/userAccountStatement",
  getUserBetList: BASE_URL + "/app/exchange/users/bet/userMarketBetsNew",
  getExposureListURL: BASE_URL + "/app/exchange/users/userEventsExposure",

  casinoEvents: BASE_URL + "/api/v1/casinoEvents",
  casinoEventsTime: 1440,

  exchEventsStreaming: BASE_URL + "/api/streaming/exchEventsStreaming",
  activityList: BASE_URL + "/app/exchange/users/userActivityLogs",
  unmatchedBets: BASE_URL + "/app/exchange/users/matchedUnmatchedBets",
  cancelBetsAllUnmatchedBets: BASE_URL + "/app/exchange/users/cancelBets",
  userBetList: BASE_URL + "/app/exchange/users/userBetList",
  newProfitLoss: BASE_URL + "/app/exchange/users/pl/userSportsProfitlossNew",
  newProfitLossEventMarket:
    BASE_URL + "/app/exchange/users/pl/userEventsProfitlossNew",
  ProfitLossMarketNew:
    BASE_URL + "/app/exchange/users/pl/userMarketsProfitlossNew",

  // inplayEvents: "AllInplayEvents",
  // allSportsEvents: "allSportsEvents",
  // top21events: "top21events",
  // allEventsList: "allEventsList",

  // getRacingEvents: BASE_URL + "/api/navigation/racingEventsList",
  // getRacingEventsTime: 20,
  // getBallByBallMarket: BASE_URL + "/api/exchange/markets/getBallByBallMarket",
  // getMarketEventResults:
  //   BASE_URL + "/api/exchange/results/getMarketEventResults",

  // searchEventList: BASE_URL + "/api/navigation/searchEventList",
  // searchEventListTime: 1440,

  // ballbyPlacebet: BASE_URL + "/app/exchange/users/ballbyPlacebet",
  // resetPasswordURL: BASE_URL + "/v1/exchange/user/userForgotPasswordVerify",
  // nameFromMobileURL: BASE_URL + "/exchange/get/user_mobileno",
  // getSportsbookPl: BASE_URL + "/app/exchange/users/pl/getSportsbookPl",
  // getSportsList: BASE_URL + "/api/exchange/sports/sportsList",
  // getSportsListTime: 1440,

  // exchangeTypeList: BASE_URL + "/api/navigation/exchangeTypeList",
  // exchangeTypeListTime: 1440,

  // SearchEventList: BASE_URL + "/api/exchange/events/searchEventList",
  // SearchEventListTime: 1440, for future
  // competitionMarketList: BASE_URL + "/api/navigation/competitionMarketList",

  // getAllEventsList: BASE_URL + "/api/navigation/allEventsList",
  // getAllEventsListTime: 1440,
  // getCustomerSupport: BASE_URL + "/app/users/supports/getCustomerSupport",
  // getCustomerSupportTime: 1440,

  // getCasinoInformation: BASE_URL + "/api/exchange/navigations/casinoEvents",
  // getCasinoInformationTime: 1440,

  // lotterySportsList: BASE_URL + "/api/exchange/sports/lotterySportsList",
  // lotterySportsListTime: 20,
  // lotteryPlaceBet: BASE_URL + "/app/exchange/users/lotteryPlaceBet",
  // getLotteryPl: BASE_URL + "/app/exchange/users/pl/getLotteryPl",

  // getDaysWiseEvents: BASE_URL + "/api/exchange/events/getDaysWiseEvents", // don't know where we use
  // getDaysWiseEventsTime: 1440, //check

  // getUserProfile: BASE_URL + "/app/exchange/users/userProfile",

  // getIpLocation: "https://pro.ip-api.com/json/?key=qSA5ctYZHdWsx04",
 
  // getExchangeNews: BASE_URL + "/api/navigation/exchangeNews",
  // getExchangeNewsTime: 20,
  // getEventMatchedBetList:
  //   BASE_URL + "/app/exchange/users/betlist/eventMatchedBetList",

  // getFancyPlURL: BASE_URL + "/app/exchange/users/pl/getFancyPl",
  // getManualPLURL: BASE_URL + "/app/exchange/users/pl/getBookmakersPl",
  // getSportbookPLURL: BASE_URL + "/app/exchange/users/pl/getSportsbookPl",

  // getBinaryPLURL: BASE_URL + "/v1/exchange/users/pl/getBinaryPl", // =----= not Done YET
 

  // videoStreamURL: BASE_URL + "/api/exchange/streaming/exchEventsStreaming",
  // getRulesOfMarketURL: BASE_URL + "/api/exchange/rules/getSportsRule",
  // getRulesOfMarketURLTime: 1440,
  // getbookieFancyDataURL:
  //   BASE_URL + "/api/exchange/markets/getMarketsEventList", // =---=  done
  // getbookieFancyDataURLTime:1440,
  // fancyBookListByMarketURL: BASE_URL + "/app/exchange/users/pl/marketFancyBook",
  // userGetStackURL: BASE_URL + "/v1/exchange/users/getUserBetStake", // =---= not Done Yet

 

  // userSportsProfitloss:
  //   BASE_URL + "/app/exchange/users/pl/userSportsProfitloss",
  // getPasswordHistory: BASE_URL + "/app/exchange/users/changedPasswordHistory",
  // userEventsProfitloss:
  //   BASE_URL + "/app/exchange/users/pl/userEventsProfitloss",
  // userMarketsProfitloss:
  //   BASE_URL + "/app/exchange/users/pl/userMarketsProfitloss",
 
  // casinoInternational:
  //   BASE_URL + "/api/exchange/navigations/internationalCasinoList",
  // casinoInternationalTime: 1440,

  // sportTournamentsList:
  //   BASE_URL + "/api/exchange/tournaments/sportTournamentsList", //  =---= not Done Yet
  // sportTournamentsListTime: 1440,
  // tournamentEventsList:
  //   BASE_URL + "/api/exchange/events/tournamentEventsList", //  =---= not Done Yet
  // tournamentEventsListTime: 1440,

 
  // walletInfoURL: BASE_URL + "/v1/exchange/users/balance/getUserWalletInfo", // =---= not Done Yet

  // whatsappLinkURL: BASE_URL + "/v1/exchange/users/getParentWhatsAppNo", // =---= not Done Yet
  // whatsappLinkURLTime: 30, // =---= not Done Yet

  // getGeneralRulesURL: BASE_URL + "/api/exchange/rules/sportsRulesList",

  // getTopCasinoGame: BASE_URL + "/api/navigation/casinoEvents", // =---=  Done
  // getTopCasinoGameTime: 1440,

  // getFaqListURL: BASE_URL + "/app/exchange/faq/faqList", // =---=Done
  // getFaqListURLTime: 1440,
  // getPromotionsListURL: BASE_URL + "/app/exchange/promotion/promotionsList", // =---= Done
  // getPromotionsListURLTime: 1440,
  // promoDetailsURL: BASE_URL + "/v1/exchange/promotion/promotionsDetails", // =---= not Done Yet
  // getSponserListURL: BASE_URL + "/app/exchange/sponsor/sponsorshipsList", // =---= Done
  // getSponserListURLTime: 1440,

  // getSponserDetailsURL:
  //   BASE_URL + "/v1/exchange/sponsor/sponsorshipsDetails", // =---= not Done Yet

  //accounts b2c
  // withdrawalRequest: BASE_URL + "/app/exchange/users/withdrawalRequest",
  // calculateWithdrawalAmount:
  //   BASE_URL + "/app/exchange/users/calculateWithdrawalAmount",
  // userRegisterOtpSent: BASE_URL + "/app/user/userRegisterOtpSent",
  // userRegisterVerify: BASE_URL + "/app/user/userRegisterVerify",
  // getWithdrawalList: BASE_URL + "/app/exchange/users/getWithdrawalList",
  // deleteWithdrawalBankDetails:
  //   BASE_URL + "/app/exchange/users/deleteWithdrawalBankDetails",
  // getWithdrawalBankDetails:
  //   BASE_URL + "/app/exchange/users/getWithdrawalBankDetails",
  // addWithdrawalBank: BASE_URL + "/app/exchange/users/addWithdrawalBank",
  // uploadPaymentDetails: BASE_URL + "/app/exchange/users/uploadPaymentDetails",
  // getDepositDetails: BASE_URL + "/app/exchange/users/getDepositDetails",
  // cancelWithdrawURL:
  //   BASE_URL + "/app/exchange/users/withdraw/cancelWithdrawalRequest",

  // betsRollingCommission:
  //   BASE_URL + "/app/exchange/users/commission/betsRollingCommission",
  // successWithdrawalReceipt:
  //   BASE_URL + "/app/exchange/users/withdraw/successWithdrawalReceipt",
  // getUserReward: BASE_URL + "/app/exchange/users/getUserReward",

  // getUserAmountSettlement:
  //   BASE_URL + "/app/exchange/users/getUserAmountSettlement",
  // getReferralCode: BASE_URL + "/app/exchange/users/getReferralCode",

  // OLD APIS

  // updateUserBetStake: BASE_URL + "/v1/exchange/users/updateUserBetStake",

  // registerUserURL: BASE_URL + "/v1/exchange/user/userRegisterVerify",
  // withdrawRequestURL: BASE_URL + "/exchange/bank/withdrawal",
  // withdrawListURL: BASE_URL + "/v1/exchange/users/getWithdrawalList",
  // depositeDetailURL: BASE_URL + "/exchange/bank/deposit_details",
  // sendOTPUserURL: BASE_URL + "/v1/exchange/user/userRegisterOtpSent",
  // sendOTPTransferRequest: BASE_URL + "/exchange/transfer/amount_request",
  // registerUserSpeedURL: BASE_URL + "/front/signup/cbtfspeed",

  // uploadTransactionImageURL:
  //   BASE_URL + "/v1/exchange/users/uploadPaymentDetails",

  // claimAmountURL: BASE_URL + "/v1/exchange/users/userClaim",

  // marketBookLine: BASE_URL + "/app/exchange/users/pl/marketBook",

  // newProfitLossMarket:
  //   BASE_URL + "/app/exchange/users/pl/userMarketsProfitloss",
};

export const STACK_VALUE = [
  {
    stakeName: "1000",
    stakeAmount: "1000",
  },
  {
    stakeName: "5000",
    stakeAmount: "5000",
  },
  {
    stakeName: "10000",
    stakeAmount: "10000",
  },
  {
    stakeName: "25000",
    stakeAmount: "25000",
  },
  {
    stakeName: "50000",
    stakeAmount: "50000",
  },
  {
    stakeName: "100000",
    stakeAmount: "100000",
  },
  {
    stakeName: "200000",
    stakeAmount: "200000",
  },
  {
    stakeName: "500000",
    stakeAmount: "500000",
  },
];
