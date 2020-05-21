import React, { useEffect } from 'react';
import './Start.scss';
import { Header } from '../Header/Header';
import { Button } from '../Button/Button';
import { Footer } from '../Footer/Footer';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
interface StartProps {
  getConfigThunk(history: History): void;
  history: History;
  isLoad: boolean;
}

function Start({ getConfigThunk, history, isLoad }: StartProps) {
  useEffect(() => getConfigThunk(history), [getConfigThunk, history]);
  const { t } = useTranslation();

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
              {t('startTitle')}
            </p>
            <Button text={t('openSettings')} accent onClick={handleRedirectSettings} />
          </div>
        }
      </div>
      <Footer />
    </>
  );
}

export const StartConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(Start))