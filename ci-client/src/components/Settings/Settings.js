import React from 'react';
import './Settings.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

export function Settings() {
  return (
    <>
      <div className='settings'>
        <Header settings title='School CI server' text='test'/>
        <div className='content'>
          <h2 className="settings__title">Settings</h2>
          <p className="settings__subtitle">Configure repository connection and synchronization settings.</p>
          <form className='settings__form'>
            <Input labelText='GitHub repository' name='user-name/repo-name' require />
            <Input labelText='Build command' name='build command' />
            <Input labelText='Main branch' name='branch' />
            <div className="settings__time-wrapper">
              <p className="settings__paragraph">Synchronize every</p>
              <input className="input__field input__field_time" type="text" maxlength="3" />
              <p className="settings__paragraph">minutes</p>
            </div>
            <div className="settings__button-wrapper">
              <Button accent text='Save' settings />
              <Button text='Cancel' />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}