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

lr = LogisticRegression()
lr.fit(X_train, y_train)

y_pred = lr.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# Accuracy 86%!
print("Accuracy:", accuracy)

proba = lr.predict_proba(X_test)

# Save As A File
joblib.dump(lr, 'logistic_regression.pkl')
