export interface ICombinedChart {
  title: string;
  xAxisLabel: string;
  yAxisLabelLeft: string;
  yAxisLabelRight: string;
  data: IChartProperties[];
}
export type IChartProperties = {
  month: string;
  temperature: number;
  rainfall: number;
}
