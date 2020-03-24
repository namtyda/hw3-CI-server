import React from 'react';
import './Button.scss';
export function Button({ src, text, textWithIcon }) {
  return (
    <button className="button button_accent">
      {src ? <img className='button__icon' src={src} alt="gear" /> : null}
      {!text ? <span className="button__text">{textWithIcon}</span> : text}
    </button>
  );
}