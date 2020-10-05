import requests
from bs4 import BeautifulSoup
import time
import finnhub
import json

finnhub_client = finnhub.Client('bspbelvrh5r8ktikede0')

def get_curr_pe():
    f = open('sp_500_w_pe.json', 'a', encoding='utf-8')
    arr = []
    data = []

    with open('sp_500.txt') as file:
        for line in file:
            # pe_tuples.append((line, get_pe_from_site(line.strip())))
            arr.append(line.strip())
    
    for i in range(401,506):
        print(i)
        one_stock_data = use_finnhub(arr[i])
        data.append((one_stock_data['symbol'], one_stock_data['metric']))
        time.sleep(3)

    f.write(json.dumps(data, indent=4))
    f.close()



def use_finnhub(tick): 
   return finnhub_client.company_basic_financials(tick, 'all')

def get_company_profile():
    f = open('sp_500_profiles.json', 'a', encoding='utf-8')
    arr = []
    data = []

    with open('sp_500.txt') as file:
        for line in file:
            # pe_tuples.append((line, get_pe_from_site(line.strip())))
            arr.append(line.strip())
    
    for i in range(400,507):
        print(i)
        one_stock_data = finnhub_client.company_profile2(symbol=arr[i])
        data.append((arr[i].strip(), one_stock_data))
        time.sleep(3)

    f.write(json.dumps(data, indent=4))
    f.close()


def get_pe_from_site(tick):
    response = requests.get(f'https://finance.yahoo.com/quote/{tick}?p={tick}&.tsrc=fin-srch')

    html = BeautifulSoup(response.content, 'html.parser')
    result = html.find('span', attrs={'data-reactid': '149'}, class_='Trsdu(0.3s)')
    print(tick, result)
    if (result == None or result.text == 'N/A' or result.text == 'Earnings Date'):
        pe = float(0)
    else:
        pe = float(result.text)
    return pe

def sort_data(arr):
    arr.sort(key=lambda e: (e[1]['peNormalizedAnnual'] if e[1]['peNormalizedAnnual'] != None else 0) if 'peNormalizedAnnual'in e[1].keys() else 0)
    f = open('sp_data_sorted_by_pe.json', 'a')
    f.write(json.dumps(arr, indent=4))
    f.close()
    
get_company_profile()


