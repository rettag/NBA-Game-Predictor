import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Table from './table';

function App() {
  let fetchData = 0;
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [todayGames, setTodayGames] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [pastGames, setPastGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [today, setToday] = useState('');
  const [count, setCount] = useState(0);



  const fetchScores = async() => {
    const params = {
      method: 'GET',
      headers: {
          'accept': 'application/json'
      }
    };

    fetch('http://127.0.0.1:5000/today_games', params)
    .then(response => {
      return response.json()
    })
    .then(data => {
      setLiveGames(data.games);
      console.log(data);
    })
    .catch(error => {
      console.log(error)
    });
  };

  function fetchGames() {
    const params = {
      method: 'GET',
      headers: {
          'accept': 'application/json'
      }
    };
    
    fetch('http://127.0.0.1:5000/', params)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUpcomingGames(data.upcoming_games);
        setTodayGames(data.today_games);
        setPastGames(data.past_games);
        console.log(data.past_games);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });

  }

  useEffect(() => {
    if (fetchData == 0) {
      fetchGames();
      setIsLoading(true);
      fetchData += 1;
    }

    // Set The Current Day
    const currentDate = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('default', options);
    setToday(formattedDate);
    let [monthAbv, day, year] = formattedDate.split(' ');
    day = day.split(',')
    setDay(day[0]);
    setMonth(monthAbv);
    setYear(year);


    const intervalId = setInterval(fetchScores, 300000);
    return () => clearInterval(intervalId);

  }, []);

  // Go Back One Day
  function backOneDay() {
    const numMonthDays = {'Jan': 31, 'Feb': 28, 'Mar': 31, 'Apr': 30, 'May': 31, 'Jun': 30, 'Jul': 31, 'Aug': 31, 'Sep': 30, 'Oct': 31, 'Nov': 30, 'Dec': 31}
    const monthNum = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}
    const monthIdx = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (count < -40) {
      alert('That is as far back we can go!')
      return
    }
    if (day - 1 == 0) {
      if (month == 'Oct') {
        setMonth('Jun')
        setDay(30)
      }
      else if (monthNum[month] - 2 < 0) {
        setMonth('Dec')
        setDay(31)
        setYear(parseInt(year) - 1)
      }
      else {
        setMonth(monthIdx[monthNum[month] - 2]);
        setDay(numMonthDays[monthIdx[monthNum[month] - 2]]);
      }
    }
    else {
      setDay(day - 1)
    }
    setCount(count - 1)
  }

  // Go Forward One Day
  function forwardOneDay() {
    const numMonthDays = {'Jan': 31, 'Feb': 28, 'Mar': 31, 'Apr': 30, 'May': 31, 'Jun': 30, 'Jul': 31, 'Aug': 31, 'Sep': 30, 'Oct': 31, 'Nov': 30, 'Dec': 31}
    const monthNum = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}
    const monthIdx = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    if (count > 40) {
      alert('That is as far forward we can go!')
      return
    }

    if (day + 1 > numMonthDays[month]) {
      if (month == 'Jun') {
        setMonth('Oct')
        setDay(1)
      }
      else if (monthNum[month] > 11) {
        setMonth('Jan');
        setDay(1);
        setYear(parseInt(year) + 1);
      }
      else {
        setMonth(monthIdx[monthNum[month]]);
        setDay(1);
      }
    }
    else {
      setDay(day + 1);
    }
    setCount(count + 1)
  }

  if (isLoading) {
    return (
      <>
      <h1>NBA Basketball Game Predictor</h1>

      <hr></hr>

      <div className='arrows'>
        <button onClick={backOneDay}>
          <FontAwesomeIcon icon={faArrowLeft} size="2x"/>
          <div>Last Day</div>
        </button>

        <div className='date'>{month} {day}, {year}</div>

        <button onClick={forwardOneDay}>
          <FontAwesomeIcon icon={faArrowRight} size="2x"/>
          <div>Next Day</div>
        </button>
      </div>

      <h2>Today's Games </h2>
      <div className="loading-container">
        <div className="loading"></div>
      </div>

      <h2>Upcoming Games </h2>
      <div className="loading-container">
        <div className="loading"></div>
      </div>
      </>
    );
  }

  if (today == (month + " " + day + ", " + year)) {
    return (
      <div>
        <h1>NBA Basketball Game Predictor</h1>

        <hr></hr>

        <div className='arrows'>
          <button onClick={backOneDay} >
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
            <div>Last Day</div>
          </button>

          <div className='date'>{month} {day}, {year}</div>

          <button onClick={forwardOneDay} >
            <FontAwesomeIcon icon={faArrowRight} size="2x" />
            <div>Next Day</div>
          </button>
        </div>

        <h2>Today's Games </h2>
        <Table data={todayGames} live={liveGames} is_today={true} date={month + " " + day + ", " + year} today={today} />

        <h2>Upcoming Games</h2>
        <Table data={upcomingGames} live={liveGames} is_today={false} date={month + " " + day + ", " + year} today={today} />
      </div>

    );
  }
  else {
    return (
    <div>
      <h1>NBA Basketball Game Predictor</h1>

      <hr></hr>

      <div className='arrows'>
        <button onClick={backOneDay} >
          <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          <div>Last Day</div>
        </button>

        <div className='date'>{month} {day}, {year}</div>

        <button onClick={forwardOneDay} >
          <FontAwesomeIcon icon={faArrowRight} size="2x" />
          <div>Next Day</div>
        </button>
      </div>

      <h2>Games</h2>
      <Table data={pastGames} live={liveGames} is_today={false} date={month + " " + day + ", " + year} today={today} />

    </div>
    );
  }
}

export default App;


