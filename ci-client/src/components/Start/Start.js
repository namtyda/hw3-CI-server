import React from 'react';
import './Start.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';
import { Footer } from '../Footer/Footer';

export function Start() {
  return (
    <>
    <div className='start'>
      <Header button/>
      <div className='settings-info content'>
        <img className="settings-info__img" src="images/settingslogo.svg" alt="key and screw" />
        <p className="settings-info__text">
          Configure repository connection
          and synchronization settings
        </p>
        <Button text='Open settings' accent/>
      </div>
    </div>
      <Footer />
    </>
  );
}