const FETCH_PLACES  = 'FETCH_PLACES',
		URL_BASE	= 'https://s3-us-west-2.amazonaws.com/lgoveabucket/data_melp.json';
		// URL_BASE	= 'data/data_melp.json';

const fetchingActionCreator = function () {
	console.log('searchedPlace action');

	return fetch(URL_BASE)
		    .then((response) => {
		    	// console.log('all response', response);
		    	return response.json()
		    })
		    .then((responseJson) => {
		    	// console.log('responseJson', responseJson);
				return {
					type: FETCH_PLACES,
					payload: responseJson
				};
		    })
		    .catch((error) => {
		      console.error('error', error);
		      	return {
					type: FETCH_PLACES,
					payload: null
				};
		    });
}

export { fetchingActionCreator, FETCH_PLACES };