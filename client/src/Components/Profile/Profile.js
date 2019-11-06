import React from 'react';
import { Link } from 'react-router-dom';

/* 
  User component receives props from UsersContainer
  The props passed down in UsersContainer from Users is mapped over returning 
  this User component for each user in the users array returned from the API
*/

const Profile = props => (
  <div className="grid-33"><Link className="user--module user--link" to={'/user/' + props.id}>
          <h3 className="user--name">{props.name}</h3>
    </Link></div>
);

export default Profile;