export default function Cnvs(state = [], action) {
   console.log("Rds reducing action " + action.type);

   console.log("ERERERERERE", action.rds);
   switch (action.type) {
      case 'UPDATE_RDS': // Replace previous cnvs
         return action.rds;
      case 'UPDATE_RD':
         return state.map(val => val.id !== action.data.cnvId ?
            val : Object.assign({}, val, { title: action.data.title }));
      case 'ADD_RD':
         return state.concat([action.rds]);
      case 'DELETE_RD':
         return state.filter(val => val.id !== action.id);
      default:
         return state;
   }
}
