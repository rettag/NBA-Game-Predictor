import React, { useState, useEffect } from 'react';
import Ball from './nba-logos/ball.png';
import './App.css';
const BasketballBounceAnimation = () => {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPosition(prevPosition => prevPosition + direction);
    }, 10);

    // 清除定时器
    return () => clearInterval(animationInterval);
  }, [direction]);

  useEffect(() => {
    if (position <= -100) {
      setDirection(1);
    } else if (position >= 200) {
      setDirection(-1);
    }
  }, [position]);

  const basketballStyle = {
    position: 'absolute',
    bottom: position,
    transition: 'bottom 0.1s ease-in-out',
    width: '10%', // Adjust the width to make the image smaller
    left: '45.5%', 
  };

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <img
        src = {Ball}
        alt="Basketball"
        style={basketballStyle}
      />
    </div>
  );
};

export default BasketballBounceAnimation;
















/*
import React from 'react';
import { useSpring, animated } from 'react-spring';

const BasketballAnimation = () => {
  // 创建动画效果
  const styles = useSpring({
    from: { y: -1000 }, // 篮球起始位置，从顶部开始
    to: { y: 1000}, // 篮球结束位置，位于页面顶部
    config: { duration: 10000 }, // 动画持续时间
  });

  return (
    <div>
      <animated.div
        style={{
          ...styles,
          width: '10px',
          height: '10px',
          background: 'orange',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default BasketballAnimation;
*/