import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Card } from './Card';

describe('Тесты компонента Card', () => {
  it('Button рендерится с текстом', () => {
    const { getByText } = render(<Card id='123-123'
      buildNumber='2'
      commitMessage='Test msg'
      commitHash='321-321'
      branchName='card'
      authorName='Andrey Pogorelov'
      status='Waiting'
    />);

    expect(getByText('Test msg')).toBeInTheDocument();
  });

  it('onClick вызывается', () => {
    const clickFunc = jest.fn();
    const { getByText } = render(<Card id='123-123'
      buildNumber='2'
      commitMessage='Test msg'
      commitHash='321-321'
      branchName='card'
      authorName='Andrey Pogorelov'
      status='Waiting'
      onClick={clickFunc}
    />);

    fireEvent.click(getByText('card'));
    expect(clickFunc).toHaveBeenCalled();
  });

  it('При передачи пропса details, появляются классы', () => {
    const { container } = render(<Card
      details
    />)
    const info = container.querySelector('.card__information');
    const atributes = container.querySelector('.card__atributes');
    const date = container.querySelector('.card__date');
    const dayContainer = container.querySelector('.card__day-container');
    const day = container.querySelector('.card__day');

    expect(info).toHaveClass('details__card');
    expect(atributes).toHaveClass('details__atributes');
    expect(date).toHaveClass('details__date');
    expect(dayContainer).toHaveClass('details__day-container');
    expect(day).toHaveClass('details__day');
  });

  it('Изменяются классы при передачи пропса status Success', () => {
    const { container } = render(<Card
      status='Success'
    />)

    const cardNumber = container.querySelector('.card__number-ticket');
    const cardIcon = container.querySelector('.card__icon-pr');

    expect(cardNumber).toHaveClass('card__number-ticket_good');
    expect(cardIcon).toHaveClass('card__icon-pr_good');
  });

  it('Изменяются классы при передачи пропса status Waiting', () => {
    const { container } = render(<Card
      status='Waiting'
    />)

    const cardNumber = container.querySelector('.card__number-ticket');
    const cardIcon = container.querySelector('.card__icon-pr');

    expect(cardNumber).toHaveClass('card__number-ticket_queue');
    expect(cardIcon).toHaveClass('card__icon-pr_queue');
  });

  it('Изменяются классы при передачи пропса status InProgress', () => {
    const { container } = render(<Card
      status='InProgress'
    />)

    const cardNumber = container.querySelector('.card__number-ticket');
    const cardIcon = container.querySelector('.card__icon-pr');

    expect(cardNumber).toHaveClass('card__number-ticket_queue');
    expect(cardIcon).toHaveClass('card__icon-pr_queue');
  });

  it('Изменяются классы при передачи пропса status Fail', () => {
    const { container } = render(<Card
      status='Fail'
    />)

    const cardNumber = container.querySelector('.card__number-ticket');
    const cardIcon = container.querySelector('.card__icon-pr');

    expect(cardNumber).toHaveClass('card__number-ticket_reject');
    expect(cardIcon).toHaveClass('card__icon-pr_reject');
  });

  it('Изменяются классы при передачи пропса status Canceled', () => {
    const { container } = render(<Card
      status='Canceled'
    />)

    const cardNumber = container.querySelector('.card__number-ticket');
    const cardIcon = container.querySelector('.card__icon-pr');

    expect(cardNumber).toHaveClass('card__number-ticket_reject');
    expect(cardIcon).toHaveClass('card__icon-pr_reject');
  });
});