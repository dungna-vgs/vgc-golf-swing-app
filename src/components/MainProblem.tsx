import React, { useCallback, useEffect, useState } from 'react';
import { Problem } from './SwingProcess';
import WarningIcon from '@/assets/icons/ic-warning.svg';

type Props = {
  problems: Problem[];
};

const MainProblem: React.FC<Props> = ({ problems }) => {
  const [mainProblem, setMainProblem] = useState<Problem>(null);

  useEffect(() => {
    if (problems?.length && !mainProblem) {
      const maxSeverityProblem = problems.reduce(
        (maxProblem, currentProblem) => {
          return currentProblem.Severity > maxProblem.Severity
            ? currentProblem
            : maxProblem;
        }
      );

      setMainProblem(maxSeverityProblem);
    }
  }, [problems]);

  const problemResult = useCallback(() => {
    if (mainProblem) {
      const { Severity } = mainProblem;
      let label: string;
      let color: string;
      let backgroundColor: string;
      switch (Severity) {
        case 0:
          label = 'Tạm';
          color = '#F7941D';
          backgroundColor = 'rgba(247, 148, 29, 0.4)';
          break;
        case 1:
          label = 'Cần thiết';
          color = '#F7941D';
          backgroundColor = 'rgba(247, 148, 29, 0.4)';
          break;
        case 2:
          label = 'Không tốt';
          color = '#E64646';
          backgroundColor = 'rgba(230, 70, 70, 0.4)';
          break;
        default:
          label = 'Lỗi';
          color = '#E64646';
          backgroundColor = 'rgba(230, 70, 70, 0.4)';
          break;
      }
      return (
        <>
          <div className='main-problem__label' style={{ backgroundColor }}>
            <span style={{ color }}>{label}</span>
          </div>

          <div className='main-problem__result'>
            <div className='main-problem__progress'>
              <div
                className='progress-bar'
                style={{
                  width: `${Math.floor(mainProblem.Score)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className='main-problem__score'>
              <span style={{ color }}>{mainProblem.Score}</span>/100
            </span>
          </div>
        </>
      );
    }
    return null;
  }, [mainProblem]);

  return !problems.length || !mainProblem ? null : (
    <div className='main-problem'>
      <div className='main-problem__title'>
        <span>Vấn đề chính</span>
        <div className='tooltip'>
          <WarningIcon />
          <p className='tooltiptext tooltip-bottom'>
            {
              'Chúng tôi khuyến nghị ưu tiên luyện tập cho vấn đề chính được chọn, dựa trên mức độ và tính nghiêm trọng của lỗi được phát hiện qua phân tích bởi AI. Ví dụ: nếu một người chơi nâng cao gặp phải lỗi thường thấy ở người mới bắt đầu, lỗi đó sẽ được phân loại là lỗi cần luyện tập ưu tiên.'
            }
          </p>
        </div>
      </div>
      <p>{mainProblem?.IssueName}</p>
      {problemResult()}
    </div>
  );
};

export default MainProblem;
