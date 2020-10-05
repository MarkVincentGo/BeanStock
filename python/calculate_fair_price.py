from ttm_eps import find_TTM_EPS
from equity_growth import find_WSJ_equity_growth, find_analyst_growth_rate
from pe_ratios import get_analyst_pe_ratio
from process_data import process_data


def find_fair_price(tick, target_annual_growth = 15, margin_of_safety = 50):
    """
        (tick, target_annual_growth, margin_of_safety) 
                            => 
        ten_year_price, equity_growth_wsj, equity_growth_yf, TTMEPS
    """

    target_numbers = {}
    # TTM EPS block request
    TTM_EPS = find_TTM_EPS(tick)
    target_numbers['TTM_EPS'] = TTM_EPS

    # Equity Growth Rate block request
    equity_growth_WSJ = find_WSJ_equity_growth(tick)
    target_numbers['growth_rate'] = equity_growth_WSJ

    # Yahoo Finance analyst growth rate block request
    equity_growth_YF = find_analyst_growth_rate(tick)
    if equity_growth_YF < target_numbers['growth_rate']:
        target_numbers['growth_rate'] = equity_growth_YF

    # MSN Money analyst PE ratio
    analyst_pe_msn = get_analyst_pe_ratio(tick)
    target_numbers['pe_ratio'] = analyst_pe_msn if analyst_pe_msn < target_numbers['growth_rate'] * 2 else target_numbers['growth_rate'] * 2

    # Process the data from the requests
    ten_year_price, mos_price, fair_price = process_data(
        target_numbers['TTM_EPS'],
        target_numbers['growth_rate'],
        target_numbers['pe_ratio'],
        target_annual_growth,
        margin_of_safety
    )
    return {
        'ten_year_price': ten_year_price, 
        'equity_growth_WSJ': equity_growth_WSJ, 
        'equity_growth_YF': equity_growth_YF,
        'TTM_EPS': TTM_EPS,
        'mos_price': mos_price,
        'fair_price': fair_price,
        'msn_pe': analyst_pe_msn,
        'calc_pe': target_numbers['growth_rate'] * 2
        }

# ten year price, ttm eps, future pe ratios, s

print(find_fair_price('TSLA', 20, 70))