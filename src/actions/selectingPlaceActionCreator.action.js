const SELECT_PLACE  = 'SELECT_PLACE';

const selectingPlaceActionCreator = function (selectedPlace) {
	console.log('searchedPlace action');
	return {
		type: SELECT_PLACE,
		payload: [selectedPlace]
	};
}

export { selectingPlaceActionCreator, SELECT_PLACE };