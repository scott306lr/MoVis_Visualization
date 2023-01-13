
import request
import json

f = open('secret.json')
j = json.load(f)

print(j)

headers = {
    'content-type': "application/json;charset=utf-8",
    'authorization': j['API_TOKEN']
}
