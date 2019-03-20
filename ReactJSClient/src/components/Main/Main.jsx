import React, { Component } from 'react';
import { Register, SignIn, RdsOverview,
  ReqOverview, ConfDialog, Home } from '../index'
import { Route, Redirect, Switch } from 'react-router-dom';
import { Alert, Modal, Button, Navbar, Nav, NavItem} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Main.css';


var ProtectedRoute = ({component: Cmp, path, ...rest }) => {
   // console.log("HELLOOOOO" + JSON.stringify(rest));
   return (<Route path={path} render={(props) => {
      return Object.keys(rest.Usrs).length !== 0 ?
      <Cmp {...rest}/> : <Redirect to='/home'/>;}}/>);
   };

class Main extends Component {

   close = (result) => {
      this.props.updateErrs();
   }

   signedIn() {
      return Object.keys(this.props.Usrs).length !== 0; // Nonempty Usrs obj
   }

   // Function component to generate a Route tag with a render method
   // conditional on login.  Params {conditional: Cmp to render if signed in}

   render() {
      console.log("Redrawing main");
      return (
         <div>
            <div>
               <Navbar bsStyle="inverse">
                  <Navbar.Toggle />
                  {this.signedIn() ?
                     <Navbar.Text key={1}>
                        {`Logged in as: ${this.props.Usrs.firstName}
                         ${this.props.Usrs.lastName}`}
                     </Navbar.Text>
                     :
                     ''
                  }
                  <Navbar.Collapse>
                     <Nav>
                     <LinkContainer key={"home"} to="/home">
                        <NavItem>Home</NavItem>
                     </LinkContainer>
                        {this.signedIn() ?
                           [
                              <LinkContainer key={"all"} to="/allRds">
                                 <NavItem>All Rides</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={"my"} to="/myRds">
                                 <NavItem>My Rides</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={"req"} to="/rqsts">
                                 <NavItem>Requests</NavItem>
                              </LinkContainer>
                           ]
                           :
                           [
                              <LinkContainer key={0} to="/signin">
                                 <NavItem>Sign In</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={1} to="/register">
                                 <NavItem>
                                    Register
                               </NavItem>
                              </LinkContainer>,
                           ]
                        }
                     </Nav>
                     {this.signedIn() ?
                        <Nav pullRight>
                           <LinkContainer key={0} to="/signin">
                              <NavItem eventKey={1}
                               onClick={() => this.props.signOut()}>
                                 Sign out
                              </NavItem>
                           </LinkContainer>
                        </Nav>
                        :
                        ''
                     }
                  </Navbar.Collapse>
               </Navbar>
            </div>

            {/*Alternate pages beneath navbar, based on current route*/}
            <Switch>
               <Route exact path='/'
                  component={() => this.props.Usrs ?
                     <Redirect to="/allRds" /> : <Redirect to="/signin" />}/>
               <Route path='/home' render={() => <Home {...this.props} />}/>
               <Route path='/signin' render={() => <SignIn {...this.props} />}/>
               <Route path='/register'
                render={() => <Register {...this.props} />} />
               <ProtectedRoute path='/allRds' component={RdsOverview}
                {...this.props}/>
               <ProtectedRoute path='/myRds' component={RdsOverview}
                userOnly="true" {...this.props}/>}
               <ProtectedRoute path='/rqsts' component={ReqOverview}
                userOnly="true" {...this.props}/>
               />
            </Switch>
            {/*Error popup dialog*/}
            <Modal show={this.props.Errs.length > 0} onHide={this.close}>
               <Modal.Header closeButton>
                  <Modal.Title>Error Notice</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Alert bsStyle="danger">{this.props.Errs[0]}</Alert>
               </Modal.Body>
               <Modal.Footer>
                  <Button onClick={this.close}>OK</Button>
               </Modal.Footer>
            </Modal>
         </div>
      )
   }
}

export default Main
