import React from 'react';
import classNames from 'classnames';
import './Input.scss';


export function Input({ labelText, name, require, value, onChange, placeholder, onClick, error, onFocus }) {
  const paragraph = classNames('settings__paragraph', {
    'settings__require': require
  });
  const classInput = classNames('input', {
    'input__error': error
  })
  return (
    <>
      <label className={paragraph} htmlFor={name}>{labelText}</label>
      <div className={classInput} >
        <input className='input__field' id={name} type="text" placeholder={placeholder} value={value} onChange={onChange} name={name} required={require} onFocus={onFocus} />
        <button className="input__field-cancel" name={name} onClick={onClick} />
      </div>
    </>
  );
}