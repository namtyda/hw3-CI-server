import React from 'react';
import './Card.scss';

export function Card() {
  
  return (
    <div class="card">
            <div className="card__discription">
              <div className="card__icon-pr card__icon-pr_good"></div>
              <div className="card__information">
                <div className="card__content-wrapper">
                  <div className="card__title-wrapper">
                    <p className="card__number-ticket card__number-ticket_good">#1368</p>
                    <h3 className="card__title">add documentation for postgres scaler</h3>
                  </div>
                  <div className="card__atributes">
                    <div className="card__git-info">
                      <img className="card__icon-atribute" src="images/commit.svg" alt="commit icon"/>
                      <p className="card__branch">master</p>
                      <p className="card__commit">9c9f0b9</p>
                    </div>
                    <div className="card__author-container">
                      <img className="card__icon-atribute" src="images/user.svg" alt="use icon"/>
                      <p className="card__author">Philip Kirkorov</p>
                    </div>
                  </div>
                </div>
                <div className="card__date">
                  <div className="card__day-container">
                    <img className="card__icon-atribute" src="images/calendar.svg" alt="calendar icon"/>
                    <p className="card__day">21 янв, 03:06</p>
                  </div>
                  <div className="card__time-container">
                    <img className="card__icon-atribute" src="images/time.svg" alt="time icon"/>
                    <p className="card__time">1 ч 20 мин</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}