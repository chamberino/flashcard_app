import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Icon from './SearchIcon';

class Search extends Component {

  constructor (props) {
    super(props);
    this.state= {
      searchOn: false,
      searchInput: '',
      criteria: 'title'
    };
  }

  searchClick = () => {
    this.setState(() => { 
      return {
        searchOn: !this.state.searchOn
      }
    });
  }

  onSearchChange = e => {
    this.setState({ searchInput: e.target.value });
  }

  onCriteriaChange = e => {
    this.setState({ criteria: e.target.value });
  }

  handleSubmit = e => {
    const { searchInput } = this.state;

    e.preventDefault();
    // searchText(searchInput);
    // getCriteria(criteria);
    // this.props.history.push(`/decks/search/${searchInput}`);
    this.props.context.actions.getTitleDecks(searchInput);
    this.setState({searchInput: ''});
    e.currentTarget.reset();

    // if (this.state.criteria === 'title') {
    //   this.props.history.push('/decks');
    // } else if (this.state.criteria === 'subject') {
    //   this.props.history.push(`/subject/`);
    // } else if (this.state.criteria === 'user') {
    //   this.props.history.push(`/user/`);
    // }
  }

    // The header nav is conditionally rendered based on the authenticatedUser state
    render() {
      const { searchOn } = this.state;

      return (
        <div id="searchBar">
          {/* Ternary operator checks if search icon is clicked */}
          {(searchOn) ? (
            <React.Fragment>
              <Icon className="searchIcon" height="15px" width="15px" 
                onClick={this.searchClick} />
                <form className="searchForm" onSubmit={this.handleSubmit}>
                  <select name="criteria" id="criteria-select" 
                    defaultValue='title' onChange={this.onCriteriaChange}>
                      <option value="title">Title</option>
                      <option value="subject">Subject</option>
                      <option value="createdBy">User</option>
                  </select>
                  <input type="search" className="search" onChange={this.onSearchChange} placeholder="Search" />
                </form>
              
              <svg className="closeIcon" height="15px" width="15px" viewBox="0 0 20 20"
                onClick={this.searchClick}>
                <path fill="white" d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08
                c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469
                c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304
                c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path>
              </svg>
            </React.Fragment>
          ) : (
            <Icon className="searchIcon" height="15px" width="15px" 
                onClick={this.searchClick} />
          )}
        </div>
      );
    }
  }

  export default withRouter(Search);