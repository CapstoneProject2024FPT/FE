import { Box } from "@mui/material";
import { useState, FC, CSSProperties } from "react";

interface Props {
  src: string;
  width: string | number;
  zoomScale?: number;
  height?: string | number;
  className?: string;
  transitionTime?: number;
  style?: CSSProperties;
}

const Zoom: FC<Props> = ({ src, width, height }) => {
  const [backgroundPosition, setBackgroundPosition] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <Box
      component={"figure"}
      onMouseMove={handleMouseMove}
      sx={{
        backgroundImage: `url(${src})`,
        backgroundPosition,
        width,
        backgroundRepeat: "no-repeat",
        marginTop: 0,
        marginLeft: 0,

        "&:hover img": {
          opacity: 0,
        },
      }}
    >
      <img
        src={src}
        style={{
          display: "block",
          width: "100%",
          height,
          pointerEvents: "none",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export default Zoom;
