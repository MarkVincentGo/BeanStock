import requests
from bs4 import BeautifulSoup

def find_TTM_EPS(tick):
    TTM_EPS_response = requests.get(f'https://finance.yahoo.com/quote/{tick}?p={tick}&.tsrc=fin-srch')

    html = BeautifulSoup(TTM_EPS_response.content, 'html.parser')
    try:
        result = html.find(attrs={'data-reactid': '154'})

        if result.text == 'N/A':
            new_response = requests.get(f'https://www.wsj.com/market-data/quotes/{tick}/')
            html = BeautifulSoup(new_response.content, 'html.parser')
            eps_field = html.find('h5', class_='data_data', string='EPS (TTM)')
            result = eps_field.next_sibling


        TTM_EPS = float(result.text)
        return TTM_EPS
    except: return 0