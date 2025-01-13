import React from "react";
import { Doughnut } from "react-chartjs-2";
import styles from "./index.module.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// const cityData = {
//   Hyderabad: {
//     ageData: [60, 30, 10],
//     percentage: "30%",
//   },
//   Pune: {
//     ageData: [50, 40, 10],
//     percentage: "10%",
//   },
//   Mumbai: {
//     ageData: [70, 20, 10],
//     percentage: "10%",
//   },
//   Bangalore: {
//     ageData: [65, 25, 10],
//     percentage: "09%",
//   },
//   Delhi: {
//     ageData: [80, 15, 5],
//     percentage: "04%",
//   },
//   Delhiy: {
//     ageData: [80, 15, 5],
//     percentage: "04%",
//   },
// };

const PieChart = ({ cityData, agePercentagesData }) => {
  const createGradient = (ctx, color1, color2, color3, color4) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.25, color2);
    gradient.addColorStop(0.6, color3);
    gradient.addColorStop(1, color4);

    return gradient;
  };

  // const handleCityClick = (city) => {
  //   setSelectedCity(city);
  // };
  console.log(agePercentagesData, "agePercentagesDataFinal");
  const ageData = {
    labels: agePercentagesData && Object.keys(agePercentagesData),
    datasets: [
      {
        label: "Age Distribution",
        data: agePercentagesData && Object.values(agePercentagesData),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null; // Prevent issues on initial load
          }
          const gradient1 = createGradient(
            ctx,
            "#EAEBFF",
            "#FF600D",
            "#F26922",
            "#FFBD9F",
          );
          const gradient3 = createGradient(
            ctx,
            "#FFA215",
            "#FFBB54",
            "#FFBB54",
            "#FFA215",
          );
          const gradient2 = createGradient(
            ctx,
            "#EAEBFF",
            "#D6D7EF",
            "#D6D7EF",
            "#EAEBFF",
          );
          return context.dataIndex === 0
            ? gradient1
            : context.dataIndex === 1
              ? gradient3
              : gradient2;
        },
        borderWidth: 3,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      datalabels: {
        display: false, // Disable data labels
      },
    },
    elements: {
      arc: {
        borderWidth: 3, // Ensure the border width matches the dataset border width
      },
    },
    cutout: "80%", // Adjust the size of the doughnut hole
  };
  // console.log(cityData, "cityData");

  return (
    <div className={styles.barChartClass} data-testid="bar-chart-class">
      {/* <div className={styles.chartContainer}> */}
      <span className={styles.chartTitle} data-testid="chart-title">
        Registration and attendance
      </span>
      <div className={styles.chartContainer} data-testid="chart-container">
        <div className={styles.cityList} data-testid="city-list">
          {cityData &&
            Object.keys(cityData)?.map((city) => (
              <div
                key={city}
                className={styles.nonActiveCity}
                data-testid={`city-${city}`}
                // onClick={() => handleCityClick(city)}
              >
                <span
                  className={styles.cityHighlight}
                  data-testid={`city-highlight-${city}`}
                >
                  {city}
                </span>
                <span
                  data-testid={`city-percentage-${city}`}
                >{`${cityData[city]}%`}</span>
                {/* <span>{`${city === "Hyderabad" ? "30%" : city === "Pune" ? "10%" : city === "Mumbai" ? "10%" : city === "Bangalore" ? "09%" : "04%"}`}</span> */}
              </div>
            ))}
        </div>
        {!cityData && (
          <div data-testid="no-cities-data">No cities data found</div>
        )}
        <div className={styles.chartsDiv} data-testid="charts-div">
          {agePercentagesData ? (
            <div className={styles.charts} data-testid="charts">
              <div
                className={styles.doughnutChart}
                data-testid="doughnut-chart"
              >
                <Doughnut
                  data={ageData}
                  options={options}
                  data-testid="doughnut"
                />
                <p data-testid="age-distribution">Age distribution</p>
              </div>
            </div>
          ) : (
            <div data-testid="no-age-data">No age data found</div>
          )}
        </div>
        {agePercentagesData && (
          <div className={styles.header} data-testid="header">
            <div className={styles.legend} data-testid="legend-3-18">
              <span
                className={styles.dot}
                style={{ backgroundColor: "#FF600D" }}
                data-testid="dot-3-18"
              ></span>
              <span
                className={styles.agepercentage}
                data-testid="agepercentage-3-18"
              >
                {agePercentagesData["3-18"]}%
                <span className={styles.ageRange} data-testid="ageRange-3-18">
                  3 - 18
                </span>
              </span>
            </div>
            <div className={styles.legend} data-testid="legend-19-60">
              <span
                className={styles.dot}
                style={{ backgroundColor: "#FFBB54" }}
                data-testid="dot-19-60"
              ></span>
              <span
                className={styles.agepercentage}
                data-testid="agepercentage-19-60"
              >
                {agePercentagesData["19-60"]}%
                <span className={styles.ageRange} data-testid="ageRange-19-60">
                  19 - 60
                </span>
              </span>
            </div>
            <div className={styles.legend} data-testid="legend-60+">
              <span
                className={styles.dot}
                style={{ backgroundColor: "#DCDCDC" }}
                data-testid="dot-60+"
              ></span>
              <span
                className={styles.agepercentage}
                data-testid="agepercentage-60+"
              >
                {agePercentagesData["60+"]}%
                <span className={styles.ageRange} data-testid="ageRange-60+">
                  {">"}60
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default PieChart;
