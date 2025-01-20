import React from 'react';
import GolfImage from '@/assets/images/golf.png';

type Props = {
  analysisScore: number;
};

const ScoreSection: React.FC<Props> = ({ analysisScore }) => {
  return (
    <div className='score-section'>
      <div className='analysis-score'>
        <p>Điểm tư thế đánh</p>
        <div className='score-container'>
          <p>
            <span className='gradient-score'>{analysisScore}</span>
            /10
          </p>
        </div>
      </div>
      <img src={GolfImage} alt="golf" />
    </div>
  );
};

export default ScoreSection;
