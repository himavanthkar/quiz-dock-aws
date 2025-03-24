import React from 'react';

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center my-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner; 