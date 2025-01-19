import React from 'react';
import WarningIcon from '../assets/icons/ic-warning.svg';

export type Problem = {
  ProblemId: number;
  Score: number;
  Severity: number;
  StepId: number;
  IssueName: string;
  Description: string;
  StepName: string;
  Guidelines: string[];
};

export type Step = {
  FrameIndex: number;
  Id: number;
};

type SwingProcessProps = {
  problems: Problem[];
  steps: Step[];
};

const SwingProcess: React.FC<SwingProcessProps> = ({ problems, steps }) => {
  if (!problems.length) return null;

  return (
    <div className='swing-process'>
      <div className='swing-process__title'>
        <strong style={{ fontSize: 14 }}>Quy trình Swing theo từng bước</strong>
        <div className='tooltip'>
          <WarningIcon />
          <p className='tooltiptext tooltip-bottom'>
            Pass: Bước này không có vấn đề gì.
            <br />
            Miss: Bước này có 1 vấn đề được phát hiện.
            <br />
            Fail: Bước này có 2 vấn đề được phát hiện.
          </p>
        </div>
      </div>
      <div className='swing-process__list'>
        {steps.map(({ Id }) => {
          const stepProblems = problems.filter((p) => p.StepId === Id).length;
          const isMiss = stepProblems === 1;
          const isFail = stepProblems > 1;

          return (
            <div
              key={`${Id}`}
              className={`swing-process__step ${
                isMiss ? 'miss' : isFail ? 'fail' : ''
              }`}
            >
              <div></div>
              <span>{isMiss ? 'Miss' : isFail ? 'Fail' : 'Pass'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SwingProcess;
