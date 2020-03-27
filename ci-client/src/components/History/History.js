import React, { useState, useEffect } from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';
import { PopUp } from '../PopUp/PopUp';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { getBuildListThunk } from '../../redux/historyReducer';

function History({ getBuildListThunk, isLoading, buildList, repoName, history }) {
  const [toggle, setToggle] = useState(false);

  const [showLimit, setShowLitim] = useState({
    limit: 10
  });

  useEffect(() => {
    getBuildListThunk(showLimit.limit);
    localStorage.getItem('repoName')
  }, [getBuildListThunk, showLimit.limit])

  const handleClickRunBuild = () => {
    setToggle(!toggle);
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
  // const testFilter = buildList.filter(({ commitHash }) => commitHash === '2b1ccca3e40d91befb2f74be4bda48ba6d0d4d43')


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
        {toggle ? <PopUp /> : null}
      </div>
      <Footer />
    </>
  );
}
const mapStateToProps = ({ history }) => ({
  isLoading: history.isLoading,
  buildList: history.buildList,
  repoName: history.repoName
});

export const HistoryConnect = connect(mapStateToProps, { getBuildListThunk })(History);