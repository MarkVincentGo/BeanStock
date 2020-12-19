import requests
from bs4 import BeautifulSoup

def find_WSJ_equity_growth(tick):
    url = f'https://quickfs.net/company/{tick}:US'


    page_response = requests.get(url, headers={'User-Agent': 'Custom'})
    html = BeautifulSoup(page_response.content, 'html.parser')

    print(html)

    # result = html.find('td', string='Total Equity')
    # numbers = result.find_next_siblings('td')

    # target = []
    # for tag in numbers:
    #     target.append(tag.text)
 

    # target_processed = get_equity_growth_rate(target, string_to_num, lambda el: type(el) == float)
    
    # growth_rate_4_years = calculate_growth_rate(target_processed[0], target_processed[-1], len(target_processed) - 1)
    # growth_rate_3_years = calculate_growth_rate(target_processed[0], target_processed[-2], len(target_processed) - 2)
    # growth_rate_2_years = calculate_growth_rate(target_processed[0], target_processed[-3], len(target_processed) - 3)

    # return max(growth_rate_2_years, growth_rate_3_years, growth_rate_4_years)

find_WSJ_equity_growth('AAPL')