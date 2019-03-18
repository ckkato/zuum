import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon }
         from 'react-bootstrap';
import RdModal from './RdModal';
//import { ConfDialog } from '../index';
//import { delCnv} from '../../api';
import './RdsOverview.css';

export default class RdsOverview extends Component {
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
      var rdItems = [];
      this.props.Rds.forEach(rd => {
         console.log("HELLO", rd);
         if (!this.props.userOnly || this.props.Usrs.id === rd.driverId)
            rdItems.push(<RdItem
               key={rd.id}
               startDestination={rd.startDestination}
               endDestination={rd.endDestination}
               departureTime={rd.departureTime}
               id={rd.id}
               capacity={rd.capacity}
               curRiders={rd.curRiders}
               fee={rd.fee}
               showControls={rd.usrId === this.props.Usrs.id
                  || this.props.Usrs.role === 1}
               onDelete={() => this.openConfirmation(rd)}
               onEdit={() => this.openModal(rd)} />);
      });

      return (
         <section className="container">
            <h1>Rd Overview</h1>
            <ListGroup>
               {rdItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => {this.openModal();}}>
               New Ride
            </Button>
            {/* Modal for creating and change rd */}
            <RdModal
               showModal={this.state.showModal}
               title={this.state.editRd ? "Edit Ride" : "New Ride"}
               rd={this.state.editRd}
               onDismiss={this.modalDismiss} />
            <RdModal
               showConfirmation={this.state.showConfirmation}
               title={"Delete Conversation"}
               rd={this.state.delRd}
               onDismiss={this.closeConfirmation} />
         </section>
      )
   }
}

// A Rd list item
const RdItem = function (props) {
   console.log(props.departureTime);
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>Start Location: {props.startDestination}</Col>
            <Col sm={4}>End Destination: {props.endDestination}</Col>
            {/*<Col sm={4}><Link to={"/CnvDetail/" + props.id}>
               {props.endDestination}</Link></Col>*/}
            <Col sm={4}>Departure time: {props.departureTime ? new Intl.DateTimeFormat('en-Us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.departureTime)) : 'N/A'}</Col>
            {props.showControls ?
               <div className="pull-right">
                  <Button bsSize="small" onClick={props.onDelete}>
                  <Glyphicon glyph="trash" /></Button>
                  <Button bsSize="small" onClick={props.onEdit}>
                  <Glyphicon glyph="edit" /></Button>
               </div>
               : ''}

         </Row>
         <Row>
            <Col sm={4}>Capacity: {props.capacity}</Col>
            <Col sm={4}>Fee: {props.fee}</Col>
         </Row>
      </ListGroupItem>
   )
}
