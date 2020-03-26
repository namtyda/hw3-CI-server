import React from 'react';
import './Card.scss';
import classNames from 'classnames';

export function Card({ details, id, buildNumber, commitMessage, commitHash, branchName, authorName, status, start, duration }) {

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

  const cardNumberClass = classNames('card__number-ticket', {
    'card__number-ticket_good': status === 'Success',
    'card__number-ticket_queue': status === 'Waiting' || status === 'InProgress',
    'card__number-ticket_reject': status === 'Fail' || status === 'Canceled '
  });

  const cardIconClass = classNames('card__icon-pr', {
    'card__icon-pr_good': status === 'Success',
    'card__icon-pr_queue': status === 'Waiting' || status === 'InProgress',
    'card__icon-pr_reject': status === 'Fail' || status === 'Canceled '
  })

  return (
    <div data-id={id} className="card">
      <div className="card__discription">
        <div className={cardIconClass} />
        <div className={informClass}>
          <div className="card__content-wrapper">
            <div className="card__title-wrapper">
              <p className={cardNumberClass}>{`#${buildNumber}`}</p>
              <h3 className="card__title">{commitMessage}</h3>
            </div>
            <div className={atributeClass}>
              <div className="card__git-info">
                <img className="card__icon-atribute" src="/images/commit.svg" alt="commit icon" />
                <p className="card__branch">{branchName}</p>
                <p className="card__commit">{commitHash}</p>
              </div>
              <div className="card__author-container">
                <img className="card__icon-atribute" src="/images/user.svg" alt="use icon" />
                <p className="card__author">{authorName}</p>
              </div>
            </div>
          </div>
          <div className={cardDateClass}>
            <div className={cardDayContClass}>
              <img className="card__icon-atribute" src="/images/calendar.svg" alt="calendar icon" />
              <p className={cardDayClass}>{start}</p>
            </div>
            <div className="card__time-container">
              <img className="card__icon-atribute" src="/images/time.svg" alt="time icon" />
              <p className="card__time">{duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}