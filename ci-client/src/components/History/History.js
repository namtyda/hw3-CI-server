import React, { useState, useEffect } from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';
import { PopUp } from '../PopUp/PopUp';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { getBuildListThunk, postNewBuildQueue } from '../../redux/historyReducer';

function History({ getBuildListThunk, postNewBuildQueue, isLoading, buildList, repoName, history, runNewBuild }) {
  const [toggle, setToggle] = useState(false);
  const [foundCommit, setFoundCommit] = useState(false);
  const [showLimit, setShowLitim] = useState({
    limit: 10
  });

  const [formValue, setFormValue] = useState({
    hash: ''
  });

  const handleChange = event => {
    const { value, name } = event.currentTarget;
    setFormValue(state => ({ ...state, [name]: value }));
  }

  const handleReset = event => {
    const { name } = event.currentTarget;
    event.preventDefault();
    setFormValue(({ [name]: '' }));
    setFoundCommit(false);
  }

  useEffect(() => {
    getBuildListThunk(showLimit.limit);
    localStorage.getItem('repoName')
  }, [getBuildListThunk, showLimit.limit])

  const handleClickRunBuild = () => {
    setToggle(true);
  }

  const handleCloseRunBuild = () => {
    setToggle(false);
    setFoundCommit(false);
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
    setShowLitim((state) => ({ ...state, limit: state.limit + stepShow }));
  }

  const handleRunBuild = (event) => {
    event.preventDefault();
    const searchedObj = buildList.find(({ commitHash }) => commitHash === formValue.hash);
    if (searchedObj) {
      postNewBuildQueue({
        commitHash: searchedObj.commitHash,
        commitMessage: searchedObj.commitMessage,
        branchName: searchedObj.branchName,
        authorName: searchedObj.authorName
      }, history);
    } else {
      setFoundCommit(true);
    }

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
            <button className="button history__button" onClick={handleShowMore}>Show more</button>
          </div>
        }
        {toggle ? <PopUp found={foundCommit} onChange={handleChange} onClick={handleReset} name={'hash'} value={formValue.hash} onClickRunBuild={handleRunBuild} closePopUp={handleCloseRunBuild} disabled={runNewBuild} /> : null}
      </div>
      <Footer />
    </>
  );
}
const mapStateToProps = ({ history }) => ({
  isLoading: history.isLoading,
  buildList: history.buildList,
  repoName: history.repoName,
  runNewBuild: history.runNewBuild
});

export const HistoryConnect = connect(mapStateToProps, { getBuildListThunk, postNewBuildQueue })(History);
