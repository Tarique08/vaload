from __future__ import annotations
from typing import Any

def _find_player_team(players_data: dict | list, puuid: str) -> str | None:
    all_players: list[dict] = []
    if isinstance(players_data, dict):
        all_players = players_data.get('all_players', [])
        if not all_players:
            for team_key in ('red', 'blue'):
                all_players.extend(players_data.get(team_key, []))
    elif isinstance(players_data, list):
        all_players = players_data
    for p in all_players:
        if p.get('puuid') == puuid:
            return p.get('team', 'Unknown')
    return None

def _get_all_players_list(players_data: dict | list) -> list[dict]:
    if isinstance(players_data, list):
        return players_data
    if isinstance(players_data, dict):
        result = players_data.get('all_players', [])
        if not result:
            for team_key in ('red', 'blue'):
                result.extend(players_data.get(team_key, []))
        return result
    return []

def _team_puuids(players_data: dict | list, team: str) -> set[str]:
    return {p['puuid'] for p in _get_all_players_list(players_data) if p.get('team') == team}

def _get_round_kill_events(rnd: dict) -> list[dict]:
    kill_events = []
    player_stats = rnd.get('player_stats', [])
    for ps in player_stats:
        kill_events.extend(ps.get('kill_events', []))
    unique_kills = {}
    for event in kill_events:
        sig = (event.get('kill_time_in_round'), event.get('killer_puuid'), event.get('victim_puuid'))
        unique_kills[sig] = event
    return list(unique_kills.values())
_TRADE_WINDOW_MS = 3000

def compute_trade_window(matches: list[dict[str, Any]], puuid: str) -> dict[str, Any]:
    traded_deaths = 0
    untraded_deaths = 0
    trades_given = 0
    total_kills = 0
    total_deaths = 0
    per_match: list[dict[str, Any]] = []
    for match in matches:
        players = match.get('players', {})
        team = _find_player_team(players, puuid)
        teammates = _team_puuids(players, team) - {puuid} if team else set()
        rounds = match.get('rounds', [])
        m_traded = 0
        m_untraded = 0
        m_trades_given = 0
        m_kills = 0
        m_deaths = 0
        for rnd in rounds:
            kills: list[dict] = rnd.get('player_stats', [])
            kill_events: list[dict] = _get_round_kill_events(rnd)
            if not kill_events:
                continue
            kill_events_sorted = sorted(kill_events, key=lambda k: k.get('kill_time_in_round', 0))
            for idx, event in enumerate(kill_events_sorted):
                killer_puuid = event.get('killer_puuid', '')
                victim_puuid = event.get('victim_puuid', '')
                kill_time = event.get('kill_time_in_round', 0)
                if victim_puuid == puuid:
                    m_deaths += 1
                    enemy_killer = killer_puuid
                    was_traded = False
                    for future in kill_events_sorted[idx + 1:]:
                        future_time = future.get('kill_time_in_round', 0)
                        if future_time - kill_time > _TRADE_WINDOW_MS:
                            break
                        if future.get('killer_puuid') in teammates and future.get('victim_puuid') == enemy_killer:
                            was_traded = True
                            break
                    if was_traded:
                        m_traded += 1
                    else:
                        m_untraded += 1
                if killer_puuid == puuid:
                    m_kills += 1
                    for prev in reversed(kill_events_sorted[:idx]):
                        prev_time = prev.get('kill_time_in_round', 0)
                        if kill_time - prev_time > _TRADE_WINDOW_MS:
                            break
                        if prev.get('victim_puuid') in teammates and prev.get('killer_puuid') == victim_puuid:
                            m_trades_given += 1
                            break
        traded_deaths += m_traded
        untraded_deaths += m_untraded
        trades_given += m_trades_given
        total_kills += m_kills
        total_deaths += m_deaths
        per_match.append({'match_id': match.get('metadata', {}).get('matchid', ''), 'traded_deaths': m_traded, 'untraded_deaths': m_untraded, 'trades_given': m_trades_given})
    total_player_deaths = traded_deaths + untraded_deaths
    trade_rate = round(traded_deaths / total_player_deaths, 3) if total_player_deaths > 0 else 0.0
    if trade_rate >= 0.6:
        verdict = 'Space Creator'
    elif trade_rate < 0.3 and total_deaths > total_kills:
        verdict = 'Feeding'
    else:
        verdict = 'Passive Trader'
    return {'traded_deaths': traded_deaths, 'untraded_deaths': untraded_deaths, 'trade_rate': trade_rate, 'trades_given': trades_given, 'total_kills': total_kills, 'total_deaths': total_deaths, 'verdict': verdict, 'per_match': per_match}
