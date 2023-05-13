from nba_api.stats.endpoints import leaguegamefinder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.metrics import accuracy_score

from nba_api.stats.endpoints import leaguestandingsv3
from nba_api.stats.endpoints import TeamDashboardByGeneralSplits
from nba_api.live.nba.endpoints import scoreboard

import joblib

def add_away(game):
    game["OPP_TOV"] = game["TOV"].shift(-1)
    game["OPP_OREB"] = game["OREB"].shift(-1)
    game["OPP_AST"] = game["AST"].shift(-1)
    game["OPP_STL"] = game["STL"].shift(-1)
    game["OPP_FG3_PCT"] = game["FG3_PCT"].shift(-1)
    game["OPP_BLK"] = game["BLK"].shift(-1)

    return game

# Retrieve game data from NBA API
gamefinder = leaguegamefinder.LeagueGameFinder(season_nullable='2021-22')
games = gamefinder.get_data_frames()[0]

games = games[['WL', 'GAME_ID', 'TOV', 'AST', 'STL', 'BLK', 'OREB', 'FG3_PCT']]
games = games.groupby("GAME_ID", group_keys=False).apply(add_away)

games = games.dropna()
del games['GAME_ID']
print(games)

# Create separate dataframes for input features and target variable
X = games.drop('WL', axis=1)
y = games['WL'].map({'W': 1, 'L': 0}).astype(int)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=0)

# Create and train a logistic regression model
lr = LogisticRegression()
lr.fit(X_train, y_train)

# Calculate the accuracy of the model
y_pred = lr.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

proba = lr.predict_proba(X_test)

joblib.dump(lr, 'logistic_regression.pkl')

# # Put results into database
# team_ids = {
#     "ATL": 1610612737,
#     "BOS": 1610612738,
#     "BKN": 1610612751,
#     "CHA": 1610612766,
#     "CHI": 1610612741,
#     "CLE": 1610612739,
#     "DAL": 1610612742,
#     "DEN": 1610612743,
#     "DET": 1610612765,
#     "GSW": 1610612744,
#     "HOU": 1610612745,
#     "IND": 1610612754,
#     "LAC": 1610612746,
#     "LAL": 1610612747,
#     "MEM": 1610612763,
#     "MIA": 1610612748,
#     "MIL": 1610612749,
#     "MIN": 1610612750,
#     "NOP": 1610612740,
#     "NYK": 1610612752,
#     "OKC": 1610612760,
#     "ORL": 1610612753,
#     "PHI": 1610612755,
#     "PHX": 1610612756,
#     "POR": 1610612757,
#     "SAC": 1610612758,
#     "SAS": 1610612759,
#     "TOR": 1610612761,
#     "UTA": 1610612762,
#     "WAS": 1610612764
# }

# conn = sqlite3.connect('games.db')
# cursor = conn.cursor()

# cursor.execute('''
#         CREATE TABLE IF NOT EXISTS games (
#             team1 text,
#             team2 text,
#             win_percent_team1 float,
#             win_percent_team2 float
#         )
#     ''')

# cursor.close()

# for team_id1 in team_ids:
#     for team_id2 in team_ids:

#         if team_id1 == team_id2:
#             continue

        
#         season_year = '2021-22'

#         # Retrieve the team dashboard stats for game splits
#         team_dashboard = TeamDashboardByGeneralSplits(team_id=team_ids[team_id1], season=season_year)

#         # Get the data frame for the team stats
#         team_stats = team_dashboard.get_data_frames()[0]
#         team_stats = team_stats[['TOV', 'AST', 'STL', 'BLK', 'OREB', 'FG3_PCT']]
#         team_stats = team_stats / 82
#         team_stats["FG3_PCT"] = team_stats["FG3_PCT"] * 82
#         # Print the data frame
#         print(team_stats.head())

#         home_stats = team_stats

#         # Retrieve the team dashboard stats for game splits
#         team_dashboard = TeamDashboardByGeneralSplits(team_id=team_ids[team_id2], season=season_year)

#         # Get the data frame for the team stats
#         team_stats = team_dashboard.get_data_frames()[0]
#         team_stats = team_stats[['TOV', 'OREB', 'AST', 'STL', 'FG3_PCT', 'BLK']]
#         team_stats = team_stats / 82
#         team_stats["FG3_PCT"] = team_stats["FG3_PCT"] * 82
#         # Print the data frame
#         print(team_stats.head())

#         away_stats = team_stats

        # home_stats["OPP_TOV"] = away_stats["TOV"]
        # home_stats["OPP_OREB"] = away_stats["OREB"]
        # home_stats["OPP_AST"] = away_stats["AST"]
        # home_stats["OPP_STL"] = away_stats["STL"]
        # home_stats["OPP_FG3_PCT"] = away_stats["FG3_PCT"]
        # home_stats["OPP_BLK"] = away_stats["BLK"]

#         print(home_stats)

#         y_pred = lr.predict(home_stats)
#         proba = lr.predict_proba(home_stats)

#         team2_win_percent = proba[0]
#         team1_win_percent = proba[1]

#         insert = conn.cursor()
#         insert.execute('INSERT INTO players (team1, team2, win_percent_team1, win_percent_team2) VALUES (?, ?, ?, ?)', (team_id1, team_id2, team1_win_percent, team2_win_percent))
#         insert.close()
#         print(y_pred, proba)

# conn.commit()
# conn.close()

# # # Today's Score Board
# # games = scoreboard.ScoreBoard()

# # # json
# # games.get_json()

# # # dictionary
# # games.get_dict()
