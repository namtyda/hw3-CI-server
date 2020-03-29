import React, { useState, useEffect } from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';
import { PopUp } from '../PopUp/PopUp';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { getBuildListThunk, postNewBuildQueue } from '../../redux/historyReducer';
import { getConfigThunk } from '../../redux/settingsReducer';

function History({ getBuildListThunk, postNewBuildQueue, isLoading, buildList, repoName, history, runNewBuild, errorPostReq, getConfigThunk }) {
  const [toggle, setToggle] = useState(false);
  const [scroll, setScroll] = useState({
    x: 0,
    y: 200
  });

  const [showLimit, setShowLitim] = useState({
    limit: 10
  });

  const [formValue, setFormValue] = useState({
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

  const handleChange = event => {
    const { value, name } = event.currentTarget;
    setFormValue(state => ({ ...state, [name]: value }));
  }

  const handleReset = event => {
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


  const handleDetails = event => {
    const { dataset } = event.currentTarget;
    history.push(`build/${dataset.hash}`);
  }

  const handleShowMore = () => {
    const stepShow = 5;
    setScroll({ x: window.pageXOffset, y: window.pageYOffset });
    setShowLitim((state) => ({ ...state, limit: state.limit + stepShow }));
  }

  const handleRunBuild = (event) => {
    event.preventDefault();
    postNewBuildQueue({
      commitHash: formValue.hash,
    }, history);
  }
  console.count()
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
            <button className="button history__button" onClick={handleShowMore}>Show more</button>
          </div>
        }
        {toggle ? <PopUp found={errorPostReq} onChange={handleChange} onClick={handleReset} name={'hash'} value={formValue.hash} onClickRunBuild={handleRunBuild} closePopUp={handleCloseRunBuild} disabled={runNewBuild} /> : null}
      </div>
      <Footer />
    </>
  );
}
const mapStateToProps = ({ history }) => ({
  isLoading: history.isLoading,
  buildList: history.buildList,
  repoName: history.repoName,
  runNewBuild: history.runNewBuild,
  allBuildList: history.allBuildList,
  errorPostReq: history.errorPostReq
});

export const HistoryConnect = connect(mapStateToProps, { getBuildListThunk, postNewBuildQueue, getConfigThunk })(History);
