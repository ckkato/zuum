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
      case 'UPDATE_CNVS_ERR':
         return action.details;
      case 'ADD_CNV_ERR':
         return action.details;
      case 'UPDATE_CNV_ERR':
         return action.details;
      case 'DELETE_ERR':
         return action.details;
      default:
         state = [];
         return state;
   }
}
