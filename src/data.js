import {GiWheat} from "react-icons/gi";
export const responsive = {
  superLargeDesktop: {
    breakpoint: {max: 4000, min: 1024},
    items: 4,
  },
  desktop: {
    breakpoint: {max: 1024, min: 800},
    items: 4,
  },
  tablet: {
    breakpoint: {max: 800, min: 464},
    items: 2,
  },
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 1,
  },
};

export const cardsData = [
  {
    id: 1,
    icon: <GiWheat size="25px" />,
    name: "Pola",
  },
  {
    id: 2,
    icon: <GiWheat size="25px" />,
    name: "Uprawy",
  },
  {
    id: 3,
    icon: <GiWheat size="25px" />,
    name: "Nawozy",
  },
  {
    id: 4,
    icon: <GiWheat size="25px" />,
    name: "Środki ochrony roślin",
  },
  {
    id: 5,
    icon: <GiWheat size="25px" />,
    name: "Rośliny i odmiany",
  },
];
