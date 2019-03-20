export default function Cnvs(state = [], action) {
   console.log("Rds reducing action " + action.type);
   switch (action.type) {
      case 'UPDATE_RDS': // Replace previous cnvs
         return action.rds;
      case 'UPDATE_RD':
         return state.map(val => val.id !== action.data.rdId ?
            val : Object.assign({}, val, {
               startDestination: action.data.startDestination,
               endDestination: action.data.endDestination,
               capacity: action.data.capacity,
               fee: action.data.fee}));
      case 'ADD_RD':
         return state.concat([action.rds]);
      case 'DELETE_RD':
         return state.filter(val => val.id !== action.id);
      default:
         return state;
   }
}
