import React from 'react';
import classNames from 'classnames';
import './Header.scss';
import { Button } from '../Button/Button';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  settings?: boolean;
  button?: boolean;
  history?: boolean;
  title?: string;
  details?: boolean;
  onClick?: () => void;
  onClick2?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  redirectHistory?: () => void;
}
export function Header({ settings, button, history, title, details, onClick, onClick2, redirectHistory }: HeaderProps) {
  // eslint-disable-next-line 
  const { t, i18n } = useTranslation();
  
  const headerClass = classNames({
    'header_settings': settings,
    'header__content': !settings,
    'header__history-indent': history,
  }, 'header', 'content');

  const headerTitleClass = classNames('header__title', {
    'header__title_history': history,
    'header_details': details
  });

  return (
    <header className={headerClass}>
      <h1 className={headerTitleClass} onClick={redirectHistory}>{t('title')}</h1>
      {history ?
        <div className='header__button-wrapper'>
          {details ? <Button src='/images/rebuild.svg' textWithIcon='Rebuild' header onClick={onClick} /> : <Button onClick={onClick} src='/images/play.svg' textWithIcon='Run build' header />}
          <Button onClick={onClick2} src='/images/gear.svg' header history />
        </div>
        : button && <Button onClick={onClick} src='/images/gear.svg' textWithIcon='Settings' header />}
    </header>

  );
}
