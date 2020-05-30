import React from 'react';
import './PopUp.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useTranslation } from 'react-i18next';
interface PopUpProps {

  onClickRunBuild: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closePopUp(): void;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  found?: boolean;
  name: string;
  value: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export function PopUp({ onChange, name, value, onClick, onClickRunBuild, closePopUp, disabled, found }: PopUpProps) {
  const { t } = useTranslation();

  return (
    <div className='popup'>
      <div className='popup__wrapper'>
        <form className='popup__form'>
          <h3 className='popup__title'>{t('newBuild')}</h3>
          <p className='popup__description'>{t('descPopUp')}</p>
          <Input placeholder='Commit hash' onClick={onClick} onChange={onChange} name={name} value={value} />
          <div className='popup__button-wrapper'>
            <Button accent text={t('runBuild')} settings onClick={onClickRunBuild} disabled={disabled} />
            <Button text={t('cancel')} onClick={closePopUp} />
            {found && <span className='popup__err'>{t('commitNotFound')}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}