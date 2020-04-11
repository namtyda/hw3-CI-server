import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Loader } from './Loader';

describe('Тесты компонента Loader', () => {
  it('Компонент Loader рендерится на странице', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('loader');
    expect(container.firstChild.src).toBe('http://localhost/images/loader.svg');
  });
});