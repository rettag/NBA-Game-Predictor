import React, { useState, useEffect } from 'react';
import Bar from './bar';

import ATL from './nba-logos/ATL.gif';
import BOS from './nba-logos/BOS.gif';
import BKN from './nba-logos/BKN.gif';
import CHA from './nba-logos/CHA.gif';
import CHI from './nba-logos/CHI.gif';
import CLE from './nba-logos/CLE.gif';
import DAL from './nba-logos/DAL.gif';
import DEN from './nba-logos/DEN.gif';
import DET from './nba-logos/DET.gif';
import GSW from './nba-logos/GSW.gif';
import HOU from './nba-logos/HOU.gif';
import IND from './nba-logos/IND.gif';
import LAC from './nba-logos/LAC.gif';
import LAL from './nba-logos/LAL.gif';
import MEM from './nba-logos/MEM.gif';
import MIA from './nba-logos/MIA.gif';
import MIL from './nba-logos/MIL.gif';
import MIN from './nba-logos/MIN.gif';
import NOP from './nba-logos/NOP.gif';
import NYK from './nba-logos/NYK.gif';
import OKC from './nba-logos/OKC.gif';
import ORL from './nba-logos/ORL.gif';
import PHI from './nba-logos/PHI.gif';
import PHX from './nba-logos/PHX.gif';
import POR from './nba-logos/POR.gif';
import SAC from './nba-logos/SAC.gif';
import SAS from './nba-logos/SAS.gif';
import TOR from './nba-logos/TOR.gif';
import UTA from './nba-logos/UTA.gif';
import WAS from './nba-logos/WAS.gif';

const Logos = {
    "ATL": ATL,
    "BOS": BOS,
    "BKN": BKN,
    "CHA": CHA,
    "CHI": CHI,
    "CLE": CLE,
    "DAL": DAL,
    "DEN": DEN,
    "DET": DET,
    "GSW": GSW,
    "HOU": HOU,
    "IND": IND,
    "LAC": LAC,
    "LAL": LAL,
    "MEM": MEM,
    "MIA": MIA,
    "MIL": MIL,
    "MIN": MIN,
    "NOP": NOP,
    "NYK": NYK,
    "OKC": OKC,
    "ORL": ORL,
    "PHI": PHI,
    "PHX": PHX,
    "POR": POR,
    "SAC": SAC,
    "SAS": SAS,
    "TOR": TOR,
    "UTA": UTA,
    "WAS": WAS,
  }

function formatGameClock(gameClock) {
    let minutes = parseInt(gameClock.slice(2, 4));
    let seconds = parseInt(gameClock.slice(5, 7));
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
  

export default function Table({ data, live, is_today }) {
    let rows = data.map(game => {
        let team1_chance = parseInt(game.team1_win_chance);
        let team2_chance = parseInt(game.team2_win_chance);

        let liveGame = live.find(g => ((g.home_team === game.team1_abv && g.away_team === game.team2_abv) || (g.home_team === game.team2_abv && g.away_team === game.team1_abv)) && is_today && g.game_status == '2');
        let home_score = '';
        let away_score = '';
        let timeLeft = '';
        let period = '';

        if (liveGame) {
            home_score = liveGame.score_home;
            away_score = liveGame.score_away;
            period = liveGame.period;
            timeLeft = "Quarter: " + period + " Time: " + formatGameClock(liveGame.game_clock);
        }

        return (
            <tr key={game.team1_abv + game.team2_abv}>
                <td className="team" > <img src={Logos[game.team2_abv]} /> {game.home} <div className="live">{home_score}</div> </td>
                <td className={liveGame ? 'prob live' : 'prob'}>{team1_chance}%</td>
                <td className="middle-column">
                <Bar homePercent={team1_chance} awayPercent={team2_chance} /> <div className="live">{timeLeft}</div>
                </td>
                <td className={liveGame ? 'prob live' : 'prob'}>{team2_chance}%</td>
                <td className="team" > <img src={Logos[game.team1_abv]} /> {game.away} <div className="live">{away_score}</div> </td>
            </tr>   
        );
    });

    return (
        <table className='table'>
        <thead>
          <tr>
            <th>Home Team</th>
            <th>Probability</th>
            <th>Winning Probability</th>
            <th>Probability</th>
            <th>Away Team</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
}