import { Injectable } from '@angular/core';
import {Observable, lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IBarChart} from "../models/bar-chart";
import {IPieChart} from "../models/pie-chart";
import {ICombinedChart} from "../models/combined-chart";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    protected httpClient: HttpClient,
  ) { }

  public async getBarChartData(): Promise<IBarChart> {
    const barChartData$ = this.httpClient.get<IBarChart>('assets/data/bar-chart-data.json');
    return await lastValueFrom(barChartData$);
  }

  public async getCombinedChartData(): Promise<ICombinedChart> {
    const combinedChartData$ = this.httpClient.get<ICombinedChart>('assets/data/combined-chart-data.json');
    return await lastValueFrom(combinedChartData$);
  }

  public async getPieChartData(): Promise<IPieChart> {
    const pieChartData$ = this.httpClient.get<IPieChart>('assets/data/pie-chart-data.json');
    return await lastValueFrom(pieChartData$);
  }
}
