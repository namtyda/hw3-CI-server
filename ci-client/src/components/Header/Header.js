import React from 'react';
import classNames from 'classnames';
import './Header.scss';
import { Button } from '../Button/Button';

export function Header({ settings, button }) {
  const headerClass = classNames( {
    'header_settings': settings,
    'header__content': !settings
  },'header', 'content',);

  return (
      <header className={headerClass}>
        <h1 className='header__title'>School CI server</h1>
        {button && <Button src='images/gear.svg' textWithIcon='Settings' header />}
      </header>
   
  );
}