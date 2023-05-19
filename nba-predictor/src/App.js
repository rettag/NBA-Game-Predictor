import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './table';

function App() {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [todayGames, setTodayGames] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


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
    let isFetchCompleted = false;

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
        console.log(data);

        isFetchCompleted = true;
      })
      .catch(error => {
        console.log(error);

        isFetchCompleted = true;
      });

  }

  useEffect(() => {
    fetchGames();
    setIsLoading(true); 

    const intervalId = setInterval(fetchScores, 300000);
    return () => clearInterval(intervalId);

  }, []);

  if (isLoading) {
    return (
      <>
      <h1>NBA Basketball Game Predictor</h1>

      <hr></hr>

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

  return (
    <div>
      <h1>NBA Basketball Game Predictor</h1>

      <hr></hr>

      <h2>Today's Games </h2>
      <Table data={todayGames} live={liveGames} is_today={true} />

      <h2>Upcoming Games</h2>
      <Table data={upcomingGames} live={liveGames} is_today={false} />
    </div>

  );
}

export default App;


