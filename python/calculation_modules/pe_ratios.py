import requests
from bs4 import BeautifulSoup

def get_analyst_pe_ratio(tick):
    url = f'https://www.msn.com/en-us/money/stockdetails/analysis/fi-126.1.{tick}.NYS'

    analyst_pe_response = requests.get(url)
    html = BeautifulSoup(analyst_pe_response.content, 'html.parser')
    try:    
        high_pe_title = html.find('p', string='P/E Ratio 5-Year High')
        high_pe_num_element = high_pe_title.find_parent('ul').find_all('p', class_='truncated-string')[1]
        high_pe_num = float(high_pe_num_element.text.replace(',', ''))
        
        low_pe_title = html.find('p', string='P/E Ratio 5-Year Low')
        low_pe_num_element = low_pe_title.find_parent('ul').find_all('p', class_='truncated-string')[1]
        low_pe_num = float(low_pe_num_element.text.replace(',',''))

        nums = [high_pe_num, low_pe_num]

        return sum(nums) / len(nums)
    except: return 100