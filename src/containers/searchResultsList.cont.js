import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchingSpecificPlaceActionCreator, selectingPlaceActionCreator } from '../actions';


class SearchResults extends Component {
	constructor(props) {
		super(props);

		this.state = {
			places: [],
			visiblePlaces: [],
			selectedPlace: {},
			placesLoopCycle: 0,
			nullPlacesLoopCycle: 0,
			foundPlacesLoopCycle: 0,
			nullFoundPlacesLoopCycle: 0
		};

		this.onSelecting = this.onSelecting.bind(this);
		this.renderPossiblePlaces = this.renderPossiblePlaces.bind(this);
		this.sortByName = this.sortByName.bind(this);
		this.sortByRating = this.sortByRating.bind(this);
		this.orderBy = this.orderBy.bind(this);
		this.restoreOrder = this.restoreOrder.bind(this);
	}

	componentDidUpdate(oldProps) {
		console.log('cmpDidUpdate RESULTS LIST', this.props.possiblePlaces, this.state);

		if(this.props.possiblePlaces && this.state.placesLoopCycle < 1){
			console.log('cmpDidUpdateOK RESULTS LIST', this.props.possiblePlaces);
			this.setState({
				places: this.props.possiblePlaces.slice().sort(this.sortByName),
				visiblePlaces: this.props.possiblePlaces.slice().sort(this.sortByName),
				placesLoopCycle: this.state.placesLoopCycle + 1
			});
		}
		else if(this.props.possiblePlaces === null && this.state.nullPlacesLoopCycle < 1){
			console.log('cmpDidUpdate BAD!!! RESULTS LIST', this.props.possiblePlaces);
			this.setState({
				places: [], 
				nullPlacesLoopCycle: this.state.nullPlacesLoopCycle + 1,
				placesLoopCycle: 0
			});
		}

		const newProps = this.props;
		console.log('componentDidUpdate', oldProps, newProps);

		if(this.props.findPlaces && JSON.stringify(this.props.findPlaces) !== JSON.stringify([this.state.selectedPlace]) && JSON.stringify(oldProps.findPlaces) !== JSON.stringify(newProps.findPlaces)) {
			console.log('findPlaces', this.props.findPlaces);
			this.setState({
				visiblePlaces: this.props.findPlaces.slice().sort(this.sortByName),
				foundPlacesLoopCycle: this.state.foundPlacesLoopCycle + 1,
				nullFoundPlacesLoopCycle: 0
			});
		}
		else if(this.props.findPlaces === null && this.state.nullFoundPlacesLoopCycle < 1 && this.state.foundPlacesLoopCycle > 0) {
			console.log('findPlaces BAD!!!', this.props.findPlaces);
			this.setState({
				visiblePlaces: this.state.places.slice().sort(this.sortByName),
				foundPlacesLoopCycle: 0,
				nullFoundPlacesLoopCycle: this.state.nullFoundPlacesLoopCycle + 1
			});
		}
	}

	onSelecting(selected) {
		
		this.setState({
			selectedPlace: selected
		}, () => this.props.selectedPlace(this.state.selectedPlace));

		console.log('selected', selected);
		// console.log('selectedAFT', this.state);
	}

	sortByName(a, b) {
		let selectVal = document.getElementById('ordery-by-name').value;


		if(selectVal == 0) {
			// bigger
			if ( a.name > b.name ){
				return -1;
			}
			if ( a.name < b.name ){
				return 1;
			}
				return 0;

		} else {

			if ( a.name < b.name ){
				return -1;
			}
			if ( a.name > b.name ){
				return 1;
			}
				return 0;
		}
	}

	sortByRating(a, b) {
		let selectVal = document.getElementById('ordery-by-rating').value;


		if(selectVal == 1) {
			// bigger
			if ( a.rating > b.rating ){
				return -1;
			}
			if ( a.rating < b.rating ){
				return 1;
			}
				return 0;

		} else {

			if ( a.rating < b.rating ){
				return -1;
			}
			if ( a.rating > b.rating ){
				return 1;
			}
				return 0;
		}
	}

	orderBy(alph) {
		let places = (alph) ? this.state.visiblePlaces.sort(this.sortByName) : this.state.visiblePlaces.sort(this.sortByRating);

		this.setState({
			visiblePlaces: places
		});
	}

	restoreOrder() {
		this.setState({
			visiblePlaces: this.state.places.sort(this.sortByName)
		})

		this.props.searchSpecificPlace(this.state.places);
	}

	renderPossiblePlaces(){

		return (!this.state.visiblePlaces.length) ? null : this.state.visiblePlaces.map( place => (
					<li className={place.id === this.state.selectedPlace.id ? 'active' : ''} key={place.id} onClick={ () => this.onSelecting(place)}>
						<div className="itm-main-info">
							<h2> {place.name} </h2>
							<h3>Rating: {place.rating} </h3>
							<h4> {place.address.street}, {place.address.city}, {place.address.state} </h4>
						</div>
						<div className="contact-info d-flex justify-content-between">
							<a href={place.contact.site}> {place.contact.site} </a>
							<span className="d-block"> {place.contact.phone} </span>
							<span className="d-block"> {place.contact.email} </span>
						</div>
					</li>
				)
			);
			///
	}

	render() {
		return (
			<div>
				<div className="list-display-controls d-flex">
					<form className="list-order-options w-75">
						<div className="form-row align-items-center">
							<div className="col-sm-3 form-group">
								<label className="sr-only" htmlFor="ordery-by-name">Order by</label>
								<select id="ordery-by-name" className="form-control" onChange={ () => this.orderBy(true) }>
									<option defaultValue>Name</option>
									<option value="1">A -> Z</option>
									<option value="0">Z -> A</option>
								</select>
							</div>
							<div className="col-sm-3 form-group">
								<label className="sr-only" htmlFor="ordery-by-rating">Order by</label>
								<select id="ordery-by-rating" className="form-control" onChange={ () => this.orderBy(false) }>
									<option defaultValue>Rating</option>
									<option value="1">Greatest -> Lowest</option>
									<option value="0">Lowest -> Greatest</option>
								</select>
							</div>
						</div>
					</form>
					<button className="w-25" onClick={() => this.restoreOrder()} >
						Show all
					</button>
				</div>
				<div className="col p-0 list-wrapper" style={{position: 'relative'}}>
					<ul className="search-list-results m-0">
						{this.renderPossiblePlaces()}
					</ul>
				</div>
			</div>
		);
		// 
	}

	componentWillUnmount() {
		this.setState({
			places: [],
			visiblePlaces: [],
			selectedPlace: {},
			placesLoopCycle: 0,
			nullPlacesLoopCycle: 0,
			foundPlacesLoopCycle: 0,
			nullFoundPlacesLoopCycle: 0
		});
	}
}

function mapStateToProps ( state ) {
	return {
		possiblePlaces: state.fetchInfoPlaces,
		findPlaces: state.findPlaces
	};
}


function mapDispatchToProps ( dispatch ) {
	return bindActionCreators( { 
		searchSpecificPlace: searchingSpecificPlaceActionCreator,
		selectedPlace: selectingPlaceActionCreator
	}, dispatch );
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);

