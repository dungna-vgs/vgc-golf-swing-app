import React from 'react';

type Record = {
  Club: 'DRIVER' | 'IRON';
  Direction: 'SIDE' | 'FRONT';
  Hand: 'RIGHT' | 'LEFT';
};

type Props = {
  record: Record;
};

const SwingInfo: React.FC<Props> = ({ record }) => {
  if (!record) return null;

  return (
    <div className='swing-info'>
      <h3>Thông tin cú đánh swing</h3>
      <p>
        <span>Góc máy</span>
        {record.Direction === 'FRONT' ? 'Trực diện' : 'Chéo'}
      </p>
      <p>
        <span>Gậy</span>
        {record.Club === 'DRIVER' ? 'Drive' : 'Sắt'}
      </p>
      <p>
        <span>Tay thuận</span>
        {record.Hand === 'RIGHT' ? 'Tay phải' : 'Tay trái'}
      </p>
    </div>
  );
};

export default SwingInfo;
