import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { CSSProperties } from "react";
const images = [
  "https://www.tatmachinery.com/upload/banner/202304/khoi-nghiep-nganh-co-khi-889643-933246.jpg",
  "https://www.tatmachinery.com/upload/banner/202210/thanh-ly-nha-may-053672-039983.jpg",
  "https://www.tatmachinery.com/upload/banner/202009/hyundai-wia-950x350-568115-785260.jpg",
];
const SimpleSlider: React.FC = () => {
  const arrowStyles: CSSProperties = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    width: 30,
    height: 30,
    cursor: "pointer",
  };
  return (
    <div className="box">
      <Carousel
        useKeyboardArrows={true}
        showThumbs={false}
        showStatus={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={2000}
        renderArrowPrev={(onClickHandler, hasPrev, label) => (
          <button
            type="button"
            onClick={onClickHandler}
            title={hasPrev ? label : ""}
            style={{ ...arrowStyles, left: 15 }}
          >
            <FaAngleLeft />
          </button>
        )}
        renderArrowNext={(onClickHandler, hasNext, label) => (
          <button
            type="button"
            onClick={onClickHandler}
            title={hasNext ? label : ""}
            style={{ ...arrowStyles, right: 15 }}
          >
            <FaAngleRight />
          </button>
        )}
      >
        {images.map((URL, index) => (
          <div className="slide" key={index}>
            <img alt="sample_file" src={URL} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
export default SimpleSlider;
