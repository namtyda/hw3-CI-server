import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { PopUp } from './PopUp';

describe('Тесты компонента PopUp', () => {
  it('Компонент PopUp рендерится', () => {
    const { container } = render(<PopUp />);
    expect(container.firstChild).toHaveClass('popup');
  });
});