import React, { useEffect, useState } from 'react';
import './Details.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Card } from '../Card/Card';
import { connect } from 'react-redux';
import { Loader } from '../Loader/Loader';
import { getDetailsBuild, postBuildInQueue } from '../../redux/detailsReducer';

function Details({ match, history, getDetailsBuild, postBuildInQueue, buildInfo, repoName, isLoading, logs }) {
  useEffect(() => {
    getDetailsBuild(match.params.id);
  }, [getDetailsBuild, match.params.id]);


  const { id, buildNumber = 0, commitMessage = 'build not found', commitHash, branchName, authorName, status, start, duration } = buildInfo;

  const HandleredirectSettings = () => {
    history.push('/settings');
  }

  const handleRebuild = () => {
    postBuildInQueue({
      commitHash,
      commitMessage,
      branchName,
      authorName,
      status
    }, history);
  }

  return (
    <>
      <div className='details'>
        <Header button history details title={repoName} onClick={handleRebuild} onClick2={HandleredirectSettings} />
        {isLoading ? <Loader /> :
          <div className='content'>
            <Card details id={id} buildNumber={buildNumber} commitMessage={commitMessage}
              commitHash={commitHash} branchName={branchName} authorName={authorName} status={status} start={start} duration={duration} />
            <div className="details__log">
              <pre>{logs}</pre>
            </div>
          </div>
        }
      </div>
      <Footer />
    </>
  );
}

const mapStateToProps = ({ details }) => ({
  isLoading: details.isLoading,
  repoName: details.repoName,
  buildInfo: details.buildInfo,
  logs: details.logs
});
export const DetailsConnect = connect(mapStateToProps, { getDetailsBuild, postBuildInQueue })(Details);
