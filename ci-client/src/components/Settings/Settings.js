import React, { useState } from 'react';
import './Settings.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
const initialState = {
  repoName: '',
  buildCommand: 'npm ci && npm run build',
  mainBranch: 'master |',
  period: ''
}
export function Settings() {
  const [formValues, setFormValues] = useState(initialState);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    console.log(/(.)\/(.)/g.test(value));
  }
  return (
    <>
      <div className='settings'>
        <Header settings title='School CI server' text='test' />
        <div className='content'>
          <h2 className="settings__title">Settings</h2>
          <p className="settings__subtitle">Configure repository connection and synchronization settings.</p>
          <form className='settings__form'>
            <Input labelText='GitHub repository' name='repoName' placeholder='user-name/repo-name' require onChange={handleChange} value={formValues.repoName} />
            <Input labelText='Build command' name='buildCommand' placeholder='build command' require onChange={handleChange} value={formValues.buildCommand} />
            <Input labelText='Main branch' name='mainBranch' placeholder='branch' onChange={handleChange} value={formValues.mainBranch} />
            <div className="settings__time-wrapper">
              <p className="settings__paragraph">Synchronize every</p>
              <input className="input__field input__field_time" type="text" maxLength="3" name='period' onChange={handleChange} value={formValues.period} />
              <p className="settings__paragraph">minutes</p>
            </div>
            <div className="settings__button-wrapper">
              <Button accent text='Save' settings />
              <Button text='Cancel' />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}