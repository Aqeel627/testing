// JSON Data for Markets
export const MARKETS_DATA = [
  {
    marketId: "1.12345",
    marketName: "Match Odds",
    marketType: "MATCH_ODDS",
    status: "OPEN",
    min: 100,
    max: 50000,
    totalMatched: 2700,
    runners: [
      {
        selectionId: 111,
        runnerName: "Titans W",
        status: "ACTIVE",
        backOdds: [
          { price: 1.06, size: 5990 },
          { price: 1.05, size: 4500 },
          { price: 1.04, size: 3200 },
        ],
        layOdds: [
          { price: 1.19, size: 4210 },
          { price: 1.2, size: 3800 },
          { price: 1.21, size: 2900 },
        ],
      },
      {
        selectionId: 222,
        runnerName: "South Western Districts W",
        status: "SUSPENDED",
        backOdds: [
          { price: 4.5, size: 3200 },
          { price: 4.4, size: 2800 },
          { price: 4.3, size: 2100 },
        ],
        layOdds: [
          { price: 4.8, size: 2900 },
          { price: 4.9, size: 2400 },
          { price: 5.0, size: 1800 },
        ],
      },
    ],
  },
  {
    marketId: "1.23456",
    marketName: "Bookmaker",
    marketType: "BOOKMAKER",
    status: "OPEN",
    min: 100,
    max: 25000,
    totalMatched: 1800,
    runners: [
      {
        selectionId: 333,
        runnerName: "Titans W",
        status: "ACTIVE",
        backOdds: [
          { price: 1.08, size: 4500 },
          { price: 1.07, size: 3800 },
          { price: 1.06, size: 2900 },
        ],
        layOdds: [
          { price: 1.22, size: 3900 },
          { price: 1.23, size: 3200 },
          { price: 1.24, size: 2600 },
        ],
      },
      {
        selectionId: 444,
        runnerName: "South Western Districts W",
        status: "ACTIVE",
        backOdds: [
          { price: 4.2, size: 2800 },
          { price: 4.1, size: 2300 },
          { price: 4.0, size: 1900 },
        ],
        layOdds: [
          { price: 4.6, size: 2500 },
          { price: 4.7, size: 2100 },
          { price: 4.8, size: 1700 },
        ],
      },
    ],
  },
  {
    marketId: "1.34567",
    marketName: "Tied Match",
    marketType: "TIED_MATCH",
    status: "OPEN",
    min: 50,
    max: 10000,
    totalMatched: 850,
    runners: [
      {
        selectionId: 555,
        runnerName: "Yes",
        status: "ACTIVE",
        backOdds: [
          { price: 15.0, size: 1200 },
          { price: 14.5, size: 950 },
          { price: 14.0, size: 800 },
        ],
        layOdds: [
          { price: 16.0, size: 1100 },
          { price: 16.5, size: 900 },
          { price: 17.0, size: 750 },
        ],
      },
      {
        selectionId: 666,
        runnerName: "No",
        status: "ACTIVE",
        backOdds: [
          { price: 1.01, size: 8500 },
          { price: 1.005, size: 7200 },
          { price: 1.003, size: 6100 },
        ],
        layOdds: [
          { price: 1.02, size: 7800 },
          { price: 1.025, size: 6500 },
          { price: 1.03, size: 5400 },
        ],
      },
    ],
  },
  {
    marketId: "1.45678",
    marketName: "Total Runs",
    marketType: "TOTAL_RUNS",
    status: "OPEN",
    min: 100,
    max: 20000,
    totalMatched: 1450,
    runners: [
      {
        selectionId: 777,
        runnerName: "Over 285.5",
        status: "ACTIVE",
        backOdds: [
          { price: 1.9, size: 3200 },
          { price: 1.88, size: 2800 },
          { price: 1.86, size: 2400 },
        ],
        layOdds: [
          { price: 1.95, size: 2900 },
          { price: 1.97, size: 2500 },
          { price: 1.99, size: 2100 },
        ],
      },
      {
        selectionId: 888,
        runnerName: "Under 285.5",
        status: "ACTIVE",
        backOdds: [
          { price: 2.1, size: 2800 },
          { price: 2.08, size: 2400 },
          { price: 2.06, size: 2000 },
        ],
        layOdds: [
          { price: 2.15, size: 2500 },
          { price: 2.17, size: 2100 },
          { price: 2.19, size: 1800 },
        ],
      },
    ],
  },
  {
    marketId: "1.56789",
    marketName: "Top Batsman",
    marketType: "TOP_BATSMAN",
    status: "OPEN",
    min: 50,
    max: 5000,
    totalMatched: 620,
    runners: [
      {
        selectionId: 999,
        runnerName: "Player A",
        status: "ACTIVE",
        backOdds: [
          { price: 5.5, size: 1800 },
          { price: 5.4, size: 1500 },
          { price: 5.3, size: 1200 },
        ],
        layOdds: [
          { price: 5.8, size: 1600 },
          { price: 5.9, size: 1300 },
          { price: 6.0, size: 1100 },
        ],
      },
      {
        selectionId: 1010,
        runnerName: "Player B",
        status: "ACTIVE",
        backOdds: [
          { price: 6.5, size: 1500 },
          { price: 6.4, size: 1200 },
          { price: 6.3, size: 1000 },
        ],
        layOdds: [
          { price: 6.8, size: 1400 },
          { price: 6.9, size: 1100 },
          { price: 7.0, size: 900 },
        ],
      },
      {
        selectionId: 1111,
        runnerName: "Player C",
        status: "ACTIVE",
        backOdds: [
          { price: 7.0, size: 1300 },
          { price: 6.9, size: 1100 },
          { price: 6.8, size: 900 },
        ],
        layOdds: [
          { price: 7.3, size: 1200 },
          { price: 7.4, size: 1000 },
          { price: 7.5, size: 800 },
        ],
      },
    ],
  },
  {
    marketId: "1.67890",
    marketName: "Innings Runs",
    marketType: "INNINGS_RUNS",
    status: "OPEN",
    min: 100,
    max: 15000,
    totalMatched: 980,
    runners: [
      {
        selectionId: 1212,
        runnerName: "150-175",
        status: "ACTIVE",
        backOdds: [
          { price: 3.2, size: 2200 },
          { price: 3.15, size: 1900 },
          { price: 3.1, size: 1600 },
        ],
        layOdds: [
          { price: 3.3, size: 2000 },
          { price: 3.35, size: 1700 },
          { price: 3.4, size: 1400 },
        ],
      },
      {
        selectionId: 1313,
        runnerName: "175-200",
        status: "ACTIVE",
        backOdds: [
          { price: 2.8, size: 2400 },
          { price: 2.75, size: 2100 },
          { price: 2.7, size: 1800 },
        ],
        layOdds: [
          { price: 2.9, size: 2200 },
          { price: 2.95, size: 1900 },
          { price: 3.0, size: 1600 },
        ],
      },
    ],
  },
  {
    marketId: "1.78901",
    marketName: "Most Sixes",
    marketType: "MOST_SIXES",
    status: "OPEN",
    min: 50,
    max: 8000,
    totalMatched: 540,
    runners: [
      {
        selectionId: 1414,
        runnerName: "Titans W",
        status: "ACTIVE",
        backOdds: [
          { price: 1.85, size: 2800 },
          { price: 1.83, size: 2400 },
          { price: 1.81, size: 2000 },
        ],
        layOdds: [
          { price: 1.9, size: 2500 },
          { price: 1.92, size: 2100 },
          { price: 1.94, size: 1800 },
        ],
      },
      {
        selectionId: 1515,
        runnerName: "South Western Districts W",
        status: "ACTIVE",
        backOdds: [
          { price: 2.15, size: 2400 },
          { price: 2.13, size: 2000 },
          { price: 2.11, size: 1700 },
        ],
        layOdds: [
          { price: 2.2, size: 2200 },
          { price: 2.22, size: 1800 },
          { price: 2.24, size: 1500 },
        ],
      },
    ],
  },
  {
    marketId: "1.89012",
    marketName: "First Over Runs",
    marketType: "FIRST_OVER_RUNS",
    status: "SUSPENDED",
    min: 50,
    max: 5000,
    totalMatched: 320,
    runners: [
      {
        selectionId: 1616,
        runnerName: "0-5 Runs",
        status: "SUSPENDED",
        backOdds: [
          { price: 3.5, size: 1100 },
          { price: 3.45, size: 950 },
          { price: 3.4, size: 800 },
        ],
        layOdds: [
          { price: 3.65, size: 1000 },
          { price: 3.7, size: 850 },
          { price: 3.75, size: 700 },
        ],
      },
      {
        selectionId: 1717,
        runnerName: "6-10 Runs",
        status: "SUSPENDED",
        backOdds: [
          { price: 2.8, size: 1300 },
          { price: 2.75, size: 1100 },
          { price: 2.7, size: 950 },
        ],
        layOdds: [
          { price: 2.9, size: 1200 },
          { price: 2.95, size: 1000 },
          { price: 3.0, size: 850 },
        ],
      },
    ],
  },
];

