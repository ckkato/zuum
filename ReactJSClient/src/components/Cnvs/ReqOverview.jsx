import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon }
         from 'react-bootstrap';
import RdModal from './RdModal';
//import { ConfDialog } from '../index';
//import { delCnv} from '../../api';
import './RdsOverview.css';

export default class ReqOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateRds();
      this.state = {
         showModal: false,
         showConfirmation: false,
      }
   }

   // Open a model with a |cnv| (optional)
   openModal = (rd) => {
      const newState = { showModal: true };
      if (rd)
         newState.editRd = rd;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editRd){
            this.modRd(result);
         }else{
            this.newRd(result);
         }
      }
      this.setState({ showModal: false, editRd: null });
   }

   modRd(result) {
      this.props.modRd(this.state.editRd.id, result.title);
   }

   modAccept(ride) {
      this.props.modAccept(ride);
   }

   newRd(result) {
      console.log("CREATING NEW RIDE: ", result);
      this.props.addRd(
         {
            startDestination: result.startDestination,
            endDestination: result.endDestination,
            departureTime: result.departureTime,
            capacity: parseInt(result.capacity),
            fee: parseInt(result.fee)
         });
   }

   delRd(result){
      this.props.delRd(this.state.delRd.id);
   }

   openConfirmation = (rd) => {
      this.setState({ delRd: rd, showConfirmation: true})
   }

   closeConfirmation = (res) => {
      if (res.status === "Ok") {
         this.delRd(res);
      }
      this.setState({ showConfirmation: false });
   }

   render() {
      var reqItems = [];
      this.props.Rqts.forEach(r => {
         console.log("HELLO", r);
         if (!this.props.userOnly || this.props.Usrs.email === r.email
          || this.props.Usrs.id === r.driverId)
            reqItems.push(<RqtItem
               key={r.id}
               driverId={r.driverId}
               startDestination={r.startDestination}
               endDestination={r.endDestination}
               departureTime={r.departureTime}
               fee={r.fee}
               accepted={r.accepted}
               capacity={r.capacity}
               rideId={r.id}
               onAccept={() => this.modAccept(r)}
               allow={this.props.Usrs.id === r.driverId}/>);
      });

      return (
         <section className="container">
            <h1>Requests</h1>
            <ListGroup>
               {reqItems}
            </ListGroup>
         </section>
      )
   }
}

// A Rqt list item
const RqtItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>From: {props.startDestination}</Col>
            <Col sm={4}>To: {props.endDestination}</Col>
            <Col sm={4}>Departs At: {new Intl.DateTimeFormat('en-Us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.departureTime))}</Col>
               {props.allow ?
                  <div className="pull-right">
                     <Button bsSize="small" onClick={props.onAccept}>
                     <Glyphicon glyph="ok" /></Button>
                  </div>
                  : ''}
         </Row>
         <Row>
            <Col sm={4}>Fee: {props.fee}</Col>
            <Col sm={4}>Accepted: {props.accepted ? "Yes" : "No"}</Col>

         </Row>
      </ListGroupItem>
   )
}
