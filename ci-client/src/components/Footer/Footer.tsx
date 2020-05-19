import React from 'react';
import './Footer.scss';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export function Footer() {
  // eslint-disable-next-line 
  const { t, i18n } = useTranslation();
  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  const currentLang = i18next.languages[0];
  return (
    <footer className='footer'>
      <div className='content footer__content'>
        <ul className="footer__link-list">
          <li className="footer__link">Support</li>
          <li className="footer__link">Learning</li>
          {currentLang === 'ru' ?
            <li onClick={() => changeLang('en')} className="footer__link">{t('langVersion')}</li> :
            <li onClick={() => changeLang('ru')} className="footer__link">{t('langVersion')}</li>
          }
        </ul>
        <p className="footer__copyright">&copy; 2020 Andrey Pogorelov</p>
      </div>
    </footer>
  );
}