export const playerStatsChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
      display: false,
    },
  },
};

const labels = ["Januaryz", "February", "March", "April", "May", "June", "July"];

export const playerStatsChartData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => Math.random() * 1000),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => Math.random() * 1000),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Dataset 3",
      data: labels.map(() => Math.random() * 1000),
      borderColor: "rgb(201, 191, 145)",
      backgroundColor: "rgba(201, 191, 145,0.5)",
    },
  ],
};

