import React from 'react';
import WarningIcon from '@/assets/icons/ic-warning.svg';
import { GOLF_SWING_STEPS } from '@/constants';

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

type SwingProcessProps = {
  problems: Problem[];
};

const SwingProcess: React.FC<SwingProcessProps> = ({ problems }) => {
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
        {GOLF_SWING_STEPS.map(({ id, name }) => {
          const stepProblems = problems.filter((p) => p.StepId === id).length;
          const isMiss = stepProblems === 1;
          const isFail = stepProblems > 1;

          return (
            <div
              key={`${id}`}
              className={`swing-process__step ${
                isMiss ? 'miss' : isFail ? 'fail' : ''
              }`}
            >
              <div>
                <p>{name}</p>
              </div>
              <span>{isMiss ? 'Tạm' : isFail ? 'Lỗi' : 'Tốt'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SwingProcess;
