export default function Rqts(state = [], action) {
   console.log("Rqts reducing action " + action.type);

   switch (action.type) {
      case 'ADD_REQUEST': // Replace previous cnvs
         action.ride.accepted = action.request[0].accepted;
         return state.concat([action.ride]);
      case 'GET_REQUESTS':
         state = [];
         return state.concat(action.data);
      case 'UPDATE_RQTS':
         action.ride.accepted = action.data[0].accepted;
         action.ride.rqtId = action.data[0].id;
         return state.map(val => val.driverId !== action.data[0].driverId ?
            val : Object.assign({}, val, { curRiders: val.curRiders++}))
            .concat([action.ride]);
      default:
         return state;
   }
}