_ECO_SAVE_THRESHOLD = 2000

def compute_eco_liability(matches: list[dict[str, Any]], puuid: str) -> dict[str, Any]:
    liable_rounds = 0
    total_rounds = 0
    wasted_credits = 0
    details: list[dict[str, Any]] = []
    for match in matches:
        players = match.get('players', {})
        team = _find_player_team(players, puuid)
        teammate_puuids = _team_puuids(players, team) if team else set()
        rounds = match.get('rounds', [])
        match_id = match.get('metadata', {}).get('matchid', '')
        for rnd_idx, rnd in enumerate(rounds):
            total_rounds += 1
            player_stats: list[dict] = rnd.get('player_stats', [])
            winning_team = rnd.get('winning_team', '')
            team_loadouts: list[int] = []
            player_loadout: int | None = None
            for ps in player_stats:
                ps_puuid = ps.get('player_puuid', '')
                economy = ps.get('economy', {})
                loadout = economy.get('loadout_value', 0)
                if ps_puuid in teammate_puuids:
                    team_loadouts.append(loadout)
                if ps_puuid == puuid:
                    player_loadout = loadout
            if player_loadout is None or not team_loadouts:
                continue
            team_avg = sum(team_loadouts) / len(team_loadouts)
            round_lost = winning_team.lower() != (team or '').lower()
            if team_avg < _ECO_SAVE_THRESHOLD and player_loadout > team_avg * 1.3 and round_lost:
                waste = int(player_loadout - team_avg)
                liable_rounds += 1
                wasted_credits += waste
                details.append({'match_id': match_id, 'round': rnd_idx + 1, 'player_loadout': player_loadout, 'team_avg_loadout': round(team_avg), 'wasted': waste})
    liability_rate = round(liable_rounds / total_rounds, 3) if total_rounds > 0 else 0.0
    return {'liable_rounds': liable_rounds, 'total_rounds': total_rounds, 'wasted_credits': wasted_credits, 'liability_rate': liability_rate, 'liable_round_details': details}

def compute_solo_clutcher(matches: list[dict[str, Any]], puuid: str) -> dict[str, Any]:
    clutch_situations = 0
    clutch_wins = 0
    clutch_losses = 0
    details: list[dict[str, Any]] = []
    for match in matches:
        players = match.get('players', {})
        team = _find_player_team(players, puuid)
        teammate_puuids = _team_puuids(players, team) - {puuid} if team else set()
        rounds = match.get('rounds', [])
        match_id = match.get('metadata', {}).get('matchid', '')
        for rnd_idx, rnd in enumerate(rounds):
            kill_events: list[dict] = _get_round_kill_events(rnd)
            if not kill_events:
                continue
            alive_teammates = set(teammate_puuids)
            player_alive = True
            kill_events_sorted = sorted(kill_events, key=lambda k: k.get('kill_time_in_round', 0))
            last_alive_detected = False
            for event in kill_events_sorted:
                victim = event.get('victim_puuid', '')
                if victim == puuid:
                    player_alive = False
                    break
                if victim in alive_teammates:
                    alive_teammates.discard(victim)
                if len(alive_teammates) == 0 and player_alive:
                    last_alive_detected = True
            if last_alive_detected and player_alive:
                clutch_situations += 1
                winning_team = rnd.get('winning_team', '')
                won = winning_team.lower() == (team or '').lower()
                if won:
                    clutch_wins += 1
                else:
                    clutch_losses += 1
                details.append({'match_id': match_id, 'round': rnd_idx + 1, 'result': 'win' if won else 'loss'})
    clutch_rate = round(clutch_wins / clutch_situations, 3) if clutch_situations > 0 else 0.0
    return {'clutch_situations': clutch_situations, 'clutch_wins': clutch_wins, 'clutch_losses': clutch_losses, 'clutch_rate': clutch_rate, 'details': details}

def _get_side(team: str | None, rnd_idx: int) -> str:
    half_index = rnd_idx // 12
    is_swapped = half_index % 2 == 1
    if team and team.lower() == 'red':
        return 'defense' if is_swapped else 'attack'
    return 'attack' if is_swapped else 'defense'

