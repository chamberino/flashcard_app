import React from 'react';
import User from './User';

/* 
This component receives its props from Users 
The data is mapped over returning an array of User components with props available
for each user containing the respective data
*/

const ProfileContainer = (props) => {
    let users = props.data.map( (result) => { 
      // For each user received in props, return a User component with relevant data
      return <User name={`${result.first_name} ${result.last_name}`} id={result._id} key={result._id}/>
    });
    return(
        <div className="user-list">
            {users}
        </div>
    ); 
  }

  export default ProfileContainer;