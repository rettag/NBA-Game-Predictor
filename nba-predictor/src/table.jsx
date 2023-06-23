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
  

export default function Table({ data, live, is_today, date, today, date_year, date_month, date_day }) {
    const monthNum = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}

    let year_date = parseInt(date_year);
    let month_date = parseInt(monthNum[date_month]);
    let day_date = parseInt(date_day);

    let [month, day, year] = today.split(' ');
    year = parseInt(year);
    month = parseInt(monthNum[month]);
    day = parseInt(day);

    console.log(year, year_date);
    console.log(month, month_date);
    console.log(day, day_date);

    if (today == date || (year < year_date) || (year === year_date && month < month_date) || (year === year_date && month === month_date && day < day_date)) {
      console.log("HERE:");
      if ((year < year_date) || (year === year_date && month < month_date) || (year === year_date && month === month_date && day < day_date)) {
        console.log(date)
        data = data.filter((element) => {
          console.log(element.date)
          return element.date === date
        });
        console.log("filtered");
      }


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
                <td>TBD</td>
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
          <th>Result</th>
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
    else {
      console.log(date)
      data = data.filter((element) => element.date === date);
      console.log(data.length)

      let rows = data.map(game => {
        let team1_chance = parseInt(game.team1_win_chance);
        let team2_chance = parseInt(game.team2_win_chance);

        let team1_score = parseInt(game.team1_score);
        let team2_score = parseInt(game.team2_score);

        let result = '';
        let is_correct = false;
        if (team1_chance > team2_chance && team1_score > team2_score) {
          result = 'CORRECT'
          is_correct = true
        }
        if (team1_chance > team2_chance && team1_score < team2_score) {
          result = 'INCORRECT'
        }
        if (team1_chance < team2_chance && team1_score > team2_score) {
          result = 'INCORRECT'
        }
        if (team1_chance < team2_chance && team1_score < team2_score) {
          result = 'CORRECT'
          is_correct = true
        }

        return (
            <tr key={game.team1_abv + game.team2_abv}>
                <td className={is_correct ? "game_win" : "game_loss"}>{result}</td>
                <td className="team" > <img src={Logos[game.team2_abv]} /> {game.home} <div className={game.is_team1_win ? "game_win past" : "game_loss past"}>{game.team1_score}</div> </td>
                <td className={game.is_team1_win ? "game_win prob past" : "game_loss prob past"}>{team1_chance}%</td>
                <td className="middle-column">
                <Bar homePercent={team1_chance} awayPercent={team2_chance} /> <div className="past">Final</div>
                </td>
                <td className={game.is_team1_win ? "game_loss prob past" : "game_win prob past"}>{team2_chance}%</td>
                <td className="team" > <img src={Logos[game.team1_abv]} /> {game.away} <div className={game.is_team1_win ? "game_loss past" : "game_win past"}>{game.team2_score}</div> </td>
            </tr>   
        );
    });

    return (
      <table className='table'>
      <thead>
        <tr>
          <th>Result</th>
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
}