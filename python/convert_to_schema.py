from calculate_fair_price import find_fair_price
import json
import time


def read_from_dataset(dic, tick):
    return dic[tick]



def convert_all(arr):
    profiles = json.loads(open('./sp500modules/sp_500_profiles_dict.json', 'r', encoding='utf-8').read())
    financials = json.loads(open('./sp500modules/sp_data_sorted_by_pe_dict.json', 'r', encoding='utf-8').read())

    output_list = []
    output_file = open('master_data_file.json', 'a', encoding='utf-8')
    counter = 1

    for tick in arr:
        try:
            tick = tick.strip()
            print(counter)
            if tick != 'BRK.A' and tick != 'BRKB' and tick != 'BFB' and tick != 'GOOG':
                processed = find_fair_price(tick)
                profile = read_from_dataset(profiles, tick)
                financial = read_from_dataset(financials, tick)
                
                fields = {
                    "name": profile['name'],
                    "tick": tick,
                    "ten_year_price": processed['ten_year_price'],
                    "growth_rate_wsj": processed['equity_growth_WSJ'],
                    "growth_rate_yahoo": processed['equity_growth_YF'],
                    "pe_ratio": financial['peNormalizedAnnual'],
                    "website": profile['weburl'],
                    "ttm_eps": processed['TTM_EPS'],
                    "future_pe_ratio_calculated": processed['calc_pe'],
                    "future_pe_ratio_analyst": processed['msn_pe'],
                    "sp_500": True,
                    "dow_jones": False,
                    "nasdaq_composite": False,
                    "russell_2000": False,
                    "sector": profile['finnhubIndustry']
                }

                db_format = {
                    "model": 'stocks.company',
                    "fields": fields
                }

                output_list.append(db_format)

                counter += 1
                time.sleep(1)
        except: 
            counter += 1
            time.sleep(1)
            continue

    output_file.write(json.dumps(output_list, indent=4))
    return 





# convert_all(open('./sp500modules/sp_500.txt'))

def modify_pe():
    f = open('./master_data_file.json', 'r').read()
    financials = json.loads(open('./sp500modules/sp_data_sorted_by_pe_dict.json', 'r', encoding='utf-8').read())
    the_json = json.loads(f)
    for i in the_json:
        i['fields']['ten_year_price'] = round(i['fields']['ten_year_price'], 2)
        i['fields']['growth_rate_wsj'] = round(i['fields']['growth_rate_wsj'], 2)
        i['fields']['growth_rate_yahoo'] = round(i['fields']['growth_rate_yahoo'], 2)
        i['fields']['future_pe_ratio_calculated'] = round(i['fields']['future_pe_ratio_calculated'], 2)
        i['fields']['future_pe_ratio_analyst'] = round(i['fields']['future_pe_ratio_analyst'], 2)

        if i['fields']['pe_ratio'] == None:
            comp_data = read_from_dataset(financials, i['fields']['tick'])
            if comp_data['peBasicExclExtraTTM'] != None:
                i['fields']['pe_ratio'] = comp_data['peBasicExclExtraTTM']
            elif comp_data['peExclExtraAnnual'] != None:
                i['fields']['pe_ratio'] = comp_data['peExclExtraAnnual']
            elif comp_data['peExclLowTTM'] != None:
                i['fields']['pe_ratio'] = comp_data['peExclLowTTM']
            elif comp_data['peInclExtraTTM'] != None:
                i['fields']['pe_ratio'] = comp_data['peInclExtraTTM']
            elif comp_data['peExclExtraHighTTM'] != None:
                i['fields']['pe_ratio'] = comp_data['peExclExtraHighTTM']
            elif comp_data['peExclExtraTTM'] != None:
                i['fields']['pe_ratio'] = comp_data['peExclExtraTTM']
            else: 
                i['fields']['pe_ratio'] = 0
            
    w = open('./master_data_file_fixed.json', 'w')
    w.write(json.dumps(the_json, indent=4))

modify_pe()


