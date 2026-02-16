// const BASE_URL_API = 'http://130.172.2.149:4444';
// const BASE_URL_V1 = "unityexch.com";

export const BASE_URL_API = 'https://100exch.com';
const BASE_URL_V1 = "https://100exch.com";
const BASE_URL = "https://100exch.com";
const BASE_URL_APIX = 'https://100exch.com'


// const BASE_URL_API = '';
// const BASE_URL_V1 = "";
// const BASE_URL = "";
// const BASE_URL_APIX = "";
// export const BASE_URL_WS = ""
// export const BASE_URL_WS = "http://54.228.173.228:9007"


// export const BASE_URL_WS = "https://100exch.com";

export const CONFIG = {
  SiteName: 'exchange',
  siteKey: '10',

  inplayEvents: "AllInplayEvents",
  allSportsEvents: 'allSportsEvents',
  top21events: 'top21events',
  allEventsList: 'allEventsList',

  getRacingEvents: BASE_URL_API + '/api/navigation/racingEventsList',//done
  getRacingEventsTime: 20,//done
  getBallByBallMarket: BASE_URL + "/api/exchange/markets/getBallByBallMarket",
  getMarketEventResults: BASE_URL + '/api/exchange/results/getMarketEventResults',

  searchEventList: BASE_URL + "/api/navigation/searchEventList",
  searchEventListTime: 1440,//done


  ballbyPlacebet: BASE_URL + "/app/exchange/users/ballbyPlacebet",
  resetPasswordURL: BASE_URL_V1 + '/v1/exchange/user/userForgotPasswordVerify',
  nameFromMobileURL: BASE_URL_V1 + '/exchange/get/user_mobileno',
  getSportsbookPl: BASE_URL + "/app/exchange/users/pl/getSportsbookPl",
  getSportsList: BASE_URL_API + '/api/exchange/sports/sportsList',//done
  getSportsListTime: 1440, //done


  exchangeTypeList: BASE_URL + "/api/navigation/exchangeTypeList",
  exchangeTypeListTime: 1440,


  SearchEventList: BASE_URL_API + "/api/exchange/events/searchEventList",
  SearchEventListTime: 1440,//DONE for future
  competitionMarketList: BASE_URL + "/api/navigation/competitionMarketList",

  getSlider: BASE_URL_API + '/api/navigation/sliderList',//done
  getSliderTime: 20,
  bannersList: BASE_URL_API + "/api/navigation/bannersList",
  bannersListTime: 20,

  getAllEventsList: BASE_URL_APIX + '/api/navigation/allEventsList',//done
  getAllEventsListTime: 20,
  getCustomerSupport: BASE_URL + '/app/users/supports/getCustomerSupport',//done
  getCustomerSupportTime: 1440,

  getCasinoInformation: BASE_URL_API + '/api/exchange/navigations/casinoEvents',//done
  getCasinoInformationTime: 1440,


  lotterySportsList: BASE_URL + "/api/exchange/sports/lotterySportsList",
  lotterySportsListTime: 20,
  lotteryPlaceBet: BASE_URL + "/app/exchange/users/lotteryPlaceBet",
  getLotteryPl: BASE_URL + "/app/exchange/users/pl/getLotteryPl",

  getDaysWiseEvents: BASE_URL_API + '/api/exchange/events/getDaysWiseEvents',// don't know where we use
  getDaysWiseEventsTime: 1440, //check

  getUserProfile: BASE_URL + '/app/exchange/users/userProfile', // done
  playerLogin: BASE_URL + '/app/users/playerLogin',
  getIpLocation: 'https://pro.ip-api.com/json/?key=qSA5ctYZHdWsx04',// done
  getUserBalance: BASE_URL + "/app/exchange/users/userBalance", // done
  changeUserPassword: BASE_URL + '/app/exchange/users/userChangePassword',// done
  getUserBetStake: BASE_URL + '/app/exchange/users/userBetStakeList', // done
  getUserBetStakeTime: 518400,
  userUpdateStackValueURL: BASE_URL + "/app/exchange/users/updateUserBetStake", // done
  getExchangeNews: BASE_URL_API + '/api/navigation/exchangeNews', // done
  getExchangeNewsTime: 20,
  getEventMatchedBetList: BASE_URL + "/app/exchange/users/betlist/eventMatchedBetList", // done

  getFancyPlURL: BASE_URL + "/app/exchange/users/pl/getFancyPl", //done
  getManualPLURL: BASE_URL + "/app/exchange/users/pl/getBookmakersPl", //done
  getSportbookPLURL: BASE_URL + "/app/exchange/users/pl/getSportsbookPl", //done

  getBinaryPLURL: BASE_URL_V1 + '/v1/exchange/users/pl/getBinaryPl', // =----= not Done YET
  getAllMarketplURL: BASE_URL + "/app/exchange/users/pl/getMatchOddsPl", //done
  placeBetURL: BASE_URL + "/app/exchange/users/placebet", //done

  videoStreamURL: BASE_URL_API + '/api/exchange/streaming/exchEventsStreaming', //done
  getRulesOfMarketURL: BASE_URL_API + '/api/exchange/rules/getSportsRule', //done
  getRulesOfMarketURLTime: 1440,
  getbookieFancyDataURL: BASE_URL_API + "/api/exchange/markets/getMarketsEventList", // =---=  done 
  // getbookieFancyDataURLTime:1440,
  fancyBookListByMarketURL: BASE_URL + '/app/exchange/users/pl/marketFancyBook', // done
  userGetStackURL: BASE_URL_V1 + '/v1/exchange/users/getUserBetStake', // =---= not Done Yet

  userAccountStatement: BASE_URL + "/app/exchange/users/userAccountStatement", // done

  userSportsProfitloss: BASE_URL + "/app/exchange/users/pl/userSportsProfitloss",// done
  getPasswordHistory: BASE_URL + '/app/exchange/users/changedPasswordHistory', // done
  userEventsProfitloss: BASE_URL + '/app/exchange/users/pl/userEventsProfitloss', // done
  userMarketsProfitloss: BASE_URL + '/app/exchange/users/pl/userMarketsProfitloss', // done
  getUserBetList: BASE_URL + '/app/exchange/users/bet/userMarketBetsNew',// done
  casinoInternational: BASE_URL_API + '/api/exchange/navigations/internationalCasinoList',// done
  casinoInternationalTime: 1440,

  sportTournamentsList: BASE_URL_API + '/api/exchange/tournaments/sportTournamentsList',//  =---= not Done Yet
  sportTournamentsListTime: 1440,
  tournamentEventsList: BASE_URL_API + '/api/exchange/events/tournamentEventsList',//  =---= not Done Yet
  tournamentEventsListTime: 1440,

  getExposureListURL: BASE_URL + "/app/exchange/users/userEventsExposure",// done
  walletInfoURL: BASE_URL_V1 + "/v1/exchange/users/balance/getUserWalletInfo", // =---= not Done Yet

  whatsappLinkURL: BASE_URL_V1 + "/v1/exchange/users/getParentWhatsAppNo", // =---= not Done Yet
  whatsappLinkURLTime: 30, // =---= not Done Yet

  getGeneralRulesURL: BASE_URL_API + '/api/exchange/rules/sportsRulesList',// done

  getTopCasinoGame: BASE_URL_V1 + '/api/navigation/casinoEvents',// =---=  Done 
  getTopCasinoGameTime: 1440,
  getFaqListURL: BASE_URL_V1 + '/app/exchange/faq/faqList',// =---=Done
  getFaqListURLTime: 1440,
  getPromotionsListURL: BASE_URL_V1 + '/app/exchange/promotion/promotionsList',// =---= Done
  getPromotionsListURLTime: 1440,
  promoDetailsURL: BASE_URL_V1 + '/v1/exchange/promotion/promotionsDetails',// =---= not Done Yet
  getSponserListURL: BASE_URL_V1 + '/app/exchange/sponsor/sponsorshipsList',// =---= Done
  getSponserListURLTime: 1440,

  exchEventsStreaming: BASE_URL_V1 + '/api/streaming/exchEventsStreaming',
  getSponserDetailsURL: BASE_URL_V1 + '/v1/exchange/sponsor/sponsorshipsDetails',// =---= not Done Yet


  //accounts b2c
  withdrawalRequest: BASE_URL + '/app/exchange/users/withdrawalRequest',// done
  calculateWithdrawalAmount: BASE_URL + '/app/exchange/users/calculateWithdrawalAmount', // done
  userRegisterOtpSent: BASE_URL + '/app/user/userRegisterOtpSent', // done
  userRegisterVerify: BASE_URL + '/app/user/userRegisterVerify',// done
  getWithdrawalList: BASE_URL + '/app/exchange/users/getWithdrawalList',// done
  deleteWithdrawalBankDetails: BASE_URL + '/app/exchange/users/deleteWithdrawalBankDetails', // done
  getWithdrawalBankDetails: BASE_URL + "/app/exchange/users/getWithdrawalBankDetails", // done
  addWithdrawalBank: BASE_URL + '/app/exchange/users/addWithdrawalBank',// done
  uploadPaymentDetails: BASE_URL + '/app/exchange/users/uploadPaymentDetails', // done
  getDepositDetails: BASE_URL + '/app/exchange/users/getDepositDetails', // done
  cancelWithdrawURL: BASE_URL + '/app/exchange/users/withdraw/cancelWithdrawalRequest', // done

  betsRollingCommission: BASE_URL + "/app/exchange/users/commission/betsRollingCommission",
  successWithdrawalReceipt: BASE_URL + "/app/exchange/users/withdraw/successWithdrawalReceipt",
  getUserReward: BASE_URL + "/app/exchange/users/getUserReward",

  getUserAmountSettlement: BASE_URL + "/app/exchange/users/getUserAmountSettlement",
  getReferralCode: BASE_URL + "/app/exchange/users/getReferralCode",


  // OLD APIS

  updateUserBetStake: BASE_URL_V1 + '/v1/exchange/users/updateUserBetStake',

  registerUserURL: BASE_URL_V1 + '/v1/exchange/user/userRegisterVerify',
  withdrawRequestURL: BASE_URL_V1 + '/exchange/bank/withdrawal',
  withdrawListURL: BASE_URL_V1 + '/v1/exchange/users/getWithdrawalList',
  depositeDetailURL: BASE_URL_V1 + '/exchange/bank/deposit_details',
  sendOTPUserURL: BASE_URL_V1 + '/v1/exchange/user/userRegisterOtpSent',
  sendOTPTransferRequest: BASE_URL_V1 + '/exchange/transfer/amount_request',
  registerUserSpeedURL: BASE_URL_V1 + '/front/signup/cbtfspeed',
  activityList: BASE_URL + '/app/exchange/users/userActivityLogs',
  unmatchedBets: BASE_URL_V1 + "/app/exchange/users/matchedUnmatchedBets",
  cancelBetsAllUnmatchedBets: BASE_URL_V1 + "/app/exchange/users/cancelBets",


  uploadTransactionImageURL: BASE_URL_V1 + "/v1/exchange/users/uploadPaymentDetails",

  claimAmountURL: BASE_URL_V1 + "/v1/exchange/users/userClaim",

  marketList: BASE_URL_APIX + "/api/navigation/marketList",
  menuList: BASE_URL + "/api/navigation/menuList",
  menuListTime: 1440,

  marketBookLine: BASE_URL + "/app/exchange/users/pl/marketBook",
  userBetList: BASE_URL + "/app/exchange/users/userBetList",
  newProfitLossMarket: BASE_URL + '/app/exchange/users/pl/userMarketsProfitloss',
  newProfitLoss: BASE_URL + '/app/exchange/users/pl/userSportsProfitlossNew',
  newProfitLossEventMarket: BASE_URL + '/app/exchange/users/pl/userEventsProfitlossNew',
  ProfitLossMarketNew: BASE_URL + '/app/exchange/users/pl/userMarketsProfitlossNew'
};


export const STACK_VALUE = [
  {
    stakeName: '1000',
    stakeAmount: '1000'
  },
  {
    stakeName: '5000',
    stakeAmount: '5000'
  },
  {
    stakeName: '10000',
    stakeAmount: '10000'
  },
  {
    stakeName: '25000',
    stakeAmount: '25000'
  },
  {
    stakeName: '50000',
    stakeAmount: '50000'
  },
  {
    stakeName: '100000',
    stakeAmount: '100000'
  },
  {
    stakeName: '200000',
    stakeAmount: '200000'
  },
  {
    stakeName: '500000',
    stakeAmount: '500000'
  },
];