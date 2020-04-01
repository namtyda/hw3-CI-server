import React, { useEffect } from 'react';
import Convert from 'ansi-to-html';
import './Details.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Card } from '../Card/Card';
import { connect } from 'react-redux';
import { Loader } from '../Loader/Loader';
import { getDetailsBuild, postBuildInQueue } from '../../redux/detailsReducer';
import { withRouter } from 'react-router-dom';

function Details({ match, history, getDetailsBuild, postBuildInQueue, buildInfo, repoName, isLoading, logs }) {
  useEffect(() => {
    getDetailsBuild(match.params.id, history);
  }, [getDetailsBuild, match.params.id, history]);

  const { id, buildNumber = 0, commitMessage = 'build not found', commitHash, branchName, authorName, status, start, duration } = buildInfo;

  const HandleredirectSettings = () => {
    history.push('/settings');
  }

  const handleRedirectHistory = () => {
    history.push('/history');
  }

  const handleRebuild = () => {
    postBuildInQueue({
      commitHash
    }, history);
  }
  const convert = new Convert({ fg: '#000', bg: '#000' });

  return (
    <>
      <div className='details'>
        <Header button history details title={repoName} onClick={handleRebuild} onClick2={HandleredirectSettings} redirectHistory={handleRedirectHistory} />
        {isLoading ? <Loader /> :
          <div className='content'>
            <Card details id={id} buildNumber={buildNumber} commitMessage={commitMessage}
              commitHash={commitHash} branchName={branchName} authorName={authorName} status={status} start={start} duration={duration} />
            {logs &&
              <div className="details__log">
                <pre dangerouslySetInnerHTML={{ __html: convert.toHtml(logs) }}></pre>
              </div>
            }
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
export const DetailsConnect = withRouter(connect(mapStateToProps, { getDetailsBuild, postBuildInQueue })(Details));
