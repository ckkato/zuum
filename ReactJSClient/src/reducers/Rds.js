export default function Cnvs(state = [], action) {
   console.log("Rds reducing action " + action.type);
   switch (action.type) {
      case 'UPDATE_RDS': // Replace previous cnvs
         return action.rds;
      case 'UPDATE_RD':
         console.log(action.data);
         return state.map(val => val.id !== action.data.rdId ?
            val : Object.assign({}, val, {
               startDestination: action.data.startDestination,
               endDestination: action.data.endDestination,
               capacity: action.data.capacity,
               fee: action.data.fee}));
      case 'ADD_RD':
         console.log("DOSPADOSPDOPSA", action.rds);
         return state.concat([action.rds]);
      case 'DELETE_RD':
         console.log(action);
         return state.filter(val => val.id !== action.id);
      default:
         return state;
   }
}
