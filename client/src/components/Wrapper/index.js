import React from 'react';

function Wrapper(props) {
  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      { props.children }
    </div>
  );
}

export default Wrapper;
