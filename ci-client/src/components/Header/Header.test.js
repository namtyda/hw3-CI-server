import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Header } from './Header';

describe('Тесты компонента Header', () => {
  it('Компонент Header рендерится', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('При передачи пропса Settings навешивается класс', () => {
    const { container } = render(<Header settings />);
    expect(container.firstChild).toHaveClass('header_settings');
    expect(container.firstChild).not.toHaveClass('header__content');
  });

  it('При передачи пропса History навешивается класс', () => {
    const { container } = render(<Header history />);
    expect(container.firstChild).toHaveClass('header__history-indent');
  });

  it('headerTitle навешвается класс при передачи пропса history', () => {
    const { container } = render(<Header history />);
    const title = container.querySelector('.header__title');
    expect(title).toHaveClass('header__title_history');
  });

  it('headerTitle навешвается класс при передачи пропса details', () => {
    const { container } = render(<Header details />);
    const title = container.querySelector('.header__title');
    expect(title).toHaveClass('header_details');
  });

  it('При передаче пропса button, должна появится кнопка', () => {
    const { container } = render(<Header button />);
    const btn = container.querySelector('.button');
    expect(btn).not.toBe(null);
  });

});