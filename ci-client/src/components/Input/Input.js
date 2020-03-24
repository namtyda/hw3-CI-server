import React from 'react';
import './Input.scss';

export function Input() {
  return (
    <div className="input">
      <input className="input__field" id='commandInput' type="text" placeholder="build command"/>
      <button className="input__field-cancel"/>
    </div>
  );
}