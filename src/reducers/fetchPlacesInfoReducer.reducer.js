import { FETCH_PLACES, FIND_PLACE } from '../actions';


export default function ( state = null , action ) {
	// console.log('from reducer places', 'state', state, action);
	switch( action.type ) {
		case FETCH_PLACES:
			return ( Array.isArray(action.payload) ) ? action.payload : null;
			break;

		default:
			return state;
	}

}