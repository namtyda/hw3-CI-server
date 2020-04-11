import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Input } from './Input';

describe('Тесты компонента Input', () => {
  it('Компонент Input рендерится', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('.settings__paragraph')).toBeInTheDocument();
    expect(container.querySelector('.input')).toBeInTheDocument();
  });

  it('При передачи пропса error, навешиватся класс', () => {
    const { container } = render(<Input error />);
    expect(container.querySelector('.input')).toHaveClass('input__error');
  });

  it('Событие onChange отрабатывает корректно', () => {
    let testValue = '';
    const onChange = (e) => {
      testValue = e.target.value;
    };
    const { container } = render(
      <Input value={testValue} onChange={onChange} />
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(testValue).toBe('test');
  });
});