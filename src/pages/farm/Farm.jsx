import React from "react";
import "./farm.css";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
function Farm() {
  return (
    <div className="farm">
      <div className="container">
        <h1 className="title">Gospodarstwo</h1>
        <Swiper spaceBetween={50} slidesPerView={5} onSlideChange={() => console.log("slide change")} onSwiper={(swiper) => console.log(swiper)}>
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Farm;
