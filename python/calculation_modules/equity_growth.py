import requests
from bs4 import BeautifulSoup

def find_WSJ_equity_growth(tick):
    url = f'https://www.wsj.com/market-data/quotes/{tick}/financials/annual/balance-sheet'

    equity_growth_response = requests.get(url, headers={'User-Agent': 'Custom'})
    html = BeautifulSoup(equity_growth_response.content, 'html.parser')

    result = html.find('td', string='Total Equity')
    numbers = result.find_next_siblings('td')

    target = []
    for tag in numbers:
        target.append(tag.text)
 

    target_processed = get_equity_growth_rate(target, string_to_num, lambda el: type(el) == float)
    
    growth_rate_4_years = calculate_growth_rate(target_processed[0], target_processed[-1], len(target_processed) - 1)
    growth_rate_3_years = calculate_growth_rate(target_processed[0], target_processed[-2], len(target_processed) - 2)
    growth_rate_2_years = calculate_growth_rate(target_processed[0], target_processed[-3], len(target_processed) - 3)

    return max(growth_rate_2_years, growth_rate_3_years, growth_rate_4_years)


def get_equity_growth_rate(set, map_cb, filter_cb):
    new_target = list(map(lambda el: map_cb(el), set))
    return list(filter(lambda el: filter_cb(el), new_target))


def string_to_num(str):
    parsed_num = ''
    if str == 'N/A':
        return None

    for char in str:
        if char != ',' and char != ' ' and char != '%':
            parsed_num += char

    return float(parsed_num) if len(parsed_num) != 0 else None


def calculate_growth_rate(present, past, years):
    return (((present / past) ** (1 / years)) - 1) * 100 


def find_analyst_growth_rate(tick):
    url = f'https://finance.yahoo.com/quote/{tick}/analysis?p={tick}'

    equity_growth_response = requests.get(url)
    html = BeautifulSoup(equity_growth_response.content, 'html.parser')
    field = html.find('td', string='Next 5 Years (per annum)')

    numbers_in_field = field.find_next_siblings('td')
    growth_rate_unprocessed = []
    for tag in numbers_in_field:
        growth_rate_unprocessed.append(tag.text)

    growth_rate = get_equity_growth_rate(growth_rate_unprocessed, string_to_num, lambda el: type(el) == float)[0]
    return growth_rate

