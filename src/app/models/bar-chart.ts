export interface IBarChart {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  data: IChartProperties[];
}
export interface IChartProperties {
  date: string;
  month: string;
  liters: number
}
