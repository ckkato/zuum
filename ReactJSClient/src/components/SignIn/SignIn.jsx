import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, Button, ControlLabel, Image, Row}
         from 'react-bootstrap';
import './SignIn.css';

class SignIn extends Component {
   constructor(props) {
      super(props);

      // Current login state
      this.state = {
         email: 'senpaiClint@437.com',
         password: 'password'
      }

       // bind 'this' to the correct context
       this.handleChange = this.handleChange.bind(this);
       this.signIn = this.signIn.bind(this);
   }

   // Call redux actionCreator signin via props.
   signIn(event) {
      this.props.signIn(this.state, () => this.props.history.push("/allRds"));
      event.preventDefault()
   }

   // Continually update state as letters typed. Rerenders, but no DOM change!
   handleChange(event) {
      const newState = {}
      newState[event.target.name] = event.target.value;
      this.setState(newState);
   }

   render() {
      console.log("Rendering Signin");
      return (
         <section>
         <div className="SignIn">
         <Row>
            <Col>
               <Col smOffset={1}>
                  <h1>Sign in</h1>
               </Col>
               <Form horizontal>
                  <FormGroup controlId="formHorizontalEmail">
                     <Col smOffset={2} sm={8}>
                     <Col componentClass={ControlLabel} sm={2}>
                        Email
                     </Col>
                        <FormControl
                         autoFocus
                         type="email"
                         name="email"
                         placeholder="Email"
                         value={this.state.email}
                         onChange={this.handleChange}
                         />
                     </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalPassword">
                     <Col smOffset={2} sm={8}>
                        <Col componentClass={ControlLabel} sm={2}>
                           Password
                        </Col>
                        <FormControl
                         type="password"
                         name="password"
                         placeholder="Password"
                         value={this.state.password}
                         onChange={this.handleChange}
                        />
                     </Col>
                  </FormGroup>
                  <FormGroup>
                     <Col smOffset={2} sm={8}>
                        <Button block bsStyle="success"
                           type="submit" onClick={this.signIn}>
                           Sign in
                        </Button>
                    </Col>
                  </FormGroup>
               </Form>
            </Col>
         </Row>
         </div>
         </section>
      )
   }
}

export default SignIn;
