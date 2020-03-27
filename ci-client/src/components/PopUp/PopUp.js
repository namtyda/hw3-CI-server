import React from 'react';
import './PopUp.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

export function PopUp({ onChange, name, value, onClick, onClickRunBuild, closePopUp, disabled, found }) {
  return (
    <div className='popup'>
      <div className='popup__wrapper'>
        <form className='popup__form'>
          <h3 className='popup__title'>New build</h3>
          <p className='popup__description'>Enter the commit hash which you want to build.</p>
          <Input placeholder='Commit hash' onClick={onClick} onChange={onChange} name={name} value={value} />
          <div className='popup__button-wrapper'>
            <Button accent text='Run build' settings onClick={onClickRunBuild} disabled={disabled} />
            <Button text='Cancel' onClick={closePopUp} />
            {found && <span className='popup__err'>Commit not found</span>}
          </div>
        </form>
      </div>
    </div>
  );
}