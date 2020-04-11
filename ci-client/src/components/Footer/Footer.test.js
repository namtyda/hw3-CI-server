import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Footer } from './Footer';

describe('Тесты компонента Footer', () => {
  it('Компонент footer рендерится', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('© 2020 Andrey Pogorelov')).toBeInTheDocument();
  });
});