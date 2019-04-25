import { FIND_PLACE, SELECT_PLACE } from '../actions';


export default function ( state = null , action ) {
	// console.log('from reducer places', 'state', state, action);
	switch( action.type ) {
		case FIND_PLACE:
		case SELECT_PLACE:
			return action.payload.length ? action.payload : null;
			break;

		default:
			return state;
	}

}