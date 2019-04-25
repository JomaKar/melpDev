const FIND_PLACE  = 'FIND_PLACE';

const searchingSpecificPlaceActionCreator = function (foundPlaces) {
	console.log('searchedPlace action');
	return {
		type: FIND_PLACE,
		payload: foundPlaces
	};
}

export { searchingSpecificPlaceActionCreator, FIND_PLACE };