"""Inspect kill_events structure from a player who actually got kills."""
import httpx
import json

with open(".env") as f:
    for line in f:
        if line.startswith("HENRIK_API_KEY="):
            api_key = line.split("=", 1)[1].strip()
            break

r = httpx.get(
    "https://api.henrikdev.xyz/valorant/v3/matches/ap/code0ne/Trq4",
    params={"size": "1", "mode": "competitive"},
    headers={"Authorization": api_key},
    timeout=20,
)

data = r.json()
match = data["data"][0]

# Find a round+player with actual kill events
for rnd_idx, rnd in enumerate(match["rounds"]):
    for ps in rnd["player_stats"]:
        ke = ps.get("kill_events", [])
        if ke:
            print(f"Round {rnd_idx+1}, Player: {ps['player_display_name']}")
            print(f"  kill_events count: {len(ke)}")
            print(f"  KEYS: {list(ke[0].keys())}")
            print(f"  FULL EVENT:")
            print(json.dumps(ke[0], indent=2))
            raise SystemExit(0)

print("No kill events found in any round!")
