import React, { Component } from 'react';
import {ConfDialog} from '../index';
import {
  FormGroup, ControlLabel, FormControl, HelpBlock,
  Checkbox, Button, Alert
} from 'react-bootstrap';

import './Register.css';

// Functional component label plus control w/optional help message
function FieldGroup({id, label, help, ...props }) {
   return (
       <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
       </FormGroup>
   );
}

class Register extends Component {
   constructor(props) {
      super(props);
      this.state = {
         firstName: '',
         lastName: '',
         email: '',
         password: '',
         passwordTwo: '',
         role: '',
         model: '',
         make: '',
         year: ''
      }
      this.handleChange = this.handleChange.bind(this);
      this.formValid = this.formValid.bind(this);
   }

   submit() {
      let { // Make a copy of the relevant values in current state
         firstName,
         lastName,
         email,
         password,
         role,
         model,
         make,
         year
      } = this.state;

      const user = {
         firstName,
         lastName,
         email,
         password,
         role,
         model,
         make,
         year
      };
      this.props.register(user, () => {this.setState({offerSignIn: true})});
   }

   handleChange(ev) {
      let newState = {};
      switch (ev.target.type) {
      case 'checkbox':
         if(ev.target.id === "role0" && ev.target.checked){
            newState['role'] = 0;
         }
         else if(ev.target.id === "role1" && ev.target.checked){
            newState['role'] = 1;
         }
         else{
            newState['role'] = '';
         }
         break;
      default:
         newState[ev.target.id] = ev.target.value;
      }
      this.setState(newState);
   }

   formValid() {
      let s = this.state;

      if(s.role === 0){
         return s.email && s.lastName && s.password &&
         s.password === s.passwordTwo;
      } else {
         return s.email && s.lastName && s.password &&
         s.password === s.passwordTwo
       && s.model && s.make && s.year;
      }
   }

   render() {
     return (
        <div className="Register">
        <div className="container">
           <form>
              <FieldGroup id="email" type="email" label="Email Address"
               placeholder="Enter email" value={this.state.email}
               onChange={this.handleChange} required={true}
               />

              <FieldGroup id="firstName" type="text" label="First Name"
               placeholder="Enter first name" value={this.state.firstName}
               onChange={this.handleChange}
               />

              <FieldGroup id="lastName" type="text" label="Last Name"
               placeholder="Enter last name" value={this.state.lastName}
               onChange={this.handleChange} required={true}
               />

              <FieldGroup id="password" type="password" label="Password"
               value={this.state.password}
               placeholder="Enter Password"
               onChange={this.handleChange} required={true}
               />

              <FieldGroup id="passwordTwo" type="password"
               label="Repeat Password"
               value={this.state.passwordTwo}
               onChange={this.handleChange} required={true}
               help="Repeat your password"
              />



               <Checkbox inline id="role0" value={this.state.role}
               onChange={this.handleChange} disabled={this.state.role === 1}>
               Rider</Checkbox>
               <Checkbox inline id="role1" value={this.state.role}
               onChange={this.handleChange} disabled={this.state.role === 0}>
               Driver</Checkbox>

                 <FieldGroup disabled={this.state.role !== 1}
                  id="model" type="text" label="Model"
                  placeholder="Enter Car Model"
                  value={this.state.model}
                  onChange={this.handleChange}
                 />

                 <FieldGroup disabled={this.state.role !== 1}
                  id="make" type="text" label="Make"
                  placeholder="Enter Car Make"
                  value={this.state.make}
                  onChange={this.handleChange}
                 />

                 <FieldGroup disabled={this.state.role !== 1}
                  id="year" type="text" label="Year"
                  placeholder="Enter Year Of Car"
                  value={this.state.year}
                  onChange={this.handleChange}
                 />
           </form>

           {this.state.password !== this.state.passwordTwo ?
            <Alert bsStyle="warning">
               Passwords don't match
            </Alert> : ''}

           <Button bsStyle="primary" onClick={() => this.submit()}
            disabled={!this.formValid()}>
              Submit
           </Button>

           <ConfDialog
              show={this.state.offerSignIn}
              title="Registration Success"
              body={`Would you like to log in as ${this.state.email}?`}
              buttons={['YES', 'NO']}
              onClose={answer => {
                 this.setState({offerSignIn: false});
                 if (answer === 'YES') {
                    this.props.signIn(
                     {email: this.state.email, password: this.state.password},
                     () => this.props.history.push("/"));
                 }
              }}
           />
        </div>
        </div>
      )
   }
}

export default Register;
