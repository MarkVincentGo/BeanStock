
export const calculateFairValue = ( tenYearPrice: number, desiredReturn: number ): number => {
  const yearsToDouble: number = 72 / desiredReturn
  const doublesInTenYears: number = 10 / yearsToDouble

  return tenYearPrice * ((1 / 2) ** doublesInTenYears)
}


export const calculateMOSValue = ( fairPriceValue: number, mosDesired: number ): number => {
  return (fairPriceValue * ((100 - mosDesired) / 100))
}