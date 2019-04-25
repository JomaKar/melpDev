import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchResults from '../containers/searchResultsList.cont';
import MapSection from '../containers/mapSection.cont';

import { fetchingActionCreator } from '../actions';


class ResultsMainWrapper extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		this.props.searchAllPlaces();
	}

	render() {
		return (
			<div className="resultsWrapper row">
				<div className="col-sm-6 col-xs-12 order-sm-2 map-container">
					<MapSection />
				</div>
				<div className="col-sm-6 col-xs-12 order-sm-1">
					<SearchResults />
				</div>
			</div>
		)
	}
}

function mapDispatchToProps ( dispatch ) {
	return bindActionCreators( { 
		searchAllPlaces: fetchingActionCreator
	}, dispatch );
}

export default connect(null, mapDispatchToProps)(ResultsMainWrapper);