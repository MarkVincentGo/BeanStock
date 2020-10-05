
import requests
from bs4 import BeautifulSoup

f = open('sp_500.txt', 'a')

def get_list():
    resp = requests.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')

    html = BeautifulSoup(resp.content, 'html.parser')
    results = html.find_all('a', attrs={'rel': 'nofollow'}, class_='external text')
    
    for result in results:
        if len(result.text) <= 5:
            if result.text == 'BRK.B':
                f.write('BRKB\n')
            elif(result.text == 'BF.B'):
                f.write('BFB\n')
            else:
                f.write(result.text + '\n')

get_list()

f.close()