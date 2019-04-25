import { FETCH_WEATHER } from '../actions';


export default function ( state = [] , action ) {
	switch( action.type ) {
		case FETCH_WEATHER:
			return (action.payload.cod == 200) ? [ action.payload, ...state] : state;
			// return [ action.payload ].concat(state); //this works fine
			// return state.concat([ action.payload ]); //this works fine
			// return state.push(action.payload); //this defenitively NOT DO IT; never set state directly
			break;

		default:
			return state;
	}

}