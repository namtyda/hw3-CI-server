import React from 'react';
import classNames from 'classnames';
import './Button.scss';

interface ButtonProps {
  src: string;
  text: string;
  textWithIcon: string;
  header: boolean;
  accent: boolean;
  settings: boolean;
  history: boolean;
  disabled: boolean;
  onClick(): void;
}
export function Button({ src, text, textWithIcon, header, accent, settings, history, disabled, onClick }: ButtonProps) {

  const buttonClass = classNames({
    'button__header': header,
    'button_accent': accent,
    'button__settings': settings,
    'header__button_history': history
  }, 'button');
  return (
    <button onClick={onClick} className={buttonClass} disabled={disabled}>
      {src && <img className='button__icon' src={src} alt="gear" />}
      {!text && !history ? <span className="button__text" >{textWithIcon}</span> : text}
    </button>
  );
}