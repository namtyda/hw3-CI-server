import React, { useState, useEffect } from 'react';
import './History.scss';
import { Header } from '../Header/Header';
import { Card } from '../Card/Card';
import { Footer } from '../Footer/Footer';
import { PopUp } from '../PopUp/PopUp';
import { Loader } from '../Loader/Loader';
import { connect } from 'react-redux';
import { getBuildListThunk } from '../../redux/historyReducer';

function History({ getBuildListThunk, isLoading, buildList }) {
  useEffect(() => getBuildListThunk(), [getBuildListThunk])
  const [toggle, setToggle] = useState(false);

  const handleClickRunBuild = () => {
    setToggle(!toggle)
  }
  const mapCardTopData = buildList.map(({ id, buildNumber, commitMessage, commitHash, branchName, authorName, status, start, duration }) => {
    return <Card key={id} id={id} buildNumber={buildNumber} commitMessage={commitMessage}
      commitHash={commitHash.slice(0, 6)} branchName={branchName} authorName={authorName} status={status} start={start} duration={duration}
    />
  });
  return (
    <>
      <div className='history'>
        <Header button history title='philip1967/my-awesome-repo' onClick={handleClickRunBuild} />
        {isLoading ? <Loader /> :
          <div className='content'>
            <div className='history__list'>
              {mapCardTopData}
            </div>
            <button className="button history__button">Show more</button>
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
  buildList: history.buildList
});

export const HistoryConnect = connect(mapStateToProps, { getBuildListThunk })(History);