import React from 'react';
import './Card.scss';
import classNames from 'classnames';

export function Card({ details }) {

  const informClass = classNames('card__information', {
    'details__card': details
  });

  const atributeClass = classNames('card__atributes', {
    'details__atributes': details
  });

  const cardDateClass = classNames('card__date', {
    'details__date': details
  });

  const cardDayContClass = classNames('card__day-container', {
    'details__day-container': details
  });

  const cardDayClass = classNames('card__day', {
    'details__day': details
  });

  return (
    <div className="card">
      <div className="card__discription">
        <div className="card__icon-pr card__icon-pr_good"></div>
        <div className={informClass}>
          <div className="card__content-wrapper">
            <div className="card__title-wrapper">
              <p className="card__number-ticket card__number-ticket_good">#1368</p>
              <h3 className="card__title">add documentation for postgres scaler</h3>
            </div>
            <div className={atributeClass}>
              <div className="card__git-info">
                <img className="card__icon-atribute" src="/images/commit.svg" alt="commit icon" />
                <p className="card__branch">master</p>
                <p className="card__commit">9c9f0b9</p>
              </div>
              <div className="card__author-container">
                <img className="card__icon-atribute" src="/images/user.svg" alt="use icon" />
                <p className="card__author">Philip Kirkorov</p>
              </div>
            </div>
          </div>
          <div className={cardDateClass}>
            <div className={cardDayContClass}>
              <img className="card__icon-atribute" src="/images/calendar.svg" alt="calendar icon" />
              <p className={cardDayClass}>21 янв, 03:06</p>
            </div>
            <div className="card__time-container">
              <img className="card__icon-atribute" src="/images/time.svg" alt="time icon" />
              <p className="card__time">1 ч 20 мин</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}