export const markets = [
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 980 },
      { back: 0, lay: 0 },
      { back: 1.88, lay: 970 },
    ],
  },
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 980 },
      { back: 0, lay: 0 },
      { back: 1.88, lay: 970 },
    ],
  },
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 980 },
      { back: 0, lay: 0 },
      { back: 1.88, lay: 970 },
    ],
  },
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 980 },
      { back: 0, lay: 0 },
      { back: 1.88, lay: 970 },
    ],
  },
  {
    match: "India v Australia",
    time: "25/11/2025 07:00 PM",
    inplay: true,
    odds: [
      { back: 1.55, lay: 900 },
      { back: 0, lay: 0 },
      { back: 2.1, lay: 950 },
    ],
  },
  {
    match: "England v Pakistan",
    time: "01/12/2025 03:00 PM",
    inplay: false,
    odds: [
      { back: 1.9, lay: 800 },
      { back: 0, lay: 0 },
      { back: 2.4, lay: 780 },
    ],
  },
];

export const tabs = [
  "Popular",
  "Teen Patti",
  "Lucky 7",
  "Dragon Tiger",
  "Baccarat",
  "Andar Bahar",
  "Poker",
  "Bollywood",
  "Region",
  "Other",
  "Virtual",
];

export const items = [
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-mbl_teenpatti2020",
    name: "20-20 TEENPATTI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "img-fluid",
    name: "VIMAAN",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "img-fluid",
    name: "BALLOON",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-Baccarat",
    name: "BACCARAT",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-2020dragonTiger",
    name: "20-20 DRAGON TIGER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-lucky7A",
    name: "LUCKY 7 - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-AndarbaharA",
    name: "ANDAR BAHAR - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-32cardsA",
    name: "32 CARDS - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-ezugi",
    name: "EZUGI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-2020pokerA",
    name: "20-20 POKER - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-BaccaratA",
    name: "BACCARAT - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-1day3patti",
    name: "1DAY TEEN PATTI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-dragonTiger",
    name: "DRAGON TIGER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-fastlucky7",
    name: "FAST LUCKY - 7",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-OnedayDragonTiger",
    name: "1 DAY DRAGON TIGER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-muflisTeenPatti",
    name: "MUFLIS TEEN PATTI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-DtlA",
    name: "DTL - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-fastDragonTiger",
    name: "FAST DRAGON TIGER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-casinoWar",
    name: "CASINO WAR",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-casinoMeter",
    name: "CASINO METER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-mbl_29cardBaccarat",
    name: "29 CARD BACCARAT",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-instantWorli",
    name: "INSTANT WORLI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-pointTeenpatti",
    name: "POINT TEEN PATTI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-jokerTeenpatti",
    name: "JOKER TEEN PATTI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-headAndtails",
    name: "HEADS & TAILS",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-dreamcatcher",
    name: "DREAM CATCHER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-lucky0to9",
    name: "LUCKY 0 TO 9",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-betgames",
    name: "BETGAMES CASINO",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-tvbet",
    name: "TVBET",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-AmarAkbarAnthny",
    name: "AMAR AKBAR ANTHONY",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-3cardJugdement",
    name: "3 CARD JUDGEMENT - A",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-1cardMeter",
    name: "1 CARD METER",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-1card2020",
    name: "1 CARD 20-20",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-trio",
    name: "TRIO",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-andarbaharC",
    name: "ANDAR BAHAR - C",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-lottery",
    name: "LOTTERY",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-2020pokerB",
    name: "20-20 POKER - B",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-dtlTeenpatti",
    name: "DTL TEENPATTI",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-inaMinaDika",
    name: "INA MINA DIKA",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-lucky7b",
    name: "LUCKY 7 - B",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-bollywoodCasino",
    name: "BOLLYWOOD CASINO",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-2020cardRace",
    name: "20-20 CARD RACE",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-baccaratC",
    name: "BACCARAT - C",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-32cardsB",
    name: "32 CARDS - B",
  },
  {
    img: "https://t20exchange.com/api/users/images/Balloon-01.png",
    class: "casino_sprite casino-kbc",
    name: "KBC",
  },
];

