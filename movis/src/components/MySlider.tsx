import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 0.1;
const MIN = 0;
const MAX = 100;

interface IProps {
  values: number[];
  setValues: Dispatch<SetStateAction<number[]>>;
  rtl: boolean;
}

const MySlider: React.FC<IProps> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Range
        values={props.values}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={props.rtl}
        onChange={(values) => props.setValues(values)}
        renderTrack={({ props: cprops, children }) => (
          <div
            onMouseDown={cprops.onMouseDown}
            onTouchStart={cprops.onTouchStart}
            style={{
              ...cprops.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={cprops.ref}
              style={{
                height: "50px",
                width: "100%",
                borderRadius: "4px",
                border: "10px solid #0d41a5",
                background: getTrackBackground({
                  values: props.values,
                  colors: ["#548BF4", "#ccc"],
                  min: MIN,
                  max: MAX,
                  //rtl,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "42px",
              width: "42px",
              borderRadius: "4px",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 2px 6px #AAA",
              border: "solid 8px #000",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                height: "16px",
                width: "5px",
                backgroundColor: isDragged ? "#548BF4" : "#CCC",
              }}
            />
          </div>
        )}
      />
      <output style={{ marginTop: "30px" }} id="output">
        {props.values[0]?.toFixed(1)}
      </output>
    </div>
  );
};

export default MySlider;
