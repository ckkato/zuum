import React, { Component } from 'react';
import { Carousel, Jumbotron}
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
                  src={"https://cdn-images-1.medium.com/max/"
                  .concat("1600/1*UhLWKnLK28I-J_KOiAowDg.jpeg")}
                  alt="First slide"
               />
                  <Carousel.Caption>
                     <h3>Welcome To ZUUM</h3>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
               <img
                  className="d-block w-100"
                  src={"https://www.mmomastermind.com/wp-content/"
                  .concat("uploads/2018/06/SPI-322-Social_compressed-1.jpg")}
                  alt="Third slide"
               />
                  <Carousel.Caption>
                     <h3>Number One Rideshare App</h3>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
               <img
                  className="d-block w-100"
                  src={"https://cdn-images-1.medium.com/"
                  .concat("max/1600/0*oswuEbLtZGi-NZZd.jpg")}
                  alt="Third slide"
               />
                  <Carousel.Caption>
                     <h3>Easy and Efficient</h3>
                  </Carousel.Caption>
               </Carousel.Item>
            </Carousel>
         </section>

         <section className={"container"}>
         <Jumbotron>
         <h1>Welcome To ZUUM</h1>
            <p>
            Join either as a driver or rider! As a driver you are able to start
            your own rides and accept the requests of ither riders. As a rider
            you are able to request to join the rides of drivers. With ZUUM you
            will be able to get to your destination in no time without the
            hassel!
            </p>
         </Jumbotron>
         </section>
         </section>
      )
   }
}

export default Home;
