import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class MapSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			places: [],
			visiblePlaces: [],
			mapLocation: {},
			placesLoopCycle: 0,
			nullPlacesLoopCycle: 0,
			nullFoundPlacesLoopCycle: 0,
			numberOfPlacesOnRadio: 0,
			avgRatingOfPlacesOnRadio: 0,
			ratingStdDeviationOfPlacesOnRadio: 0,
			foundPlacesLoopCycle: 0,
			bestPlaces: []
		};

		this.renderMap = this.renderMap.bind(this);
		this.renderIncluededPlacesInfo = this.renderIncluededPlacesInfo.bind(this);
	}


	componentDidUpdate(oldProps) {
		// console.log('cmpDidUpdate', this.props.possiblePlaces, this.state);

		if(this.props.possiblePlaces && this.state.placesLoopCycle < 1){
			// console.log('cmpDidUpdateOK MAPCONTAINER', this.props.possiblePlaces);
			this.setState({
				places: this.props.possiblePlaces,
				visiblePlaces: this.props.possiblePlaces,
				placesLoopCycle: this.state.placesLoopCycle + 1
			});

			let mapInterval = setInterval(() => {
				if(document.getElementById('theMap')) {
					clearInterval(mapInterval);
					this.renderMap();
				}
			}, 10);		
		}
		else if(this.props.possiblePlaces === null && this.state.nullPlacesLoopCycle < 1){
			this.setState({
				places: [], 
				nullPlacesLoopCycle: this.state.nullPlacesLoopCycle + 1,
				placesLoopCycle: 0
			});
		}

		console.log('this.props.findPlaces', this.props.findPlaces);

		const newProps = this.props;
		console.log('componentDidUpdate', oldProps, newProps);

		if(this.props.findPlaces && JSON.stringify(oldProps.findPlaces) !== JSON.stringify(newProps.findPlaces)) {
			console.log('findPlaces MAP!!!!', this.props.findPlaces);
			this.setState({
				visiblePlaces: this.props.findPlaces.slice(),
				foundPlacesLoopCycle: this.state.foundPlacesLoopCycle + 1,
				nullFoundPlacesLoopCycle: 0,
				numberOfPlacesOnRadio: 0,
				avgRatingOfPlacesOnRadio: 0,
				ratingStdDeviationOfPlacesOnRadio: 0
			}, () => this.renderMap());
			
		}
		else if(this.props.findPlaces === null && this.state.nullFoundPlacesLoopCycle < 1 && this.state.foundPlacesLoopCycle > 1) {
			console.log('findPlaces BAD!!! MAP!!!', this.props.findPlaces);
			this.setState({
				visiblePlaces: this.state.places.slice(),
				foundPlacesLoopCycle: 0,
				nullFoundPlacesLoopCycle: this.state.nullFoundPlacesLoopCycle + 1
			}, () => this.renderMap());
		}

	}

	renderMap() {
		
		var bounds = new google.maps.LatLngBounds();
		var infowindow = new google.maps.InfoWindow();		
		
		// var service = new google.maps.places.PlacesService(map);

		if(this.state.visiblePlaces.length) {
			var map = new google.maps.Map(document.getElementById('theMap'), {zoom: 4, center: {lat: this.state.visiblePlaces[0].address.location.lat, lng: this.state.visiblePlaces[0].address.location.lng} });

			let circles = [];

		  	google.maps.event.addListener(map, 'click', (event) => {

		  		circles.map(circle => circle.setMap(null));
		  		circles = [];

				var searchArea = new google.maps.Circle({
					map: map,
					fillColor : '#BBD8E9',
					fillOpacity : 0.3,
					radius : 200,
					strokeColor : '#BBD8E9',
					strokeOpacity : 0.9,
					strokeWeight : 2,
					center: event.latLng
				});

				map.setCenter(event.latLng);

				let includedPlaces = this.state.visiblePlaces.filter(place => {
					let position = new google.maps.LatLng(place.address.location.lat, place.address.location.lng);
					return google.maps.geometry.spherical.computeDistanceBetween( position, searchArea.getCenter() ) <= searchArea.getRadius();
				});

				var highestVal = Math.max.apply(Math, includedPlaces.map(o => o.rating));
				let bestPlaces = includedPlaces.filter(place => place.rating >= highestVal);

				bestPlaces.forEach(place => {
					var goodRest = new google.maps.Circle({
						map: map,
						fillColor : '#F8B454',
						fillOpacity : 0.3,
						radius : 20,
						strokeColor : '#ED5D3B',
						strokeOpacity : 0.9,
						strokeWeight : 2,
						center: new google.maps.LatLng(place.address.location.lat, place.address.location.lng)
					});

					circles.push(goodRest);
				})

				console.log('includedPlaces', includedPlaces, highestVal);

				let sum = includedPlaces.reduce((sum, current) => sum += current.rating, 0);
				console.log('avg sum', sum, includedPlaces.length, sum / includedPlaces.length);
				let avg = sum / includedPlaces.length;

				var diffs = includedPlaces.map(function(place){
					var diff = place.rating - avg;
					return diff;
				});

				var squareDiffs = includedPlaces.map(function(place){
					var diff = place.rating - avg;
					var sqr = diff * diff;
					return sqr;
				});

				var SquareDiffSum = squareDiffs.reduce(function(sum, value){
					return sum + value;
				}, 0);

				var avgSquareDiff = SquareDiffSum / squareDiffs.length;
				var stdDev = Math.sqrt(avgSquareDiff);

				this.setState({
					numberOfPlacesOnRadio: includedPlaces.length,
					avgRatingOfPlacesOnRadio: avg.toFixed(2),
					ratingStdDeviationOfPlacesOnRadio: stdDev.toFixed(2),
					bestPlaces: bestPlaces
				})
				

				circles.push(searchArea);

				// console.log(circle);
			});

			this.state.visiblePlaces.map(place => {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(place.address.location.lat, place.address.location.lng), 
					map: map
				});

				bounds.extend(marker.position);

				google.maps.event.addListener(marker, 'click', (function(marker) {
				    return function() {
				      infowindow.setContent(place.name);
				      infowindow.open(map, marker);
				    }
			  	})(marker));

			});

			map.fitBounds(bounds);
		}
	}

	renderIncluededPlacesInfo() {
		return (this.state.numberOfPlacesOnRadio > 0) ? <div>
				<div className="included-places-info-section d-flex justify-content-between">
					<span className="d-block">Places: {this.state.numberOfPlacesOnRadio} </span>
					<span className="d-block">Rating avg: {this.state.avgRatingOfPlacesOnRadio} </span>
					<span className="d-block">Std Dev: {this.state.ratingStdDeviationOfPlacesOnRadio} </span>
				</div> 
				<ul className="best-places-list">
					<li style={{fontSize: '18px'}}>Best Places (orange) </li>
					{this.state.bestPlaces.map(place => <li style={{fontSize: '14px'}} key={place.id}>{place.name}</li> )}
				</ul>
			</div> : null;
	}

	render() {
		return (
			<div>
				<div id="theMap" className="d-flex w-100 justify-content-center align-items-center">
					map container!!!
				</div>
				<div>
					{this.renderIncluededPlacesInfo()}
				</div>
			</div>
		);
	}

}

function mapStateToProps ( state ) {
	return {
		possiblePlaces: state.fetchInfoPlaces,
		findPlaces: state.findPlaces
	};
}

export default connect(mapStateToProps, null)(MapSection);

