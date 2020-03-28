import React, { useState } from 'react';
import MaskedInput from 'react-text-mask'
import './Settings.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { postSaveSettings } from '../../redux/settingsReducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const initialState = {
  repoName: '',
  buildCommand: 'npm ci && npm run build',
  mainBranch: 'master',
  period: ''
}
function Settings({ history, postSaveSettings, isCloning, cloningWithError }) {
  const [formValues, setFormValues] = useState(initialState);

  const handleChange = event => {
    const { name, value } = event.target;
    console.log(formValues.period)
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  const handleResetField = event => {
    event.preventDefault();
    const { name } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: '' }));
  }

  const handleCancel = event => {
    event.preventDefault();
    history.goBack();
  }
  const handleSaveSettings = event => {
    event.preventDefault();
    if (/(.)\/(.)/g.test(formValues.repoName) && formValues.buildCommand.length > 5 && formValues.period.length > 0) {
      postSaveSettings(formValues, history);
    }
  }

  return (
    <>
      <div className='settings'>
        <Header settings title='School CI server' text='test' />
        <div className='content'>
          <h2 className="settings__title">Settings</h2>
          <p className="settings__subtitle">Configure repository connection and synchronization settings.</p>
          <form className='settings__form'>
            <Input labelText='GitHub repository' name='repoName' placeholder='user-name/repo-name' require onChange={handleChange} value={formValues.repoName} onClick={handleResetField} />
            <Input labelText='Build command' name='buildCommand' placeholder='build command' require onChange={handleChange} value={formValues.buildCommand} onClick={handleResetField} />
            <Input labelText='Main branch' name='mainBranch' placeholder='branch' onChange={handleChange} value={formValues.mainBranch} onClick={handleResetField} />
            {cloningWithError && <span className='settings__fail'>fail clone repository</span>}
            <div className="settings__time-wrapper">
              <p className="settings__paragraph">Synchronize every</p>
              <MaskedInput className="input__field input__field_time" name='period' onChange={handleChange} value={formValues.period} mask={[/\d/, /\d/]} guide={false} />
              <p className="settings__paragraph">minutes</p>
            </div>
            <div className="settings__button-wrapper">
              <Button accent text='Save' settings onClick={handleSaveSettings} disabled={isCloning} />
              <Button text='Cancel' disabled={isCloning} onClick={handleCancel} />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

const mapStateToProps = ({ settings }) => ({
  isCloning: settings.isCloning,
  cloningWithError: settings.cloningWithError
});

export const SettingsConnect = withRouter(connect(mapStateToProps, { postSaveSettings })(Settings));
