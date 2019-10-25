import React from 'react';
import Subject from './Subject';

/* 
This component receives its props from Subjects 
The data is mapped over returning an array of User components with props available
for each user containing the respective data
*/

const SubjectContainer = (props) => {
    let subjects = props.data.map( (result) => { 
      // For each subject received in props, return a Subject component with relevant data
      return <Subject name={result.name} id={result._id} key={result._id}/>
    });
    return(
        <div className="subject-list">
            {subjects}
        </div>
    ); 
  }

  export default SubjectContainer;