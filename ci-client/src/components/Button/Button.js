import React from 'react';
import classNames from 'classnames';
import './Button.scss';

export function Button({ src, text, textWithIcon, header, accent, settings, history, disabled, onClick }) {

  const buttonClass = classNames({
    'button__header': header,
    'button_accent': accent,
    'button__settings': settings,
    'header__button_history': history
  }, 'button');
  return (
    <button onClick={onClick} className={buttonClass} disabled={disabled}>
      {src && <img className='button__icon' src={src} alt="gear" disabled={disabled} />}
      {!text && !history ? <span className="button__text" disabled={disabled}>{textWithIcon}</span> : text}
    </button>
  );
}