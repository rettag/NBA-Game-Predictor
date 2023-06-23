import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball } from '@fortawesome/free-solid-svg-icons';

import './Home.css';

import Logo from './logo.png';
import Rett from './Rett.jpg';
import Filler from './filler.jpg';

function Home() {
  return (
    <div className='home-body'>

      <div id="home-title-and-logo">
        <img id="home-logo" src={Logo} alt="logo"></img>
        <div id="home-title">DribbleBot</div>
      </div>

      <div id="about">
        <div id="about-title">About</div>
        <div id="about-text">
            <b>Welcome to our website!</b> We are a team of five University of
            Michigan students who, over the spring semester, developed
            an NBA basketball game predictor using the power of machine
            learning. Combining our passion for basketball, expertise
            in data analysis, and cutting-edge machine learning 
            techniques, we dedicated ourselves to collecting and
            analyzing extensive game data. Through meticulous 
            research, advanced algorithms, and the utilization of
            machine learning models, we crafted a sophisticated 
            predictor that offers valuable insights and accurate 
            forecasts for upcoming NBA matchups. Explore our website 
            and let our predictor enhance your love for the sport 
            and add excitement to your basketball journey!
        </div>
      </div>

      <div id="team">
        <div id="team-title">Our Team</div>
        <div className='headshots'>
          <img className="headshot" src={Rett} alt="Rett"></img>
          <img className="headshot" src={Filler} alt="filler"></img>
          <img className="headshot" src={Filler} alt="filler"></img>
          <img className="headshot" src={Filler} alt="filler"></img>
          <img className="headshot" src={Filler} alt="filler"></img>
        </div>
      </div>

      <Link id="home-to-predictor-button" to="/predictor">
        <div id="home-to-predictor-button-name">
          Try Predictor
        </div>
        <FontAwesomeIcon icon={faBasketball}/>
      </Link>


    </div>
  )
}

export default Home