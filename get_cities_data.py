import json
import requests

states_file = "/home/ubuntu/site_pizza_modificado/estados.json"
cities_output_file = "/home/ubuntu/site_pizza_modificado/estados_cidades.json"

with open(states_file, "r", encoding="utf-8") as f:
    states = json.load(f)

all_data = []

for state in states:
    state_uf = state["sigla"]
    state_name = state["nome"]
    print(f"Fetching cities for {state_name} ({state_uf})...")
    cities_url = f"https://servicodados.ibge.gov.br/api/v1/localidades/estados/{state_uf}/municipios"
    response = requests.get(cities_url)
    if response.status_code == 200:
        cities_data = response.json()
        city_names = [city["nome"] for city in cities_data]
        all_data.append({
            "uf": state_uf,
            "nomeEstado": state_name,
            "cidades": city_names
        })
    else:
        print(f"Error fetching cities for {state_uf}: {response.status_code}")

with open(cities_output_file, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)

print(f"Data saved to {cities_output_file}")


