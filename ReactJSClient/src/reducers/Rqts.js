export default function Rqts(state = [], action) {
   console.log("Rqts reducing action " + action.type);

   switch (action.type) {
      case 'ADD_REQUEST': // Replace previous cnvs
         console.log("request: ", action.request);
         action.ride.accepted = action.request[0].accepted;
         return state.concat([action.ride]);
      default:
         return state;
   }
}
