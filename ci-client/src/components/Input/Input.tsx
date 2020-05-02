import React from 'react';
import classNames from 'classnames';
import './Input.scss';

interface InputProps {
  labelText?: string;
  name: string;
  require?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  error?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
export function Input({ labelText, name, require, value, onChange, placeholder, onClick, error, onFocus }: InputProps) {
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