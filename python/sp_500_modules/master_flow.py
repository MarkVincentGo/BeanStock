# FLOW FOR OBTAINING S&P 500 INFORMATION
import json
from get_curr_pe import get_curr_pe, sort_data
from arr_to_dict import arr_to_dict

def get_sp_information():
    # get pe data from finnhub daily
    get_curr_pe(0,100)
    get_curr_pe(101,200)
    get_curr_pe(201,300)
    get_curr_pe(301,400)
    get_curr_pe(401,507)

    # sort data by pe
    sort_data(json.load(open('sp_500_w_pe.json', 'r', encoding='utf-8')))

    # convert to a dictionary and store in 'sp_data_sorted_by_pe_dict.json'
    arr_to_dict('sp_data_sorted_by_pe.json', 'sp_data_sorted_by_pe_dict.json')