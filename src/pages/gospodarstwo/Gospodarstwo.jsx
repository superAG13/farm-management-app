import React from "react";
import {Link} from "react-router-dom";
import {ReactSVG} from "react-svg";

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
        <Box link="/pola" logo="src/assets/pola.svg" title="POLA" />
        <Box link="/uprawy" logo="src/assets/uprawy.svg" title="UPRAWY" />
        <Box link="/postep" logo="src/assets/progres.svg" title="POSTĘP PRAC" />
      </div>
      <div className="flex flex-row space-x-14">
        <Box link="/maszyny" logo="src/assets/maszyny.svg" title="MASZYNY" />
        <Box link="/operatorzy" logo="src/assets/operatorzy.svg" title="OPERATORZY" />
      </div>
      <div className="flex flex-row space-x-14">
        <Box link="/srodki" logo="src/assets/pesticide.svg" title="ŚRODKI OCHRONY ROŚLIN" />
        <Box link="/nawozy" logo="src/assets/nawozy.svg" title="NAWOZY" />
        <Box link="/rosliny" logo="src/assets/rosliny.svg" title="ROŚLINY I ODMIANY" />
        <Box link="/zbiory" logo="src/assets/zbiory.svg" title="ZBIORY" />
      </div>
    </div>
  );
};
export default Gospodarstwo;
