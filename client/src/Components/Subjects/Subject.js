import React from 'react';
import { Link } from 'react-router-dom';

/* 
  Subject component receives props from SubjectsContainer
  The props passed down in SubjectsContainer from Subjects is mapped over returning 
  this Subject component for each subject in the subjects array returned from the API
*/

const Subject = props => (
  <div className="grid-33"><Link className="subject--module subject--link" to={'/subject/' + props.id}>
          <h3 className="subject--name">{props.name}</h3>
    </Link></div>
);

export default Subject;