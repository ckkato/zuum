export default function Rqts(state = [], action) {
   console.log("Rqts reducing action " + action.type);

   switch (action.type) {
      case 'ADD_REQUEST': // Replace previous cnvs
         return state.concat([action.ride]);
      default:
         return state;
   }
}
