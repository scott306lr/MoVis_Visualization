import { useEffect, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { getCountDictV2 } from "../utils/relationUtils";
import { iso_3166_1_2_digit_to_number_map } from "../utils/isoMapping";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

export default function Map(data: any) {
  const chartRef = useRef();
  const [countries, setCountries] = useState<any>([]);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((response) => response.json())
      .then((data) => {
        setCountries(
          (ChartGeo.topojson.feature(data, data.objects.countries) as any)
            .features
        );
      });
  }, []);

  const { countDict: movieCountryCount } = getCountDictV2(
    data["data"],
    ["countries"],
    [],
    "iso_3166_1",
    0,
    undefined
  );

  const geoMapCount = [];
  for (const key of Object.keys(movieCountryCount)) {
    const feat =
      countries[
        countries.findIndex(
          (d: any) => d.id == iso_3166_1_2_digit_to_number_map[key]
        )
      ];
    if (feat !== undefined)
      geoMapCount.push({
        feature: feat,
        value: Math.log(movieCountryCount[key]?.count ?? 1),
      });
  }

  const labels = geoMapCount.map((d: any) => d.feature.properties.name);

  return (
    <Chart
      ref={chartRef}
      type="choropleth"
      data={{
        labels: labels,
        datasets: [
          {
            outline: countries,
            label: "Countries",
            data: geoMapCount,
            // color from https://mdigi.tools/color-shades/#9417e2
            // backgroundColor: [
            //   // "#8815d0",
            //   // "#a22fea",
            //   // "#b75def",
            //   // "#cb8bf3",
            //   // "#e0baf8",
            //   // "#f5e8fd",
            // ],
          },
        ],
      }}
      options={{
        showOutline: true,
        showGraticule: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            text: "Number are normalized by Log scale",
            align: "start",
            display: false,
            font: {
              size: 14,
            },
          },
        },
        scales: {
          projection: {
            axis: "x",
            projection: "equalEarth",
          },
          //   Hide color scale: Looks like bug of React and Chartjs, cannot hide
          // color: {
          //  display: false
          // }
        },
      }}
    />
  );
}
