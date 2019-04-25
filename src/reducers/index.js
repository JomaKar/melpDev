import { combineReducers } from 'redux';

import fetchPlacesInfoReducer from './fetchPlacesInfoReducer.reducer';
import searchedWeatherInfo from './searchedWeatherInfo.reducer';
import findPlace from './findPlace.reducer';

const rootReducer = combineReducers({
  searchedWeatherInfo: searchedWeatherInfo,
  fetchInfoPlaces: fetchPlacesInfoReducer,
  findPlaces: findPlace
});

export default rootReducer;
