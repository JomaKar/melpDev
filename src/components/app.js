import React, { Component } from 'react';

import ResultsMainWrapper from '../containers/resultsMainWrapper.cont';
import SearchBar from '../containers/searchBar.cont';

export default class App extends Component {
  render() {
    return (
      <div className="container">
      	<h1>Start searching the best Restaurants info</h1>
      	<SearchBar />
      	<ResultsMainWrapper />
      </div>
    );
  }
}
