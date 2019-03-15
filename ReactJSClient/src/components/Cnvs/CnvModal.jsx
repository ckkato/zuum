import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class CnvModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
        //nothing if creating a new one, or existing if editing
         cnvTitle: (this.props.cnv && this.props.cnv.title) || "",
         //needs a showModal here
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         title: this.state.cnvTitle
      });
   }

   getValidationState = () => {
      if (this.state.cnvTitle) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({ cnvTitle: e.target.value });
      //in set state, other values not touched
   }

//
   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ cnvTitle: (nextProps.cnv && nextProps.cnv.title) || "" })
      }
   }

   render() {
      console.log("rendering modal");
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
            //closeButton, the little red x
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              //occurs when hit enter or a submit button
               <form onSubmit={(e) =>
                 //this is wrong, e.preventDefault should just stop the event
                 //preventdefault gaurantees to have a response
                  e.preventDefault() || this.state.cnvTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationState={this.getValidationState()}
                  >
                     <ControlLabel>Conversation Title</ControlLabel>
                     <FormControl
                        type="text"
                        value={this.state.cnvTitle}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback />
                     //triangular icon that shows if something not right
                     <HelpBlock>Title can not be empty.</HelpBlock>
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}
