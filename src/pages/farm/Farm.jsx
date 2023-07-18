/* eslint-disable no-unused-vars */
import React from "react";
import "./farm.css";

//swiper
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle";
import {Navigation, Pagination, A11y} from "swiper/modules";

//icons
import {GiWheat, GiFarmTractor, GiFertilizerBag} from "react-icons/gi";
import {TbChartTreemap} from "react-icons/tb";
import {BsMap} from "react-icons/bs";
function Farm() {
  return (
    <div className="farm">
      <div className="container">
        <h1 className="title">Twoje gospodarstwo</h1>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={50}
          slidesPerView={4}
          navigation={true}
          pagination={{clickable: true}}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Pola</h2>
              <BsMap className="icon" size="50px" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Uprawy</h2>
              <TbChartTreemap className="icon" size="60px" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Maszyny</h2>
              <GiFarmTractor className="icon" size="60px" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Nawozy</h2>
              <GiFertilizerBag className="icon" size="60px" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Środki ochrony roślin</h2>
              <GiWheat className="icon" size="60px" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Rośliny i odmiany</h2>
              <GiWheat className="icon" size="60px" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card">
              <h2 className="card-title">Osoby</h2>
              <GiWheat className="icon" size="60px" />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Farm;
