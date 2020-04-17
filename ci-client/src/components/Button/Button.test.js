import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Button } from './Button';

describe('Тест компонента Button', () => {
  it('Button рендерится с текстом', () => {
    const { getByText } = render(<Button text='Settings text' />);
    expect(getByText('Settings text')).toBeInTheDocument();
  });

  it('Button рендерится с иконкой при передачи пропсов', () => {
    const { container } = render(
      <Button src='/images/gear.svg' />
    )
    const icon = container.querySelector('.button__icon');

    expect(icon.src).toBe('http://localhost/images/gear.svg');
    expect(icon).not.toBe(null);
  });

  it('Button рендерится и иконкой, и с текстом', () => {
    const { getByText, container } = render(
      <Button src='/images/gear.svg' textWithIcon='Test text' />
    )
    const icon = container.querySelector('.button__icon');
    expect(icon.src).toBe('http://localhost/images/gear.svg');
    expect(getByText('Test text')).toBeInTheDocument();
  });

  it('onClick вызывается', () => {
    const clickFunc = jest.fn();
    const { getByText } = render(<Button text='button' onClick={clickFunc} />);
    fireEvent.click(getByText('button'));
    expect(clickFunc).toHaveBeenCalled();
  });

  it('При передачи пропса header, появляется класс button__header', () => {
    const { container } = render(<Button header />);
    expect(container.firstChild).toHaveClass('button__header');
  });

  it('При передачи пропса accent, появляется класс button_accent', () => {
    const { container } = render(<Button accent />);
    expect(container.firstChild).toHaveClass('button_accent');
  });

  it('При передачи пропса settings, появляется класс button__settings', () => {
    const { container } = render(<Button settings />);
    expect(container.firstChild).toHaveClass('button__settings');
  });

  it('При передачи пропса history, появляется класс header__button_history', () => {
    const { container } = render(<Button history />);
    expect(container.firstChild).toHaveClass('header__button_history');
  });

  it('При передачи пропса disabled, появляется атрибут disabled', () => {
    const { container } = render(<Button disabled />);
    expect(container.firstChild).toHaveAttribute('disabled');
  });
});