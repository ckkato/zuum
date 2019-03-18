function Usrs(state = {}, action) {
   console.log("Usrs reducing action " + action.type);
   console.log(action);
   switch(action.type) {
   case 'SIGN_IN':
      return action.user;
   case 'SIGN_OUT':
      return {}; // Clear user state
   default:
      return state;
   }
}

export default Usrs;
