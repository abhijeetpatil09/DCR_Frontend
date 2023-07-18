import React from 'react';

import loading from '../../Assets/loading.gif';

const Spinner = () => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <img src={loading} alt="loading" style={{ color: 'red' }} />
    </div>
  );
}

export default Spinner;
