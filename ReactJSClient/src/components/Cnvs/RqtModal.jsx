import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

function FieldGroup({id, label, help, ...props }) {
   return (
       <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
       </FormGroup>
   );
}

export default class RqtModal extends Component {
   constructor(props) {
      super(props);
      console.log(props);
      this.state = {
         rdTitle: (this.props.rd && this.props.rd.title) || "",
         startDestination: "",
         endDestination: "",
         departureTime: "",
         capacity: "",
         fee: ""
      }
   }

   close = (result) => {
      console.log("RESULT", this.state);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         startDestination: this.state.startDestination,
         endDestination: this.state.endDestination,
         departureTime: this.state.departureTime,
         capacity: this.state.capacity,
         fee: this.state.fee
      });
   }

   getValidationState = () => {
      if (this.state.rdTitle) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      let newState = {};
      console.log(e.target.id);
      newState[e.target.id] = e.target.value;
      console.log(this.state);
      this.setState(newState);
      console.log("HANDLECHANGE", newState);
   }

   componentWillReceiveProps = (nextProps) => {
      console.log(nextProps.rd);
      if (nextProps.showModal) {
         this.setState({ startDestination: (nextProps.rd && nextProps.rd.startDestination)
            || "", endDestination: (nextProps.rd && nextProps.rd.endDestination)
               || "", departureTime: (nextProps.rd && nextProps.rd.departureTime)
                  || "", capacity: (nextProps.rd && nextProps.rd.capacity)
                     || "", fee: (nextProps.rd && nextProps.rd.fee)
                        || "" })
      }
      if (nextProps.showConfirmation) {
         this.setState({ rdTitle: (nextProps.rd && nextProps.rd.title)
            || "" })
      }
   }

   render() {
      console.log("hiya", this.props);
      return (
            <Modal show={this.props.showRequest} onHide={() =>
               this.close("Cancel")}>
               <Modal.Header closeButton>
                  <Modal.Title>Ride to {this.props.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  Make a ride request?
               </Modal.Body>
               <Modal.Footer>
                  <Button onClick={() => this.close("Ok")}>Ok</Button>
                  <Button onClick={() => this.close("Cancel")}>Cancel</Button>
               </Modal.Footer>
            </Modal>
      )
   }
}
