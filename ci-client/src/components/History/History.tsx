import React, { useState, useEffect } from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';
import { PopUp } from '../PopUp/PopUp';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps, postNewBuild } from './selectors';
import { getBuilds, Status } from '../../api/api';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

interface HistoryProps {
  getBuildListThunk(limit: number): void;
  postNewBuildQueue(obj: postNewBuild, history: History): void;
  getConfigThunk(history: History): void;
  isLoading: boolean;
  buildList: getBuilds<Status>[];
  repoName: string;
  history: History;
  runNewBuild: boolean;
  errorPostReq: boolean;
}
function HistoryComp({ getBuildListThunk, postNewBuildQueue, isLoading, buildList, repoName, history, runNewBuild, errorPostReq, getConfigThunk }: HistoryProps) {
  const [toggle, setToggle] = useState<boolean>(false);
  const { t } = useTranslation();

  interface scroll {
    x: number;
    y: number;
  }
  const [scroll, setScroll] = useState<scroll>({
    x: 0,
    y: 200
  });

  interface showLimit {
    limit: number
  }
  const [showLimit, setShowLitim] = useState<showLimit>({
    limit: 10
  });

  interface setFormValues {
    [name: string]: string;
  }
  const [formValue, setFormValue] = useState<setFormValues>({
    hash: ''
  });

  useEffect(() => {
    window.scrollTo(scroll.x, scroll.y);
  });

  useEffect(() => {
    getConfigThunk(history)
  }, [getConfigThunk, history]);

  useEffect(() => {
    getBuildListThunk(showLimit.limit);
  }, [getBuildListThunk, showLimit.limit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.currentTarget;
    setFormValue(state => ({ ...state, [name]: value }));
  }

  const handleReset = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const { name } = event.currentTarget;
    event.preventDefault();
    setFormValue(({ [name]: '' }));
  }


  const handleClickRunBuild = () => {
    setToggle(true);
  }

  const handleCloseRunBuild = () => {
    setToggle(false);
    setFormValue(({ hash: '' }));
  }
  const handleRedirect = () => {
    history.push('/settings')
  }


  const handleDetails = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const { dataset } = event.currentTarget;
    history.push(`/build/${dataset.hash}`);
  }

  const handleShowMore = () => {
    const stepShow = 5;
    setScroll({ x: window.pageXOffset, y: window.pageYOffset });
    setShowLitim((state) => ({ ...state, limit: state.limit + stepShow }));
  }

  const handleRunBuild = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    postNewBuildQueue({
      commitHash: formValue.hash,
    }, history);
  }
  const mapCardTopData = buildList.map(({ id, buildNumber, commitMessage, commitHash, branchName, authorName, status, start, duration }) => {
    return <Card key={id} id={id} buildNumber={buildNumber} commitMessage={commitMessage}
      commitHash={commitHash} branchName={branchName} authorName={authorName} status={status} start={start} duration={duration} onClick={handleDetails}
    />
  });
  return (
    <>
      <div className='history'>
        <Header button history title={repoName} onClick={handleClickRunBuild} onClick2={handleRedirect} />
        {isLoading ? <Loader /> :
          <div className='content'>

            <div className='history__list'>
              {mapCardTopData}
            </div>
            <button className="button history__button" onClick={handleShowMore}>{t('showBtn')}</button>
          </div>
        }
        {toggle ? <PopUp found={errorPostReq} onChange={handleChange} onClick={handleReset} name={'hash'} value={formValue.hash} onClickRunBuild={handleRunBuild} closePopUp={handleCloseRunBuild} disabled={runNewBuild} /> : null}
      </div>
      <Footer />
    </>
  );
}


export const HistoryConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoryComp));
