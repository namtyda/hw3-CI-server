import React from 'react';
import './PopUp.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
interface PopUpProps {

  onClickRunBuild: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closePopUp(): void;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  found?: boolean;
  name: string;
  value: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export function PopUp({ onChange, name, value, onClick, onClickRunBuild, closePopUp, disabled, found }: PopUpProps) {
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