import React from 'react';
import { format } from 'date-fns';
import { ru, enGB } from 'date-fns/locale'
import './Card.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface CardProps {
  details?: boolean;
  id: string;
  buildNumber: number;
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
  status: string;
  start: string;
  duration: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export function Card({ details, id, buildNumber, commitMessage, commitHash = '', branchName, authorName, status, start, duration, onClick }: CardProps) {
  const { t } = useTranslation();

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
    'card__number-ticket_reject': status === 'Fail' || status === 'Canceled'
  });

  const cardIconClass = classNames('card__icon-pr', {
    'card__icon-pr_good': status === 'Success',
    'card__icon-pr_queue': status === 'Waiting' || status === 'InProgress',
    'card__icon-pr_reject': status === 'Fail' || status === 'Canceled'
  })

  const shortCommitHash = commitHash.slice(0, 6)
  return (
    <div data-hash={id} onClick={onClick} className="card">
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
                <p className="card__commit">{shortCommitHash}</p>
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
              <p className={cardDayClass}>{start && format(new Date(start), 'd MMM HH:mm', { locale: t('day') === 'ru' ? ru : enGB }).replace('.', ',')}</p>
            </div>
            <div className="card__time-container">
              <img className="card__icon-atribute" src="/images/time.svg" alt="time icon" />
              <p className="card__time">{duration && `${duration / 60 ^ 0} ${t('hours')} ${duration % 60} ${t('minutes')}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