export const menuItems = [
  { label: "ALL", gradient: true },
  { label: "OUR CASINO" },
  { label: "INTERNATIONAL CASINO" },
  { label: "VIRTUAL CASINO" },
];

export const marketsSingle = [
  {
    match: "Otago Volts v Canterbury Kings ",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 1.42 },
      { back: 3.25, lay: 3.3 },
      { back: 1.88, lay: 1.92 },
    ],
  },
  {
    match: "India v Australia",
    time: "25/11/2025 07:00 PM",
    inplay: false,
    odds: [
      { back: 1.55, lay: 1.6 },
      { back: 3.45, lay: 3.5 },
      { back: 2.1, lay: 2.15 },
    ],
  },
  {
    match: "England v Pakistan",
    time: "01/12/2025 03:00 PM",
    inplay: true,
    odds: [
      { back: 1.9, lay: 1.95 },
      { back: 3.1, lay: 3.15 },
      { back: 2.4, lay: 2.45 },
    ],
  },
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 1.42 },
      { back: 3.25, lay: 3.3 },
      { back: 1.88, lay: 1.92 },
    ],
  },
  {
    match: "India v Australia",
    time: "25/11/2025 07:00 PM",
    inplay: false,
    odds: [
      { back: 1.55, lay: 1.6 },
      { back: 3.45, lay: 3.5 },
      { back: 2.1, lay: 2.15 },
    ],
  },
  {
    match: "England v Pakistan",
    time: "01/12/2025 03:00 PM",
    inplay: true,
    odds: [
      { back: 1.9, lay: 1.95 },
      { back: 3.1, lay: 3.15 },
      { back: 2.4, lay: 2.45 },
    ],
  },
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 1.42 },
      { back: 3.25, lay: 3.3 },
      { back: 1.88, lay: 1.92 },
    ],
  },
  {
    match: "India v Australia",
    time: "25/11/2025 07:00 PM",
    inplay: false,
    odds: [
      { back: 1.55, lay: 1.6 },
      { back: 3.45, lay: 3.5 },
      { back: 2.1, lay: 2.15 },
    ],
  },
  {
    match: "England v Pakistan",
    time: "01/12/2025 03:00 PM",
    inplay: true,
    odds: [
      { back: 1.9, lay: 1.95 },
      { back: 3.1, lay: 3.15 },
      { back: 2.4, lay: 2.45 },
    ],
  },
  {
    match: "India v South Africa",
    time: "23/11/2025 04:00 AM",
    inplay: true,
    odds: [
      { back: 1.37, lay: 1.42 },
      { back: 3.25, lay: 3.3 },
      { back: 1.88, lay: 1.92 },
    ],
  },
  {
    match: "India v Australia",
    time: "25/11/2025 07:00 PM",
    inplay: false,
    odds: [
      { back: 1.55, lay: 1.6 },
      { back: 3.45, lay: 3.5 },
      { back: 2.1, lay: 2.15 },
    ],
  },
  {
    match: "England v Pakistan",
    time: "01/12/2025 03:00 PM",
    inplay: true,
    odds: [
      { back: 1.9, lay: 1.95 },
      { back: 3.1, lay: 3.15 },
      { back: 2.4, lay: 2.45 },
    ],
  },
];

