import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-dropdown'
import Icon from './SearchIcon';

import { fadeIn, fadeOut } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

import 'react-dropdown/style.css'

class Search extends Component {

  constructor (props) {
    super(props);
    this.state= {
      searchOn: props.searchOpen,
      searchClick: props.searchClick,
      term: '',
      category: 'title',
      fade: {},
      fadeIn: {
        animation: 'x .5s',
        animationName: Radium.keyframes(fadeIn, 'fadeIn')
      },
      fadeOut: {
        animation: 'x .5s',
        animationName: Radium.keyframes(fadeOut, 'fadeOut')
      }    
    };
  }

  // searchClick = () => {
    
  //   this.setState(() => { 
  //     return {
  //       searchOn: !this.state.searchOn
  //     }
  //   });
  // }

  onSearchChange = e => {
    this.setState({ term: e.target.value });
  }

  subjectChange = (event) => {
    // Any changes made in the input fields will update it's corresponding property in state   
    const value = event.value;
    this.setState(() => {
      return {
        category: value,      
      };
    });
}

  onCriteriaChange = e => {
    this.setState({ category: e.target.value });
  }

  handleSubmit = e => {
    const { category, term } = this.state;

    e.preventDefault();
    // searchText(searchInput);
    // getCriteria(criteria);
    this.props.history.push(`/decksearch/${category}/${term}`);
    this.setState({term: ''});
  }

  componentDidMount() {
    this.setState(() => { 
          return {
            fade: this.state.fadeIn
          }
        });
  }

    // The header nav is conditionally rendered based on the authenticatedUser state
    render() {
      const { searchOn, term, category, searchClick } = this.state;

      return (
          <div id="searchBar">
            {/* Ternary operator checks if search icon is clicked */}
            {(this.props.searchOpen) ? (
              <React.Fragment>
                <Icon className="searchIcon" height="15px" width="15px" 
                  onClick={searchClick} />
                  <form className="searchForm" onSubmit={this.handleSubmit}>
                  <Dropdown options={[{label: "Title", value:'title'}, {label: "Subject", value:'subject'}, {label: "User", value:'user'}]} value={this.state.category} placeholder="Choose a subject" onChange={this.subjectChange} className='dropdown-search'/ >
                    {/* <select name="criteria" id="criteria-select" 
                      defaultValue='title' onChange={this.onCriteriaChange}>
                        <option value="title">Title</option>
                        <option value="subject">Subject</option>
                        <option value="user">User</option>
                    </select> */}
                    <input type="search" className="search" onChange={this.onSearchChange} placeholder={`Search by ${category}...`} value={term}/>
                  </form>
                
                <svg className="closeIcon" height="15px" width="15px" viewBox="0 0 20 20"
                  onClick={searchClick}>
                  <path fill="white" d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08
                  c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469
                  c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304
                  c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path>
                </svg>
              </React.Fragment>
            ) : (
              <Icon className="searchIcon" height="15px" width="15px" 
                  onClick={searchClick} />
            )}
          </div>
      );
    }
  }

  export default withRouter(Search);