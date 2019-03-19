import { combineReducers } from 'redux';

import Usrs from './Usrs';
import Rds from './Rds';
import Errs from './Errs';
import Rqts from './Rqts';

const rootReducer = combineReducers({Usrs, Rds, Errs, Rqts});

export default rootReducer;
