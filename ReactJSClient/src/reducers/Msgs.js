export default function Msgs(state = [], action) {
   console.log("Msgs reducing action " + action.type);

   switch (action.type) {
      case 'UPDATE_MSGS': // Replace previous cnvs
         return action.msgs;
      case 'ADD_MSG':
         return state.concat([action.msg]);
      default:
         return state;
   }
}
