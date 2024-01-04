import React from "react";
import {Link} from "react-router-dom";
import {ReactSVG} from "react-svg";
import pola from "../../assets/pola.svg";
import uprawy from "../../assets/uprawy.svg";
import progres from "../../assets/progres.svg";
import maszyny from "../../assets/maszyny.svg";
import operatorzy from "../../assets/operatorzy.svg";
import pesticide from "../../assets/pesticide.svg";
import nawozy from "../../assets/nawozy.svg";
import rosliny from "../../assets/rosliny.svg";
import zbiory from "../../assets/zbiory.svg";

function Box({link, logo, title}) {
  return (
    <Link to={link} className="w-[250px] h-[250px] bg-white rounded-[10px] shadow border-2 border-black border-opacity-25 flex flex-col items-center py-10">
      <ReactSVG src={logo} />
      <h1 className="font-bold text-xl pt-10 text-center">{title}</h1>
    </Link>
  );
}
const Gospodarstwo = () => {
  return (
    <div className="grid grid-rows-3 px-10 py-10">
      <div className="flex flex-row space-x-14">
        <Box link="/pola" logo={pola} title="POLA" />
        <Box link="/uprawy" logo={uprawy} title="UPRAWY" />
        <Box link="/postep" logo={progres} title="POSTĘP PRAC" />
      </div>
      <div className="flex flex-row space-x-14">
        <Box link="/maszyny" logo={maszyny} title="MASZYNY" />
        <Box link="/operatorzy" logo={operatorzy} title="OPERATORZY" />
      </div>
      <div className="flex flex-row space-x-14">
        <Box link="/srodki" logo={pesticide} title="ŚRODKI OCHRONY ROŚLIN" />
        <Box link="/nawozy" logo={nawozy} title="NAWOZY" />
        <Box link="/rosliny" logo={rosliny} title="ROŚLINY I ODMIANY" />
        <Box link="/zbiory" logo={zbiory} title="ZBIORY" />
      </div>
    </div>
  );
};
export default Gospodarstwo;
