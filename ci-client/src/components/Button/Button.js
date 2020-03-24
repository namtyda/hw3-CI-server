import React from 'react';
import classNames from 'classnames';
import './Button.scss';

export function Button({ src, text, textWithIcon, header, accent }) {

  const buttonClass = classNames({
    'button__header': header,
    'button_accent': accent,
  }, 'button');
  return (
    <button className={buttonClass}>
      {src && <img className='button__icon' src={src} alt="gear" />}
      {!text ? <span className="button__text">{textWithIcon}</span> : text}
    </button>
  );
}