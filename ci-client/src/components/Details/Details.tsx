import React, { useEffect } from 'react';
import Convert from 'ansi-to-html';
import './Details.scss';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Card } from '../Card/Card';
import { connect } from 'react-redux';
import { Loader } from '../Loader/Loader';
import { withRouter, match } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { History } from 'history';
import { addQueue} from '../../api/api';
import { getBuildInfoDetails } from '../../redux/detailsReducer';
interface optionRoute {
  id: string;
}
interface DetailsProps {
  match: match<optionRoute>;
  history: History;
  getDetailsBuild(match: string, history: History): void;
  postBuildInQueue(obj: addQueue, history: History): void;
  buildInfo: getBuildInfoDetails;
  repoName: string;
  isLoading: boolean;
  logs: string;
}

function Details({ match, history, getDetailsBuild, postBuildInQueue, buildInfo, repoName, isLoading, logs }: DetailsProps) {
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

export const DetailsConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(Details));
