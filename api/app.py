from flask import Flask, request, jsonify,  render_template, send_from_directory
from flask_cors import CORS
import joblib
import math

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import pandas as pd
from sklearn.linear_model import LogisticRegression

from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.endpoints import TeamDashboardByGeneralSplits

app = Flask(__name__)
CORS(app)

def probability(team1, team2, avg_table, lr):
    
    home_stats = []
    away_stats = []

    for row in avg_table:
        cols = row.find_all("td")
        team = cols[0].text
        team = team.split('*')[0]

        if (team == team1):
            home_stats = [cols[21].text, cols[18].text, cols[19].text, cols[20].text, cols[15].text, cols[8].text]
        if (team == team2):
            away_stats = [cols[21].text, cols[18].text, cols[19].text, cols[20].text, cols[15].text, cols[8].text]

    df = pd.DataFrame({'TOV': home_stats[0], 'AST': home_stats[1], 'STL': home_stats[2], 'BLK': home_stats[3], 'OREB': home_stats[4], 'FG3_PCT': home_stats[5],
                        'OPP_TOV': away_stats[0], 'OPP_OREB': away_stats[4], 'OPP_AST': away_stats[1], 'OPP_STL': away_stats[2], 'OPP_FG3_PCT': away_stats[5], 'OPP_BLK': away_stats[3]}, index=[1])

    proba = lr.predict_proba(df)

    print(proba)
    return proba[0][0], proba[0][1]

