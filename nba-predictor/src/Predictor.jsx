import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faBasketball, faHome, faX } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Predictor.css';
import Table from './table';

import Logo from './logo.png';

function Predictor() {
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

  // Fetch Current Games Being Played
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

  // Fetch Past, Today, And Upcoming Games
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
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });

  }

  useEffect(() => {
    // Get The Current Day
    const currentDate = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('default', options);
    setToday(formattedDate);
    let [monthAbv, day, year] = formattedDate.split(' ');
    day = day.split(',')
    setDay(day[0]);
    setMonth('Feb'); // CHANGING HERE FOR TESTING: monthAbv
    setYear(year);

    //
    if (fetchData === 0) {
      fetchGames();
      setIsLoading(true);
      fetchData += 1;
    }

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

  function RemovePopUp() {
    const popUp = document.querySelector('#pop-up');
    popUp.style.opacity = '0';
    popUp.style.pointerEvents = 'none';
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div id="loading-body">
        <div id='loading-container'>
          <FontAwesomeIcon id="loading" icon={faBasketball}/>
          <div id="loading-text">One Moment Please</div>
        </div>
      </div>
    );
  }


  return (
    <div id="fade-in" className='body-main'>
      <div id="pop-up">
        <button id="pop-up-button" onClick={RemovePopUp}><FontAwesomeIcon icon={faX}/></button>
        <div id="pop-up-title">Welcome To The Predictor!</div>
        <div id="pop-up-text1">
          <b>Welcome to the basketball game 
          predictor program!</b> Here, you can explore past and upcoming
          games, as well as stay updated with live games currently being played.
        </div>
        <div id="pop-up-text2">
          To navigate through different days, simply use the arrow icons located in
          the corners. They will allow you to explore various game schedules and results.
        </div>
        <div id="pop-up-text3">
        The table showcases different components, including the percentage predicted
        by our machine learning model for each team's chances of winning. Keep an eye out
        for correct predictions indicated in the table. <b>Thank you for choosing our app,
        and enjoy using it!</b>
        </div>
      </div>

      <div id="top-bar">
        <button id="arrow-left-button" onClick={backOneDay} >
          <FontAwesomeIcon id="arrow-left" icon={faAngleLeft} />
          <div id="arrow-left-text">Last Day</div>
        </button>

        <div id="title-and-logo">
          <img id="logo" src={Logo} alt="logo"></img>
          <div id="title">DribbleBot</div>
        </div>

        <button id="arrow-right-button" onClick={forwardOneDay} >
          <FontAwesomeIcon id="arrow-right" icon={faAngleRight} />
          <div id="arrow-right-text">Next Day</div>
        </button>
      </div>

      {/* Return To Home Button */}
      <Link id="home-to-predictor-button" to="/">
        <div id="home-to-predictor-button-name">
          Return Home
        </div>
        <FontAwesomeIcon icon={faHome}/>
      </Link>

      <div id='date'>{month} {day}, {year}</div>

      { today === (month + " " + day + ", " + year) ? (
      <>
        <h2>Today's Games </h2>
        <Table data={todayGames} live={liveGames} is_today={true} date={month + " " + day + ", " + year} today={today} date_year={year} date_month={month} date_day={day}/>

        <h2>Upcoming Games</h2>
        <Table data={upcomingGames} live={liveGames} is_today={false} date={month + " " + day + ", " + year} today={today} date_year={year} date_month={month} date_day={day} />
      </>
      ) : (
      <>
        <Table data={pastGames} live={liveGames} is_today={false} date={month + " " + day + ", " + year} today={today} date_year={year} date_month={month} date_day={day} />
      </>
      )}
    </div>
  );
}

export default Predictor;


