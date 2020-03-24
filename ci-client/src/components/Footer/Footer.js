import React from 'react';
import './Footer.scss';

export function Footer() {

  return (
    <footer className='footer'>
      <div className='content footer__content'>
        <ul class="footer__link-list">
          <li class="footer__link">Support</li>
          <li class="footer__link">Learning</li>
        </ul>
        <p class="footer__copyright">&copy; 2020 Andrey Pogorelov</p>
      </div>
    </footer>
  );
}