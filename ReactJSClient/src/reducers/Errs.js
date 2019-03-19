export default function Errs(state = [], action) {
   console.log("Errs reducing action " + action.type);

   console.log(action);
   switch (action.type) {
      case 'LOGIN_ERR':
         return action.details;
      case 'LOGOUT_ERR':
         return action.details;
      case 'REGISTER_ERR':
         return action.details;
      case 'UPDATE_RDS_ERR':
         return action.details;
      case 'ADD_RD_ERR':
         return action.details;
      case 'UPDATE_CRD_ERR':
         return action.details;
      case 'DELETE_ERR':
         return action.details;
      case 'UPDATE_REQUESTS_ERR':
         return action.details;
      case 'ADD_REQUEST_ERR':
         return action.details;
      default:
         state = [];
         return state;
   }
}
