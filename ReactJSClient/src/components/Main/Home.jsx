import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, Button, ControlLabel, Carousel, Jumbotron}
         from 'react-bootstrap';


class Home extends Component {


   render() {
      console.log("Rendering Home");
      return (
         <section>
         <section>
            <Carousel>
               <Carousel.Item>
               <img
                  className="d-block w-100"
                  src="https://cdn-images-1.medium.com/max/1600/1*UhLWKnLK28I-J_KOiAowDg.jpeg"
                  alt="First slide"
               />
                  <Carousel.Caption>
                     <h3>First slide label</h3>
                     <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
               <img
                  className="d-block w-100"
                  src="https://www.mmomastermind.com/wp-content/uploads/2018/06/SPI-322-Social_compressed-1.jpg"
                  alt="Third slide"
               />

                  <Carousel.Caption>
                     <h3>Second slide label</h3>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
               <img
                  className="d-block w-100"
                  src="https://cdn-images-1.medium.com/max/1600/0*oswuEbLtZGi-NZZd.jpg"
                  alt="Third slide"
               />

                  <Carousel.Caption>
                     <h3>Third slide label</h3>
                     <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                  </Carousel.Caption>
               </Carousel.Item>
            </Carousel>
         </section>

         <section className={"container"}>
         <Jumbotron fluid = {false}>
         <h1>Welcome To ZUUM</h1>
            <p>
            Join either as a driver or rider!
            </p>
         </Jumbotron>
         </section>
         </section>
      )
   }
}

export default Home;
