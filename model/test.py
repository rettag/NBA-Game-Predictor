import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
from pygments import highlight, lexers
from pygments.formatters import Terminal256Formatter
from pygments import highlight, lexers, formatters

from nba_api.live.nba.endpoints import scoreboard

import requests
from bs4 import BeautifulSoup

games = scoreboard.ScoreBoard()
games = games.get_dict()

print(games)

