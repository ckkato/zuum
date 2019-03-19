export default function Rqts(state = [], action) {
   console.log("Rqts reducing action " + action.type);

   switch (action.type) {
      case 'ADD_REQUEST': // Replace previous cnvs
         console.log("request: ", action.request);
         action.ride.accepted = action.request[0].accepted;
         return state.concat([action.ride]);
      case 'GET_REQUESTS':
         state = [];
         console.log("MY DATA HERE: ", action.data);
         return state.concat(action.data);
      case 'UPDATE_RQTS':
         action.ride.accepted = action.data[0].accepted;
         action.ride.rqtId = action.data[0].id;
         return state.map(val => val.driverId !== action.data[0].driverId ?
            val : Object.assign({}, val, { curRiders: val.curRiders++}))
            .concat([action.ride]);
        //  console.log("MY DATA HERE: ", action.data);
        //  console.log("MY RIDE HERE: ", action.ride);
        // // return state.map(val => val.id === action.data.id ?
        //     val : Object.assign({}, val, {
        //        startDestination: action.ride.startDestination,
        //        endDestination: action.ride.endDestination,
        //        capacity: action.ride.capacity,
        //        departureTime: action.ride.departureTime,
        //        fee: action.ride.fee}));
      default:
         return state;
   }
}
