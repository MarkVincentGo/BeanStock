
# when the request is made to the resolver, use this function to calculate data based on user input
def process_data(ttm_eps, growth_rate, future_pe_ratio, desiredReturn, margin_of_safety):
    ten_year_eps_estimate = calculate_x_year_eps(ttm_eps, growth_rate, 10)
    ten_year_price_estimate = ten_year_eps_estimate * future_pe_ratio

    # rule of 72 -> how long it takes to double with deisred return
    years_to_double = 72 / desiredReturn
    doubles_in_ten_years = 10 / years_to_double


    # x doubles in 10 years -> half 10 year price estimate to get current fair price
    fair_price_value = ten_year_price_estimate * ((1 / 2) ** doubles_in_ten_years)
    price_with_margin_of_safety = fair_price_value * ((100 - margin_of_safety) / 100)
    return ten_year_price_estimate, price_with_margin_of_safety, fair_price_value


def calculate_x_year_eps(ttm_eps, growth_rate, years):
    return ttm_eps * ((1 + growth_rate / 100) ** years)