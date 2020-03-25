import React, { useState } from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';
import { PopUp } from '../PopUp/PopUp';

export function History() {
  const [toggle, setToggle] = useState(false);
  const handleClickRunBuild = () => {
    setToggle(!toggle)
  }
  return (
    <>
      <div className='history'>
        <Header button history title='philip1967/my-awesome-repo' onClick={handleClickRunBuild} />
        <div className='content'>
          <div className='history__list'>
            <Card />
          </div>
          <button className="button history__button">Show more</button>
        </div>
        {toggle ? <PopUp /> : null}
      </div>
      <Footer />
    </>
  );
}