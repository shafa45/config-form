import React, { useState, useEffect } from 'react';
import './Config.css';
import axios from 'axios';
import Loader from './utils/Loader';

const NumberIncrementer = ({
  label,
  type,
  value,
  onIncrement,
  onDecrement,
}) => (
  <div className='incrementer'>
    <p>{label}</p>
    <div className='buttons'>
      <button type='button' onClick={() => onDecrement(type)}>
        <ion-icon name='chevron-back-outline'></ion-icon>
      </button>
      <input type='number' value={value} readOnly />
      <button type='button' onClick={() => onIncrement(type)}>
        <ion-icon name='chevron-forward-outline'></ion-icon>
      </button>
    </div>
  </div>
);

export default function Config() {
  const [popupDelay, setPopupDelay] = useState(3);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [popupInterval, setPopupInterval] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const increment = (type) => {
    if (type === 'popupDelay') setPopupDelay(popupDelay + 1);
    else setPopupInterval(popupInterval + 1);
  };

  const decrement = (type) => {
    if (type === 'popupDelay' && popupDelay > 0) setPopupDelay(popupDelay - 1);
    if (type === 'popupInterval' && popupInterval > 0)
      setPopupInterval(popupInterval - 1);
  };

  const handleChange = (event) => setDisplayLimit(parseInt(event.target.value));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('https://survey-backend-xb1s.onrender.com/config', {
        popupDelay,
        displayLimit,
        popupInterval,
      });
      alert('Config saved successfully');
    } catch (err) {
      alert('Error saving config');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <form className='ConfigForm' onSubmit={handleSubmit}>
      <h1>Setup Config Form</h1>
      <hr />
      <NumberIncrementer
        label='Choose how much time to wait before showing the survey'
        type='popupDelay'
        value={popupDelay}
        onIncrement={increment}
        onDecrement={decrement}
      />
      <NumberIncrementer
        label='Choose after how much interval'
        type='popupInterval'
        value={popupInterval}
        onIncrement={increment}
        onDecrement={decrement}
      />
      <div>
        <p>Display Frequency - every</p>
        <select value={displayLimit} onChange={handleChange}>
          <option value='5'>5 min</option>
          <option value='10'>10 min</option>
          <option value='30'>30 min</option>
        </select>
      </div>
      <hr />
      <button className='save-btn' type='submit'>
        Save
      </button>
    </form>
  );
}
