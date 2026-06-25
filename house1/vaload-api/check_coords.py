import httpx

r = httpx.get('http://127.0.0.1:8000/api/v1/metrics/ap/code0ne/Trq4')
d = r.json()['engagement_heatmap']
print(d['matches'][0]['kills'][0])
