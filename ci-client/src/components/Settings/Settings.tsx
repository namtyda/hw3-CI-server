import React, { useState } from 'react';
import classNames from 'classnames';
import MaskedInput from 'react-text-mask'
import './Settings.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { postSaveSettings } from '../../redux/settingsReducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { rootReducerTypes } from '../../redux/root-reducer';
import { History } from 'history';
import { Config } from '../../api/api';
import { useTranslation } from 'react-i18next';

const initialState: Config = {
  repoName: '',
  buildCommand: 'npm ci && npm run build',
  mainBranch: 'master',
  period: 1
}

interface SettingsProps {
  history: History;
  postSaveSettings(value: Config, history: History): void;
  isCloning: boolean;
  cloningWithError: boolean;
}
function Settings({ history, postSaveSettings, isCloning, cloningWithError }: SettingsProps) {
  const [formValues, setFormValues] = useState(initialState);
  const [inputError, setInputError] = useState({
    repoName: false,
    buildCommand: false,
    mainBranch: false,
    period: false
  });
  const { t } = useTranslation();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  const handleResetField = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const { name } = event.currentTarget;
    setFormValues((prev) => ({ ...prev, [name]: '' }));
  }

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    history.goBack();
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = event.currentTarget;
    setInputError(state => ({ ...state, [name]: false }));
  }
  const handleSaveSettings = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const errors = {
      repoName: false,
      buildCommand: false,
      mainBranch: false,
      period: false
    }
    if (!(/(.)\/(.)/g.test(formValues.repoName)) && !(formValues.repoName.length > 2)) {
      errors.repoName = true;
    }
    if (!(formValues.buildCommand.length > 5)) {
      errors.buildCommand = true;
    }
    if (!(formValues.mainBranch.length > 0)) {
      errors.mainBranch = true;
    }
    if (!(String(formValues.period).length > 0)) {
      errors.period = true;
    }
    if (!(errors.repoName) && !(errors.buildCommand) && !(errors.mainBranch) && !(errors.period)) {
      return postSaveSettings(formValues, history);
    }
    setInputError(state => ({ ...state, ...errors }));
  }

  const classMakeInput = classNames('input__field', 'input__field_time', {
    'input__error': inputError.period
  });
  return (
    <>
      <div className='settings'>
        <Header settings title='School CI server' />
        <div className='content'>
          <h2 className="settings__title">{t('settings')}</h2>
          <p className="settings__subtitle">{t('settingTitle')}</p>
          <form className='settings__form'>
            <Input labelText={t('github')} name='repoName' placeholder='user-name/repo-name' require onChange={handleChange} value={formValues.repoName} onClick={handleResetField} error={inputError.repoName} onFocus={handleFocus} />
            <Input labelText={t('buildCommand')} name='buildCommand' placeholder='build command' require onChange={handleChange} value={formValues.buildCommand} onClick={handleResetField} error={inputError.buildCommand} onFocus={handleFocus} />
            <Input labelText={t('mainBranch')} name='mainBranch' placeholder='branch' onChange={handleChange} value={formValues.mainBranch} onClick={handleResetField} error={inputError.mainBranch} onFocus={handleFocus} />
            {cloningWithError && <span className='settings__fail'>{t('failClone')}</span>}
            <div className="settings__time-wrapper">
              <p className="settings__paragraph">{t('sync.p1')}</p>
              <MaskedInput className={classMakeInput} name='period' onChange={handleChange} value={formValues.period} mask={[/\d/, /\d/]} guide={false} onFocus={handleFocus} />
              <p className="settings__paragraph">{t('sync.p2')}</p>
            </div>
            <div className="settings__button-wrapper">
              <Button accent text={t('save')} settings onClick={handleSaveSettings} disabled={isCloning} />
              <Button text={t('cancel')} disabled={isCloning} onClick={handleCancel} />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

const mapStateToProps = ({ settings }: rootReducerTypes) => ({
  isCloning: settings.isCloning,
  cloningWithError: settings.cloningWithError
});

export const SettingsConnect = withRouter(connect(mapStateToProps, { postSaveSettings })(Settings));
