import json


def arr_to_dict(arr_file, dict_file):
    a = open(arr_file, 'r', encoding='utf-8').read()
    b = open(dict_file, 'a', encoding='utf-8')
    
    a_json = json.loads(a)

    data = {}

    for a_el in a_json:
        data[a_el[0]] = a_el[1]
    
    b.write(json.dumps(data, indent=4))
    b.close()

arr_to_dict('sp_data_sorted_by_pe.json', 'sp_data_sorted_by_pe_dict.json')
arr_to_dict('sp_500_profiles.json', 'sp_500_profiles_dict.json')
