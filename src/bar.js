import React from 'react';

const Bar = ({ homePercent, awayPercent }) => {
    const homeWidth = `${homePercent}%`;
    const awayWidth = `${awayPercent}%`;


  const homeClass = homePercent >= awayPercent ? 'win' : 'lose';
  const awayClass = awayPercent >= homePercent ? 'win' : 'lose';

  let HomeClassName = "bar " + "bar1 " + homeClass;
  let AwayClassName = "bar " + "bar2 " + awayClass;

  return (
    <div className='bar-wrapper'>
      <div className="bar-container">
        <div className={HomeClassName} style={{ width: homeWidth }}></div>
      </div>
      <div className="bar-container">
        <div className={AwayClassName} style={{ width: awayWidth }}></div>
      </div>
    </div>
  );
};

export default Bar;