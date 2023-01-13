import React, { useState } from "react";
import Modal from "./Modal";
import { ImEnlarge, ImShrink } from "react-icons/im";

interface IProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  manualZoomDim?: string;
}

const ZoomCard: React.FC<IProps> = (props) => {
  const [isZoom, setIsZoom] = useState(false);

  const { manualZoomDim } = props;

  const Header = () => {
    return (
      <div className="flex items-center justify-between text-white">
        <div className="text-base font-bold">{props.title}</div>
        <button onClick={() => setIsZoom((prev) => !prev)}>
          {isZoom ? <ImShrink /> : <ImEnlarge />}
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-xl bg-white/10 p-4 ${
          props.className ? props.className : ""
        }`}
      >
        <Header />
        {props.children}
      </div>
      <Modal isOpen={isZoom} setIsOpen={setIsZoom}>
        <div
          className={`flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-2xl ${
            manualZoomDim ? manualZoomDim : "h-[70vh]"
          }`}
        >
          <Header />
          {props.children}
        </div>
      </Modal>
    </>
  );
};

export default ZoomCard;
