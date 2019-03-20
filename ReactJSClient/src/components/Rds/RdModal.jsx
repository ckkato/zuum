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

export default class RdModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         rdTitle: (this.props.rd && this.props.rd.title) || "",
         startDestination: "",
         endDestination: "",
         departureTime: "",
         departureTimeYear: "",
         departureTimeMonth: "",
         departureTimeDay: "",
         departureTimeHour: "",
         departureTimeMin: "",
         capacity: "",
         fee: ""
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         startDestination: this.state.startDestination,
         endDestination: this.state.endDestination,
         departureTime: `${this.state.departureTimeYear}`+
         `-${this.state.departureTimeMonth}-${this.state.departureTimeDay}T`+
         `${this.state.departureTimeHour}:${this.state.departureTimeMin}`+
         `:00.000Z`,
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
      newState[e.target.id] = e.target.value;
      this.setState(newState);
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ startDestination: (nextProps.rd &&
            nextProps.rd.startDestination)
            || "", endDestination: (nextProps.rd &&
            nextProps.rd.endDestination)
            || "", departureTimeYear: (nextProps.rd &&
            nextProps.rd.departureTimeYear)
            || "", departureTimeMonth: (nextProps.rd &&
            nextProps.rd.departureTimeMonth)
            || "", departureTimeDay: (nextProps.rd &&
            nextProps.rd.departureTimeDay)
            || "", departureTimeHour: (nextProps.rd &&
            nextProps.rd.departureTimeHour)
            || "", departureTimeMin: (nextProps.rd &&
            nextProps.rd.departureTimeMin)
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
      return (
         <div>
            <Modal show={this.props.showModal} onHide={() =>
               this.close("Cancel")}>
               <Modal.Header closeButton>
                  <Modal.Title>{this.props.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form onSubmit={(e) =>
                     e.preventDefault() || this.state.rdTitle.length ?
                        this.close("Ok") : this.close("Cancel")}>
                        <FieldGroup id="startDestination" type="text"
                        label="Start Destination"
                        value={this.state.startDestination}
                        onChange={this.handleChange} required={true}
                        />
                        <FieldGroup id="endDestination" type="text"
                        label="End Destination"
                        value={this.state.endDestination}
                        onChange={this.handleChange} required={true}
                        />
                        <FieldGroup id="capacity" type="text" label="Capacity"
                        value={this.state.capacity}
                        onChange={this.handleChange} required={true}
                        />
                        <FieldGroup id="fee" type="text" label="Fee"
                        value={this.state.fee}
                        onChange={this.handleChange} required={true}
                        />
                        <FieldGroup id="departureTimeYear" type="text"
                        label="Year"
                        value={this.state.departureTimeYear}
                        disabled={this.props.title === "Edit Ride"}
                        onChange={this.handleChange} required={true}
                        placeholder={"ex: 2019"}
                        />
                        <FieldGroup id="departureTimeMonth" type="text"
                        label="Month"
                        value={this.state.departureTimeMonth}
                        disabled={this.props.title === "Edit Ride"}
                        onChange={this.handleChange} required={true}
                        placeholder={"ex: 03"}
                        />
                        <FieldGroup id="departureTimeDay" type="text"
                        label="Day"
                        value={this.state.departureTimeDay}
                        disabled={this.props.title === "Edit Ride"}
                        onChange={this.handleChange} required={true}
                        placeholder={"ex: 14"}
                        />
                        <FieldGroup id="departureTimeHour" type="text"
                        label="Hour"
                        value={this.state.departureTimeHour}
                        disabled={this.props.title === "Edit Ride"}
                        onChange={this.handleChange} required={true}
                        placeholder={"ex: 08"}
                        />
                        <FieldGroup id="departureTimeMin" type="text"
                        label="Min"
                        value={this.state.departureTimeMin}
                        disabled={this.props.title === "Edit Ride"}
                        onChange={this.handleChange} required={true}
                        placeholder={"ex: 30"}
                        />
                  </form>
               </Modal.Body>
               <Modal.Footer>
                  <Button onClick={() => this.close("Ok")}>Ok</Button>
                  <Button onClick={() => this.close("Cancel")}>Cancel</Button>
               </Modal.Footer>
            </Modal>

            <Modal show={this.props.showConfirmation} onHide={() =>
               this.close("Abort")}>
               <Modal.Header closeButton>
                  <Modal.Title>{this.props.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form onSubmit={(e) =>
                     e.preventDefault() || this.state.rdTitle.length ?
                        this.close("Ok") : this.close("Cancel")}>
                     Are you sure you want to delete this Ride?
                  </form>
               </Modal.Body>
               <Modal.Footer>
                  <Button onClick={() => this.close("Ok")}>Yes</Button>
                  <Button onClick={() => this.close("Cancel")}>Abort</Button>
               </Modal.Footer>
            </Modal>
         </div>
      )
   }
}
