import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { searchingSpecificPlaceActionCreator } from '../actions';


class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			text: '',
			allPlaces: [],
			filteredPlaces: [],
			placesLoopCycle: 0,
			nullPlacesLoopCycle: 0
		};

		this.onInputting = this.onInputting.bind(this);
		this.onSearching = this.onSearching.bind(this);
	}

	componentDidUpdate() {
		// console.log('cmpDidUpdate SEARCHBAR', this.props.possiblePlaces, this.state);

		if(this.props.possiblePlaces && this.state.placesLoopCycle < 1){
			// console.log('cmpDidUpdateOK SEARCHBAR', this.props.possiblePlaces)
			this.setState({
				allPlaces: this.props.possiblePlaces.slice(),
				filteredPlaces: this.props.possiblePlaces.slice(),
				placesLoopCycle: this.state.placesLoopCycle + 1
			});
		}
		else if(this.props.possiblePlaces === null && this.state.nullPlacesLoopCycle < 1){
			this.setState({
				allPlaces: [], 
				nullPlacesLoopCycle: this.state.nullPlacesLoopCycle + 1,
				placesLoopCycle: 0
			});
		}

		if(this.props.findPlaces) {
			console.log('findPlaces', this.props.findPlaces);
		}
	}

	onInputting(ev) {
		this.setState({text: ev.target.value});
		console.log('onInputting', this.state);
	}

	onSearching(ev) {
		if(ev) ev.preventDefault();
		const theText = this.state.text;
		this.setState({
			text: '',
			filteredPlaces: this.state.allPlaces.filter(place => place.name.toLowerCase().indexOf(theText.toLowerCase()) > -1)
		}, () => {
			console.log('onSearching', this.state);
			if(this.state.filteredPlaces.length) this.props.searchSpecificPlace(this.state.filteredPlaces);
		});
	}

	render() {
		return (
			<div className="search-bar-wrapper">
				<form className="search-bar-form input-group" onSubmit={this.onSearching} >
					<input className="form-control" value={this.state.text} onInput={this.onInputting} />
					<span className="input-group-btn">
						<button className="btn btn-secondary">
							<FontAwesomeIcon icon="search" />
						</button>
					</span>
				</form>
			</div>
		)
	}
}

function mapStateToProps ( state ) {
	return {
		possiblePlaces: state.fetchInfoPlaces
	};
}


function mapDispatchToProps ( dispatch ) {
	return bindActionCreators( { 
		searchSpecificPlace: searchingSpecificPlaceActionCreator
	}, dispatch );
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);