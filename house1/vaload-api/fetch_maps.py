import httpx, json

r = httpx.get("https://valorant-api.com/v1/maps")
maps = r.json()["data"]

for m in maps:
    if m.get("xMultiplier"):
        name = m["displayName"]
        xMul = m["xMultiplier"]
        xAdd = m["xScalarToAdd"]
        yMul = m["yMultiplier"]
        yAdd = m["yScalarToAdd"]
        print(f"{name}: xMul={xMul}, xAdd={xAdd}, yMul={yMul}, yAdd={yAdd}")
