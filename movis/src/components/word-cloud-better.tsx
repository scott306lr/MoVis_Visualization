import ReactWordcloud from "react-wordcloud";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

export default function WordCloud(props: { keywordsCountDict: any }) {
  const { keywordsCountDict } = props;

  const data = [];
  for (const keyword in keywordsCountDict) {
    data.push({ text: keyword, value: keywordsCountDict[keyword].count });
  }

  const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [10, 90],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  } as any;

  return (
    <>
      <div className="h-full w-full">
        <ReactWordcloud options={options} words={data} />
      </div>
    </>
  );
}
