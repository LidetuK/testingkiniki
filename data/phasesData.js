const phaseAmountsData = [
  "10,000",
  "25,000",
  "50,000",
  "100,000",
  "200,000",
  "400,000",
];

const phaseOnePrices = ["95", "149", "290", "477", "930", "1650"];
const phaseTwoPrices = ["60", "99", "249", "449", "899", "1499"];
const instantFundedPrices = ["150", "299", "499", "650", "1700", "3000"];
const purchasePriceListData = {
  phaseOne: phaseOnePrices,
  phaseTwo: phaseTwoPrices,
  instantFunded: instantFundedPrices,
};

const sliderStepsData = Math.floor(100 / phaseAmountsData.length);

const accountSizeListData = [
  {
    id: "1",
    content: phaseAmountsData[0],
    phaseOnePrice: phaseOnePrices[0],
    phaseTwoPrice: phaseTwoPrices[0],
    instantFundedPrice: instantFundedPrices[0],
  },
  {
    id: "2",
    content: phaseAmountsData[1],
    phaseOnePrice: phaseOnePrices[1],
    phaseTwoPrice: phaseTwoPrices[1],
    instantFundedPrice: instantFundedPrices[1],
  },
  {
    id: "3",
    content: phaseAmountsData[2],
    phaseOnePrice: phaseOnePrices[2],
    phaseTwoPrice: phaseTwoPrices[2],
    instantFundedPrice: instantFundedPrices[2],
  },
  {
    id: "4",
    content: phaseAmountsData[3],
    phaseOnePrice: phaseOnePrices[3],
    phaseTwoPrice: phaseTwoPrices[3],
    instantFundedPrice: instantFundedPrices[3],
  },
  {
    id: "5",
    content: phaseAmountsData[4],
    phaseOnePrice: phaseOnePrices[4],
    phaseTwoPrice: phaseTwoPrices[4],
    instantFundedPrice: instantFundedPrices[4],
  },
  {
    id: "6",
    content: phaseAmountsData[5],
    phaseOnePrice: phaseOnePrices[5],
    phaseTwoPrice: phaseTwoPrices[5],
    instantFundedPrice: instantFundedPrices[5],
  },
];

const accountTitlesData = {
  onePhase: "One Phase",
  twoPhase: "Two Phase",
  instantFunded: "Instant Funded",
};

const databasePhaseTitlesData = {
  onePhase: "one-phase-funding",
  twoPhase: "two-phase-funding",
  instantFunded: "instant-funding",
};

export {
  phaseAmountsData,
  purchasePriceListData,
  sliderStepsData,
  accountSizeListData,
  accountTitlesData,
  databasePhaseTitlesData,
};
