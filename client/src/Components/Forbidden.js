import React from 'react';

const Forbidden = () => {
    return (
      <div className="main-content error">
        <i className="material-icons icn-error"></i>
        <h2>Forbidden</h2>
        <p>Sorry! You are not authorized to access this page.</p>
      </div>
    );
};
    
export default Forbidden;
