import React from 'react';
import './Header.scss';
import { Button } from '../Button/Button';

export function Header() {
  return (
    <header className='header content header__content'>
      <h1 className='header__title'>School CI server</h1>
      <Button src='images/gear.svg' textWithIcon='Settings' header/>
    </header>
  );
}