@app.route('/', methods=['GET'])
def get_games():
    lr = joblib.load('logistic_regression.pkl')
    today = datetime.now().date()
    print("Running route / ")

    day_of_week = today.weekday()

    teams = {'Atlanta Hawks': 'ATL', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN', 'Charlotte Hornets': 'CHA', 
         'Chicago Bulls': 'CHI', 'Cleveland Cavaliers': 'CLE', 'Dallas Mavericks': 'DAL', 'Denver Nuggets': 'DEN', 
         'Detroit Pistons': 'DET', 'Golden State Warriors': 'GSW', 'Houston Rockets': 'HOU', 'Indiana Pacers': 'IND', 
         'Los Angeles Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'Memphis Grizzlies': 'MEM', 'Miami Heat': 'MIA', 
         'Milwaukee Bucks': 'MIL', 'Minnesota Timberwolves': 'MIN', 'New Orleans Pelicans': 'NOP', 
         'New York Knicks': 'NYK', 'Oklahoma City Thunder': 'OKC', 'Orlando Magic': 'ORL', 'Philadelphia 76ers': 'PHI', 
         'Phoenix Suns': 'PHX', 'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC', 'San Antonio Spurs': 'SAS', 
         'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTA', 'Washington Wizards': 'WAS'}


    month_dict = {'01': 'january', '02': 'february', '03': 'march', '04': 'april', '05': 'may', '06': 'june', 
                '07': 'july', '08': 'august', '09': 'september', '10': 'october', '11': 'november', '12': 'december'}

    month_dict_abv = {'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', 
                '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'}

    day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    day_name = day_names[day_of_week]


    year, month, day = str(today).split('-')

    prev_year = year
    prev_month = int(month) - 1

    if (prev_month < 10):
        prev_month = "0" + str(prev_month)

    prev_month = str(prev_month)

    month_name = month_dict[month]
    month_abv = month_dict_abv[month]

    prev_month_name = month_dict[prev_month]
    prev_month_abv = month_dict_abv[prev_month]


    full = "{}, {} {}, {}".format(day_name, month_abv, day, year)

    if int(month) > 9:
        year = int(year) + 1

    if int(month) == 1:
        prev_year -= 1

    url = 'https://www.basketball-reference.com/leagues/NBA_{}_games-{}.html'.format(year, month_name)
    url2 = 'https://www.basketball-reference.com/leagues/NBA_{}_games-{}.html'.format(prev_year, prev_month_name)

    response = requests.get(url)
    response2 = requests.get(url2)

    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find('table', id='schedule')

    soup2 = BeautifulSoup(response2.content, 'html.parser')
    table2 = soup2.find('table', id='schedule')

    # Average Team Stats (
    url1 = f"https://www.basketball-reference.com/leagues/NBA_2023.html"
    response1 = requests.get(url1)
    soup1 = BeautifulSoup(response1.content, "html.parser")

    team_stats_table = soup1.find("table", id="per_game-team")
    avg_table = team_stats_table.tbody.find_all("tr")
    # )

    upcoming_games = []
    today_games = []
    past_games = []

    # Upcoming Games and Today Games
    count_games = 0
    print(table)
    for row in table.find_all('tr')[1:]:
        if len(row.find_all('th')) > 1:
            continue
        if count_games == 50:
            break

        date = row.find_all('th')[0].text

        days = date.split(',')[1].split()[1]

        weekday, month_and_day, year = date.split(',')
        month_and_day = month_and_day.lstrip()
        year = year.rstrip()
        date = "{},{}".format(month_and_day, year)


        cols = row.find_all('td')

        team2_win_chance, team1_win_chance = probability(cols[1].text, cols[3].text, avg_table, lr)

        if (team2_win_chance > team1_win_chance):
            team2_win_chance = team2_win_chance * 100
            team2_win_chance = math.ceil(team2_win_chance)

            team1_win_chance = team1_win_chance * 100
            team1_win_chance = math.floor(team1_win_chance)
        else:
            team2_win_chance = team2_win_chance * 100
            team2_win_chance = math.floor(team2_win_chance)

            team1_win_chance = team1_win_chance * 100
            team1_win_chance = math.ceil(team1_win_chance)

        if (int(days) < int(day)):
            team1_win = True
            team2_win = True
            team1_score = int(cols[4].text)
            team2_score = int(cols[2].text)

            if (team1_score > team2_score):
                team1_win = True
                team2_win = False
            else:
                team1_win = False
                team2_win = True


            game_dict = {
                'team1_win_chance': team1_win_chance,
                'team2_win_chance': team2_win_chance,
                'date': date,
                'team1': cols[1].text,
                'team1_abv': teams[cols[1].text],
                'team2': cols[3].text,
                'team2_abv': teams[cols[3].text],
                'home': cols[3].text,
                'away': cols[1].text,
                'is_team1_win': team1_win,
                'is_team2_win': team2_win,
                'team1_score': team1_score,
                'team2_score': team2_score,
            }

            past_games.append(game_dict)

        else:
            game_dict = {
                'team1_win_chance': team1_win_chance,
                'team2_win_chance': team2_win_chance,
                'date': date,
                'team1': cols[1].text,
                'team1_abv': teams[cols[1].text],
                'team2': cols[3].text,
                'team2_abv': teams[cols[3].text],
                'home': cols[3].text,
                'away': cols[1].text,
            }


            if (int(days) == int(day)):
                today_games.append(game_dict)
            else:
                upcoming_games.append(game_dict)

        count_games += 1

    # Past Games
    for row in table2.find_all('tr')[1:]:
        if len(row.find_all('th')) > 1:
            continue

        date = row.find_all('th')[0].text

        days = date.split(',')[1].split()[1]

        weekday, month_and_day, year = date.split(',')
        month_and_day = month_and_day.lstrip()
        year = year.rstrip()
        date = "{},{}".format(month_and_day, year)

        cols = row.find_all('td')

        team2_win_chance, team1_win_chance = probability(cols[1].text, cols[3].text, avg_table, lr)

        if (team2_win_chance > team1_win_chance):
            team2_win_chance = team2_win_chance * 100
            team2_win_chance = math.ceil(team2_win_chance)

            team1_win_chance = team1_win_chance * 100
            team1_win_chance = math.floor(team1_win_chance)
        else:
            team2_win_chance = team2_win_chance * 100
            team2_win_chance = math.floor(team2_win_chance)

            team1_win_chance = team1_win_chance * 100
            team1_win_chance = math.ceil(team1_win_chance)

        team1_win = True
        team2_win = True
        team1_score = int(cols[4].text)
        team2_score = int(cols[2].text)

        if (team1_score > team2_score):
            team1_win = True
            team2_win = False
        else:
            team1_win = False
            team2_win = True


        game_dict = {
            'team1_win_chance': team1_win_chance,
            'team2_win_chance': team2_win_chance,
            'date': date,
            'team1': cols[1].text,
            'team1_abv': teams[cols[1].text],
            'team2': cols[3].text,
            'team2_abv': teams[cols[3].text],
            'home': cols[3].text,
            'away': cols[1].text,
            'is_team1_win': team1_win,
            'is_team2_win': team2_win,
            'team1_score': team1_score,
            'team2_score': team2_score,
        }

        past_games.append(game_dict)


    content = {'upcoming_games': upcoming_games, 'today_games': today_games, 'past_games': past_games}
    return jsonify(content)


# Game staus 1 is not started, 2 is started, 3 is done
@app.route('/today_games', methods=['GET'])
def games_update():
    games = scoreboard.ScoreBoard()
    games = games.get_dict()

    print(games)
    games_info = []
    for game in games["scoreboard"]["games"]:
        game_info = {
            'score_home': game['awayTeam']['score'],
            'score_away': game['awayTeam']['score'],
            'home_team': game['homeTeam']['teamTricode'],
            'away_team': game['awayTeam']['teamTricode'],
            'period': game['period'],
            'game_clock': game['gameClock'],
            'game_status': game['gameStatus']
        }

        games_info.append(game_info)
    
    content = {'games' : games_info}
    return jsonify(content)


if __name__ == '__main__':
    app.run(debug=True)