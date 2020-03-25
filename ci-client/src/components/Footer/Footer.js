import React from 'react';
import './Footer.scss';

export function Footer() {

  return (
    <footer className='footer'>
      <div className='content footer__content'>
        <ul className="footer__link-list">
          <li className="footer__link">Support</li>
          <li className="footer__link">Learning</li>
        </ul>
        <p className="footer__copyright">&copy; 2020 Andrey Pogorelov</p>
      </div>
    </footer>
  );
}