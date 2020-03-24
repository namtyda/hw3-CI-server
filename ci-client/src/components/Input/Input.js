import React from 'react';
import classNames  from 'classnames';
import './Input.scss';


export function Input({ labelText, name, require }) {
  const paragraph = classNames('settings__paragraph', {
    'settings__require': require
  });

  return (
    <>
      <label class={paragraph} for={name}>{labelText}</label>
      <div className="input">
        <input className="input__field" id={name} type="text" placeholder={name} />
        <button className="input__field-cancel" />
      </div>
    </>
  );
}