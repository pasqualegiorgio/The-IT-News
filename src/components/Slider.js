import React from "react";
// import di React Responsive Carousel
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import di immagini
import image1 from '../assets/img/1.jpg';
import image2 from '../assets/img/2.jpg';
import image3 from '../assets/img/3.jpg';
import image4 from '../assets/img/4.jpg';
// import di styles
import '../styles/Slider.css';

export const Slider = () => {
    return (
        <div>
            {/* Carosello con loop infinito in autoplay contenente 4 immagini presentative */}
            <Carousel infiniteLoop useKeyboardArrows autoPlay>
                <div>
                    <img src={image1} alt="Fast" />
                </div>
                <div>
                    <img src={image2} alt="Simple" />
                </div>
                <div>
                    <img src={image3} alt="Intuitive" />
                </div>
                <div>
                    <img src={image4} alt="One place to read IT news. Search for what interests you and scroll through the latest news" />
                </div>
            </Carousel>
        </div>
    )
}






















/*
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from '../assets/img/1.jpg';
import image2 from '../assets/img/2.jpg';
import image3 from '../assets/img/3.jpg';
import image4 from '../assets/img/4.jpg';

const sliderimg = {
    width: "100%",
    height: "300px",
    overflow: "hidden"
}

const slider = {
    width: "100%",
    height: "300px",
    overflow: "hidden"
}

export const Slider = () => {
    return (
        <div>
            <AliceCarousel autoPlay autoPlayInterval="3000" className={slider}>
                <img src={image1} className={sliderimg} alt="" />
                <img src={image2} className={sliderimg} alt="" />
                <img src={image3} className={sliderimg} alt="" />
                <img src={image4} className={sliderimg} alt="" />
            </AliceCarousel>
        </div>
    )
}
*/