def compute_engagement_heatmap(matches: list[dict[str, Any]], puuid: str) -> dict[str, Any]:
    per_match: list[dict[str, Any]] = []
    total_kills = 0
    total_deaths = 0
    for match in matches:
        match_id = match.get('metadata', {}).get('matchid', '')
        map_name = match.get('metadata', {}).get('map', 'Unknown')
        players = match.get('players', {})
        team = _find_player_team(players, puuid)
        kills: list[dict[str, Any]] = []
        deaths: list[dict[str, Any]] = []
        rounds = match.get('rounds', [])
        for rnd_idx, rnd in enumerate(rounds):
            side = _get_side(team, rnd_idx)
            kill_events: list[dict] = _get_round_kill_events(rnd)
            for event in kill_events:
                killer_puuid = event.get('killer_puuid', '')
                victim_puuid = event.get('victim_puuid', '')
                locations = event.get('player_locations_on_kill', [])
                if killer_puuid == puuid:
                    for loc in locations:
                        if loc.get('player_puuid') == puuid:
                            pos = loc.get('location', {})
                            kills.append({'x': pos.get('x', 0), 'y': pos.get('y', 0), 'side': side})
                            break
                if victim_puuid == puuid:
                    victim_loc = event.get('victim_death_location', {})
                    if victim_loc:
                        deaths.append({'x': victim_loc.get('x', 0), 'y': victim_loc.get('y', 0), 'side': side})
                    else:
                        for loc in locations:
                            if loc.get('player_puuid') == killer_puuid:
                                pos = loc.get('location', {})
                                deaths.append({'x': pos.get('x', 0), 'y': pos.get('y', 0), 'side': side})
                                break
        total_kills += len(kills)
        total_deaths += len(deaths)
        per_match.append({'match_id': match_id, 'map': map_name, 'kills': kills, 'deaths': deaths})
    return {'matches': per_match, 'total_kill_coords': total_kills, 'total_death_coords': total_deaths}

def compute_first_blood_velocity(matches: list[dict[str, Any]], puuid: str) -> dict[str, Any]:
    first_kills = 0
    first_deaths = 0
    total_rounds_with_data = 0
    first_event_times: list[int] = []
    per_round: list[dict[str, Any]] = []
    for match in matches:
        match_id = match.get('metadata', {}).get('matchid', '')
        rounds = match.get('rounds', [])
        for rnd_idx, rnd in enumerate(rounds):
            kill_events: list[dict] = _get_round_kill_events(rnd)
            if not kill_events:
                continue
            first_event = min(kill_events, key=lambda k: k.get('kill_time_in_round', float('inf')))
            event_time = first_event.get('kill_time_in_round', 0)
            killer = first_event.get('killer_puuid', '')
            victim = first_event.get('victim_puuid', '')
            involved = False
            role: str | None = None
            if killer == puuid:
                first_kills += 1
                involved = True
                role = 'first_kill'
            elif victim == puuid:
                first_deaths += 1
                involved = True
                role = 'first_death'
            if involved:
                first_event_times.append(event_time)
                total_rounds_with_data += 1
                per_round.append({'match_id': match_id, 'round': rnd_idx + 1, 'role': role, 'time_ms': event_time})
    avg_time_ms = round(sum(first_event_times) / len(first_event_times)) if first_event_times else 0
    avg_time_s = avg_time_ms / 1000
    total_fb = first_kills + first_deaths
    first_kill_rate = round(first_kills / total_fb, 3) if total_fb > 0 else 0.0
    first_death_rate = round(first_deaths / total_fb, 3) if total_fb > 0 else 0.0
    if avg_time_s < 15 and first_kill_rate > 0.4:
        verdict = 'Hyper-Aggressive'
    elif avg_time_s > 45 or first_death_rate > first_kill_rate:
        verdict = 'Passive Anchor'
    else:
        verdict = 'Methodical'
    return {'first_kills': first_kills, 'first_deaths': first_deaths, 'avg_first_event_time_ms': avg_time_ms, 'first_kill_rate': first_kill_rate, 'first_death_rate': first_death_rate, 'verdict': verdict, 'per_round': per_round}

def compute_all_metrics(matches_data: list[dict[str, Any]], puuid: str) -> dict[str, Any]:
    return {'puuid': puuid, 'matches_analyzed': len(matches_data), 'trade_window': compute_trade_window(matches_data, puuid), 'eco_liability': compute_eco_liability(matches_data, puuid), 'solo_clutcher': compute_solo_clutcher(matches_data, puuid), 'engagement_heatmap': compute_engagement_heatmap(matches_data, puuid), 'first_blood_velocity': compute_first_blood_velocity(matches_data, puuid)}