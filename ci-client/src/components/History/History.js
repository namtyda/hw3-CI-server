import React from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';

export function History() {
  return (
    <>
    <div className='history'>
      <Header button history title='philip1967/my-awesome-repo' />
      <div className='content'>
        <div className='history__list'>
          <Card />
        </div>
        <button class="button history__button">Show more</button>
      </div>
    </div>
    <Footer />
    </>
  );
}