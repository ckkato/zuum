import React, { Component } from 'react';
import {
   Modal, Button, FormControl, FormGroup
} from 'react-bootstrap';

export default class MsgModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         msgContent: (this.props.msg && this.props.msg.content) || "",
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         content: this.state.msgContent
      });
   }

   handleChange = (e) => {
      this.setState({ msgContent: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ msgContent: (nextProps.msg
            && nextProps.msg.content) || "" })
      }
   }

   render() {
      return (
         <div>
            <Modal show={this.props.showModal}
                  onHide={() => this.close("Cancel")}>
               <Modal.Header closeButton>
                  <Modal.Title>{this.props.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form onSubmit={(e) =>
                     e.preventDefault() || this.state.msgContent.length ?
                        this.close("Ok") : this.close("Cancel")}>
                     <FormGroup controlId="exampleForm.ControlTextarea1">
                        <FormControl componentClass="textarea"
                           type="text"
                           placeholder="Enter message here"
                           onChange={this.handleChange}
                        />
                     </FormGroup>
                  </form>
               </Modal.Body>
               <Modal.Footer>
                  <Button onClick={() => this.close("Ok")}>Ok</Button>
                  <Button onClick={() => this.close("Cancel")}>Cancel</Button>
               </Modal.Footer>
            </Modal>
         </div>
      )
   }
}