export const newsData = [
  {
    id: 1,
    title:
      "PAK vs SL, Tri-Series 2025: Sahibzada Farhan smashes career-best score as Pakistan trumps Sri Lanka",
    desc: `Sahibzada  
Sahibzada Farhan bludgeoned a career-best unbeaten 80 off 45 balls as Pakistan routed struggling Sri Lanka by seven wickets in the T20 Tri-series on Saturday.

Sri Lanka, which lost its opening game against Zimbabwe by 67 runs after getting bowled out for 95, was limited to 128 for seven after captain Dasun Shanaka won the toss and elected to bat.

Farhan’s blistering knock that featured five sixes and six boundaries sealed a second successive win for Pakistan in just 15.3 overs as the home team cruised to 131-3.

Sri Lanka’s white-ball tour to Pakistan saw it losing the ODI series 3-0 against the hosts, and its batters continued to struggle in the T20 format in the first two games of the tri-series.

“It was a complete game, we were very good with both bat and ball,” Pakistan captain Salman Ali Agha said. “We always wanted to start well, and he’s (Farhan) someone who if he bats for three to four overs, he can take the game away from any opposition.”

Kamil Mishara (22) got Sri Lanka going in the first three overs against the pace of Mohammad Wasim after Shaheen Shah Afridi was ruled out from Saturday’s game due to a foot injury.

But, Sri Lanka lost its way inside the power play when Mishara was deceived by a slower ball from Faheem Ashraf and holed out at mid-on and Kusal Mendis was run-out while going for a needless second run.

Left-arm spinner Mohammad Nawaz (3-16) and leg-spinner Abrar Ahmed (1-28) then squeezed Sri Lanka in the middle overs and picked up wickets with regular intervals as they slipped to 80-5 in 12 overs.

Nawaz struck off successive deliveries when he clean bowled Kusal Perera with a sharp turning delivery that spun back into the left-hander and then Shanaka couldn’t read another turning ball as his leg stump was knocked back by the left-armer.

Wasim picked up a smart juggling catch of Kamindu Mendis on the edge of the boundary at mid-wicket in Nawaz’s final over and Sri Lanka tailenders struggled to accelerate in the death overs against the pace.

Wasim and Mirza bowled to tight lengths and allowed Sri Lanka to score only 37 runs off the final five overs with Janith Liyanage showing some resistance by scoring unbeaten 41 off 38 balls.

RELATED | PAK vs SL Tri-series Match 3 Highlights

Farhan showed aggressive intent from the onset in the run chase and provided Pakistan a brisk start of 47 runs in five overs before Shanaka had Saim Ayub (20) stumped.

But Farhan didn’t hold back and dominated a 69-run stand off 52 balls with Babar Azam (16) by playing attractive shots on both sides of the wickets and raised his half century off 33 balls.

Fast bowler Dushmantha Chameera (2-29) got two late wickets when he uprooted the off stump of Babar and then had captain Salman Ali Agha trapped leg before wicket of a ball that caught the batter on the backfoot.

Farhan then finished off the game with a straight six of Malinga and also surpassed his previous best T20 score of 74.

“We aren’t a team that should perform like this, we’re better than this,” Shanaka said. “We feel very bad today ... since we arrived here we have struggled to find rhythm batting in these pitches. We need to work on that a bit, but I’m sure we’re a better team than this.”

Pakistan, which has won both its league games, next plays against Zimbabwe on Sunday. `,
    img: "http://market.mgmopr.com/api/trader/tips/images/82e77d3a-5468-474e-a667-6553151d6f6d.jpg",
  },
  {
    id: 2,
    title:
      "Premier League 2025-26: Barnes strikes twice as Newcastle edges Man City 2-1",
    desc: `Harvey Barnes scored two goals in seven minutes as his side snatched a thrilling 2-1 win over Manchester City.`,
    img: "http://market.mgmopr.com/api/trader/tips/images/82e77d3a-5468-474e-a667-6553151d6f6d.jpg",
  },
  {
    id: 3,
    title: "Davis Cup 2025: Spain beats Germany to set up final against Italy",
    desc: `Spain defeated Germany to qualify for the Davis Cup finals in an exciting match.`,
    img: "http://market.mgmopr.com/api/trader/tips/images/82e77d3a-5468-474e-a667-6553151d6f6d.jpg",
  },
];
export const sportsData = [
  {
    sport: "Cricket",
    key: "cricket",
    tournaments: [
      {
        title: "Abu Dhabi T10",
        key: "abuDhabi",
        matches: [
          "UAE Bulls v Aspin Stallions",
          "Deccan Gladiators v Ajman Titans",
          "Royal Champs v Aspin Stallions",
          "Vista Riders v Quetta Cavalry",
        ],
      },
      {
        title: "Falcons Champions Trophy",
        key: "falcons",
        matches: ["Kashmir XI v Afghan Tigers"],
      },
      {
        title: "Plunket Shield",
        key: "plunket",
        matches: ["Plunket"],
      },
      {
        title: "South Africa T20 Challenge",
        key: "saT20",
        matches: ["Lumbini Lions v Sudurpaschim Royals"],
      },
    ],
  },

  {
    sport: "Soccer",
    key: "soccer",
    tournaments: [
      {
        title: "Abu Dhabi T10",
        key: "abuDhabiFootball",
        matches: [
          "UAE Bulls v Northern Warriors",
          "Deccan Gladiators v Ajman Titans",
          "Royal Champs v Aspin Stallions",
          "Vista Riders v Quetta Cavalry",
        ],
      },
      {
        title: "Falcons Champions Trophy",
        key: "falconsFootball",
        matches: ["Kashmir XI v Afghan Tigers"],
      },
      {
        title: "International Twenty20 Matches",
        key: "int20",
        matches: [
          "Pakistan v Sri Lanka",
          "Bangladesh v Ireland",
          "Bahrain v Thailand",
        ],
      },
      {
        title: "Nepal Premier League",
        key: "nepalPL",
        matches: [
          "Lumbini Lions v Sudurpaschim Royals",
          "Janakpur Bolts v Pokhara Avengers",
          "Chitwan Rhinos v Kathmandu Gurkhas",
          "Karnali Yaks v Biratnagar Kings",
        ],
      },
      {
        title: "T10 League Internationals",
        key: "t10League",
        matches: ["T10"],
      },
      {
        title: "Plunket Shield",
        key: "plunketFootball",
        matches: ["Plunket"],
      },
      {
        title: "South Africa T20 Challenge",
        key: "saT20Football",
        matches: ["Lumbini Lions v Sudurpaschim Royals"],
      },
    ],
  },

  {
    sport: "Tennis",
    key: "tennis",
    tournaments: [
      {
        title: "Abu Dhabi T10",
        key: "abuDhabiTennis",
        matches: [
          "UAE Bulls v Northern Warriors",
          "Deccan Gladiators v Ajman Titans",
          "Royal Champs v Aspin Stallions",
          "Vista Riders v Quetta Cavalry",
        ],
      },
      {
        title: "Falcons Champions Trophy",
        key: "falconsTennis",
        matches: ["Kashmir XI v Afghan Tigers"],
      },
      {
        title: "International Twenty20 Matches",
        key: "int20Tennis",
        matches: [
          "Pakistan v Sri Lanka",
          "Bangladesh v Ireland",
          "Bahrain v Thailand",
        ],
      },
      {
        title: "Nepal Premier League",
        key: "nepalPLTennis",
        matches: [
          "Lumbini Lions v Sudurpaschim Royals",
          "Janakpur Bolts v Pokhara Avengers",
          "Chitwan Rhinos v Kathmandu Gurkhas",
          "Karnali Yaks v Biratnagar Kings",
        ],
      },
      {
        title: "T10 League Internationals",
        key: "t10Tennis",
        matches: ["T10"],
      },
      {
        title: "Plunket Shield",
        key: "plunketTennis",
        matches: ["Plunket"],
      },
      {
        title: "South Africa T20 Challenge",
        key: "saT20Tennis",
        matches: ["Lumbini Lions v Sudurpaschim Royals"],
      },
    ],
  },
];