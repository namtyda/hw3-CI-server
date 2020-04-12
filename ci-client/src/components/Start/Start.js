import React, { useEffect } from 'react';
import './Start.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';
import { Footer } from '../Footer/Footer';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from './selectors';

function Start({ getConfigThunk, history, isLoad }) {
  useEffect(() => getConfigThunk(history), [getConfigThunk, history]);

  const handleRedirectSettings = () => {
    history.push('/settings');
  }
  return (
    <>
      <div className='start'>
        <Header button title='School CI server' onClick={handleRedirectSettings} />
        {isLoad ? <Loader /> :
          <div className='settings-info content'>
            <img className="settings-info__img" src="images/settingslogo.svg" alt="key and screw" />
            <p className="settings-info__text">
              Configure repository connection
              and synchronization settings
            </p>
            <Button text='Open settings' accent onClick={handleRedirectSettings} />
          </div>
        }
      </div>
      <Footer />
    </>
  );
}

export const StartConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(Start))