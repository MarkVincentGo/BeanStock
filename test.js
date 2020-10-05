const axios = require('axios');
const cheerio = require('cheerio');

const findElementByTagNameAndReactId = ($, tagName, id) => {
  let target = null;
  $(tagName).each((_, el) => {
    if ($(el).data('reactid') == id) {
      target = el;
    }
  });
  return target != null ? $(target) : null;
};

const findElementByTagNameAndText = ($, tagName, text) => {
  let target = null;
  $(tagName).each((_, el) => {
    if ($(el).text() == text) {
      target = el;
    }
  });
  return target != null ? $(target) : null;
};

const findElementsByTextContent = ($, tagName, text) => {
  const target = [];
  $(tagName).each((_, el) => {
    if ($(el).text() === text) {
      $(el).siblings().each((i, sib) => {
        target.push($(sib).text());
      });
    }
  });
  return target;
};

const calculateGrowthRate = (present, past, years) => (((present / past) ** (1 / years)) - 1) * 100;

const processArrayOfElements = (arr, mapCb, filterCb) => {
  const newTarget = arr.map((el) => mapCb(el));
  return newTarget.filter((el) => filterCb(el));
};

const stringToNum = (el) => {
  let parsedNum = '';
  for (const char of el) {
    if (char !== ',' && char !== ' ' && char !== '%') parsedNum += char;
  }
  return parsedNum.length ? +parsedNum : null;
};

const calculateTenYrEPS = (TTMEPS, GrowthRate) => TTMEPS * ((1 + GrowthRate / 100) ** 10);

const searchTerm = 'TSLA';

const findFairPriceValue = (tick, targetAnnualGrowth, marginOfSafety) => {
  let targetNumbers = {
    TTMEPS: 0,
    GrowthRate: 0,
    FuturePERatio: 0,
  };

  axios.get(`https://finance.yahoo.com/quote/${tick}?p=${tick}&.tsrc=fin-srch`)
  // get twelve month EPS from yahoo
    .catch((err) => {
      console.error('Error getting TTMEPS:', err);
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const TTMEPS = findElementByTagNameAndReactId($, 'span', 154);
      targetNumbers = { ...targetNumbers, TTMEPS: +TTMEPS.text() };
      return axios.get(`https://www.wsj.com/market-data/quotes/${tick}/financials/annual/balance-sheet`);
    })

  // get Equity growth rate from wall street journal
    .catch((err) => {
      console.error('Error getting GrowthRate from WSJ:', err);
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const Equity5YearNP = findElementsByTextContent($, 'td', 'Total Equity');
      const Equity5YearP = processArrayOfElements(Equity5YearNP, stringToNum, (el) => typeof el === 'number');
      const GrowthRate = calculateGrowthRate(Equity5YearP[0], Equity5YearP[Equity5YearP.length - 1], Equity5YearP.length - 1);
      targetNumbers = { ...targetNumbers, GrowthRate };
      return axios.get(`https://finance.yahoo.com/quote/${tick}/analysis?p=${tick}`);
    })

  // get Analyst 5 year growth rate from yahoo finance
    .catch((err) => {
      console.error('Error getting GrowthRate from Yahoo:', err);
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const YahooGrowthRateNP = findElementsByTextContent($, 'td', 'Next 5 Years (per annum)');
      const YahooGrowthRateP = processArrayOfElements(YahooGrowthRateNP, stringToNum, (el) => typeof el === 'number')[0];
      if (YahooGrowthRateP < targetNumbers.GrowthRate) {
        targetNumbers = { ...targetNumbers, GrowthRate: YahooGrowthRateP };
      }
      return axios.get(`https://www.msn.com/en-us/money/stockdetails/analysis/fi-126.1.${tick}.NYS`);
    })

  // get future PE ratio from MSN Money
    .then((res) => {
      const $ = cheerio.load(res.data);
      const highPETitle = findElementByTagNameAndText($, 'p', 'P/E Ratio 5-Year High');
      const highPENumEl = highPETitle.parent().parent().next().children()[0].children[0];
      const highPENum = +$(highPENumEl).text();

      const lowPETitle = findElementByTagNameAndText($, 'p', 'P/E Ratio 5-Year Low');
      const lowPENumEl = lowPETitle.parent().parent().next().children()[0].children[0];
      const lowPENum = +$(lowPENumEl).text();

      const estFuturePE = (highPENum + lowPENum) / 2;

      targetNumbers = { ...targetNumbers, FuturePERatio: estFuturePE > targetNumbers.GrowthRate * 2 ? targetNumbers.GrowthRate * 2 : estFuturePE };
      console.log(targetNumbers);
      return targetNumbers;
    })
  // now everything is scraped... do further processing to get fair price
    .then(({ TTMEPS, GrowthRate, FuturePERatio }) => {
      const TenYearEPSEstimate = calculateTenYrEPS(TTMEPS, GrowthRate);
      const TenYearPriceEstimate = TenYearEPSEstimate * FuturePERatio;

      // Rule of 72 - how long will it take to double money with desired return? (in years)
      const yearsToDouble = 72 / targetAnnualGrowth;

      const doublesInTenYears = 10 / yearsToDouble;

      // we have x doubles in 10 years... so we half the price x times to get current price
      const fairPriceValue = TenYearPriceEstimate * ((1 / 2) ** doublesInTenYears);
      const priceWithMarginOfSafety = fairPriceValue * ((100 - marginOfSafety) / 100);
      console.log(priceWithMarginOfSafety);
    });
};

findFairPriceValue(searchTerm, 20, 50);
