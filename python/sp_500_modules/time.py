import schedule
import time
import requests
from bs4 import BeautifulSoup



def job(tick):
    TTM_EPS_response = requests.get(f'https://finance.yahoo.com/quote/{tick}?p={tick}&.tsrc=fin-srch')

    html = BeautifulSoup(TTM_EPS_response.content, 'html.parser')
    result = html.find('span', attrs={'data-reactid': '50'})

    TTM_EPS = result.text
    print(TTM_EPS)
    return


schedule.every(3).minutes.do(job, 'AMZN')

while True:
    schedule.run_pending()