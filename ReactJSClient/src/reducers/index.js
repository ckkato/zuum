import { combineReducers } from 'redux';

import Usrs from './Usrs';
import Rds from './Rds';
import Errs from './Errs';
import Msgs from './Msgs';

const rootReducer = combineReducers({Usrs, Rds, Errs, Msgs});

export default rootReducer;
