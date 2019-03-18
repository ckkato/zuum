import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, Row, Button} from 'react-bootstrap';
import MsgModal from './MsgModal';


export default class CnvDetail extends Component {
   constructor(props) {
      super(props);
      console.log(this.props);
      var id = parseInt(props.location.pathname.split('/')[2], 10);
      this.props.updateMsgs(id);
      this.state = {
         showModal: false,
      }
   }

   openModal = () => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         this.newMsg(parseInt(this.props.location.pathname.split('/')[2], 10),
            result);
      }
      this.setState({ showModal: false});
   }

   newMsg(id, result) {
      this.props.addMsg(id, { content: result.content });
   }

   render() {
      var msgItems = [];

      this.props.Msgs.forEach(msg => {
         //if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            console.log(msg);
            msgItems.push(<MsgItem
               key={msg.id}
               id={msg.id}
               whenMade={msg.whenMade}
               email={msg.email}
               content={msg.content}
               />);
      });

      return (
         <section className="container">
            <h1>{this.props.Cnvs.find(x => x.id ===
               parseInt(this.props.location.pathname.split('/')[2], 10)).title}
            </h1>
            <ListGroup>
               {msgItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => {this.openModal();}}>
               New Message
            </Button>
            <MsgModal
               showModal={this.state.showModal}
               title={"Enter New Message"}
               onDismiss={this.modalDismiss} />
         </section>
      )
   }
}

const MsgItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>{props.email}</Col>
            <Col sm={4}>{new Intl.DateTimeFormat('en-Us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.whenMade))}</Col>
         </Row>
         <Row>
            <Col sm={4}>{props.content}</Col>
         </Row>
      </ListGroupItem>
   )
}
