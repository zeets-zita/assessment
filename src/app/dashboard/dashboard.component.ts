import {Component, OnInit, ViewChild} from '@angular/core';
import {IPieChart} from "../models/pie-chart";
import {IChartProperties, ICombinedChart} from "../models/combined-chart";
import {IBarChart} from "../models/bar-chart";
import {ChartService} from "../services/chart.service";
import * as d3 from 'd3';
import {OverlayPanel} from "primeng/overlaypanel";
import {DatePipe} from "@angular/common";

interface IMonths {
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;

  private barChart: IBarChart = {} as IBarChart;
  private combinedChart: ICombinedChart = {} as ICombinedChart;
  private pieChart: IPieChart = {} as IPieChart;

  public currentDate: string | null = '';

  public months: IMonths[] | undefined
  public selectedMonth: IMonths | undefined;

  public newDataAvailable: boolean = false;
  public isSidebarHidden: boolean = false;

  public lightMode: string = 'Sun';

  public themeOptions = [
    { label: 'Sun', value: 'Sun' },
    { label: 'Moon', value: 'Moon' }
  ];
  public menuItems = [
    { label: 'Home', icon: 'pi pi-home'},
    { label: 'Dashboard', icon: 'pi pi-file'},
    { label: 'Settings', icon: 'pi pi-cog',},
  ];

  private barSvg: any;
  private pieSvg: any;
  private svg: any;
  private margin = 50;
  private width: number = 0;
  private height: number = 0;
  private pieWidth: number = 0;
  private pieHeight: number = 0;
  private radius: number = 0;
  private pieChartTransform: number = 150;
  private colors: any;

  public activeIndex: number = 0;
  public activeMenuIndex: number = 1;

  constructor(
    private chartService: ChartService,
    private datePipe: DatePipe,
  ) {

    window.addEventListener('resize', () => {
      this.setDimensions();

    });

  }

  public async ngOnInit(): Promise<void> {
    this.setDimensions();

    this.setPropertiesOnLoad();
    this.setActiveMenuItem(1);

    await this.getAllChartData();

    this.createBarChartSvg();
    this.drawBars(this.barChart);

    this.createPieChartSvg();

    this.createColors();
    this.drawChart();

    this.createCombinedChartSvg();
    this.drawCombinedChart(this.combinedChart);

    this.delay(4000).then(() => {
      let audio: HTMLAudioElement = new Audio('../../assets/sounds/notification.wav');
      audio.play();

      this.newDataAvailable = true;
    });
  }

  private setPropertiesOnLoad(): void {
    this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    this.months = [
      { name: 'January' },
      { name: 'February' }
    ];

    this.selectedMonth = this.months[0];
  }

  public previousStep(): void {
    this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : 2;
  }

  public nextStep(): void {
    this.activeIndex = this.activeIndex < 2 ? this.activeIndex + 1 : 0;
  }

  public setActiveMenuItem(index: number): void {
    this.activeMenuIndex = index;
  }

  public toggleSidebar() {
    console.log('test')
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  public toggleTheme(): void {
    document.body.classList.toggle('dark-mode', this.lightMode === 'Moon');
  }

  public toggleNotification(event: Event): void {
    if (this.newDataAvailable && this.overlayPanel) {
      this.overlayPanel.toggle(event);
    }
  }

  public toggleMonth(event: any): void {
    this.selectedMonth = event.value;
    this.updateBarChart();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private setDimensions(): void {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    this.width = Math.min(screenWidth * 0.8, 900) - this.margin * 2;
    this.height = Math.min(screenHeight * 0.5, 400) - this.margin * 2;

    this.pieWidth = Math.min(screenWidth * 0.6, 755);
    this.pieHeight = Math.min(screenHeight * 0.6, 300);

    this.radius = Math.min(this.pieWidth, this.pieHeight) / 2 - this.margin;

    if (this.width < 1450) {
      this.pieWidth = Math.min(screenWidth * 0.6, 400)
    }

    this.isSidebarHidden = screenWidth < 1025;

    if (screenWidth < 430) {
      this.pieChartTransform = 100;
      this.pieWidth = 370;
    }
  }

  private async getAllChartData(): Promise<void> {
    this.barChart = await this.chartService.getBarChartData();
    this.combinedChart = await this.chartService.getCombinedChartData();
    this.pieChart = await this.chartService.getPieChartData();
  }

  private createBarChartSvg(): void {
    this.barSvg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + this.margin * 2)
      .attr("height", this.height + this.margin * 2)
      .append("g")
      .attr("transform", `translate(${this.margin},${this.margin / 2})`);

    this.barSvg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${this.height})`);
    this.barSvg.append("g").attr("class", "y-axis");
  }

  private drawBars(barChartData: IBarChart): void {
    this.barChart = barChartData;
    this.updateBarChart();
  }

  private updateBarChart(): void {
    const filteredData = this.barChart.data.filter(d => d.month === this.selectedMonth?.name);

    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(filteredData.map(d => d.date))
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.liters) || 0])
      .range([this.height, 0]);

    this.barSvg.select(".x-axis")
      .transition()
      .duration(500)
      .call(d3.axisBottom(x).tickFormat(d => d.toString().slice(8)))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    this.barSvg.select(".y-axis")
      .transition()
      .duration(500)
      .call(d3.axisLeft(y));

    const bars = this.barSvg.selectAll(".bar")
      .data(filteredData, (d: any) => d.date);

    bars.exit()
      .transition()
      .duration(500)
      .attr("opacity", 0)
      .remove();

    const barsEnter = bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: any) => x(d.date) as number)
      .attr("y", this.height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", this.selectedMonth?.name === "January" ? "#95818D" : "#8AAA79");

    barsEnter.merge(bars)
      .transition()
      .duration(500)
      .attr("y", (d: any) => y(d.liters))
      .attr("height", (d: any) => this.height - y(d.liters))
      .attr("opacity", 1);

    barsEnter.merge(bars)
      .on("mouseover", (event: any, d: any) => {
        d3.select(event.target as SVGRectElement).attr("fill", "#658256");

        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Liters: ${d.liters}`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", (event: any, d: any) => {
        d3.select(event.target as SVGRectElement)
          .attr("fill", this.selectedMonth?.name === "January" ? "#95818D" : "#8AAA79");

        tooltip.transition().duration(500).style("opacity", 0);
      });

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background-color", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("font-size", "12px");

    this.barSvg.append("text")
      .attr("class", "x-axis-label")
      .attr("x", this.width / 2)
      .attr("y", this.height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Date");

    this.barSvg.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -this.height / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .style("font-size", "14px")
      .text("Liters");
  }

  private createPieChartSvg(): void {
    this.pieSvg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.pieWidth)
      .attr("height", this.pieHeight)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.pieChartTransform + "," + this.pieChartTransform + ")"
      );
  }

  private createColors(): void {
    this.colors = d3.scaleOrdinal()
      .domain(this.pieChart.categories.map(d => d.label))
      .range(["#8AAA79", "#A2666F", "#95818D"]);
  }

  private drawChart(): void {
    const pie = d3.pie<any>().value((d: any) => Number(d.value));
    const arc = d3.arc<d3.DefaultArcObject>().innerRadius(0).outerRadius(this.radius);
    const arcHover = d3.arc<d3.DefaultArcObject>().innerRadius(0).outerRadius(this.radius + 10);

    const chartGroup = this.pieSvg.append("g")

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background-color", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("font-size", "12px");

    const slices = chartGroup.selectAll("path")
      .data(pie(this.pieChart.categories))
      .enter()
      .append("path")
      .attr("d", (d: d3.DefaultArcObject) => arc(d as d3.DefaultArcObject)!)
      .attr("fill", (d: any, i: number) => this.colors(i))
      .style("cursor", "pointer")
      .on("mouseover", (event: MouseEvent, d: { data: { label: any; value: any } }) => {
        d3.select(event.currentTarget as HTMLElement)
          .transition()
          .duration(200)
          .attr("d", d => arcHover(d as d3.DefaultArcObject)!);

        tooltip.html(`${d.data.label}: ${d.data.value}%`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`)
          .style("opacity", 1);
      })
      .on("mousemove", (event: MouseEvent) => {
        tooltip.style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", (event: MouseEvent, d: any) => {
        d3.select(event.currentTarget as HTMLElement)
          .transition()
          .duration(200)
          .attr("d", d => arc(d as d3.DefaultArcObject)!);

        tooltip.style("opacity", 0);
      });

    const legendX = this.radius + 40;
    const legend = this.pieSvg
      .selectAll(".legend")
      .data(this.pieChart.categories)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d: any, i: number) => `translate(${legendX}, ${i * 20 - this.pieChart.categories.length * 10})`);

    legend.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d: any, i: any) => this.colors(i));

    legend.append("text")
      .attr("class", "pie-chart-label")
      .attr("x", 18)
      .attr("y", 10)
      .style("font-size", "14px")
      .text((d: { label: any; }) => d.label);
  }


  private createCombinedChartSvg(): void {
    this.svg = d3.select("figure#combined")
      .append("svg")
      .attr("width", this.width + this.margin * 2)
      .attr("height", this.height + this.margin * 2)
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawCombinedChart(barChartData: ICombinedChart): void {
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(barChartData.data.map((d: IChartProperties) => d.month))
      .padding(0.2);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const y = d3.scaleLinear()
      .domain([0, d3.max(barChartData.data, (d: IChartProperties) => Math.max(d.temperature, d.rainfall)) || 0])
      .range([this.height, 0]);

    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.selectAll("bars")
      .data(barChartData.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: IChartProperties) => x(d.month) as number)
      .attr("y", (d: IChartProperties) => y(d.rainfall))
      .attr("width", x.bandwidth())
      .attr("height", (d: IChartProperties) => this.height - y(d.rainfall))
      .attr("fill", "#A2666F")
      .on("mouseover", (event: any, d: IChartProperties) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Rainfall: ${d.rainfall} mm`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    const line = d3.line<IChartProperties>()
      .x((d) => (x(d.month)! + x.bandwidth() / 2))
      .y((d) => y(d.temperature));

    const temperatureLine = this.svg.append("path")
      .data([barChartData.data])
      .attr("d", line)
      .attr("class", "line-temperature")
      .attr("fill", "none")
      .attr("stroke", "#8AAA79")
      .attr("stroke-width", 4);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background-color", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("font-size", "12px");

    temperatureLine
      .on("mouseover", (event: any, d: any) => {
        tooltip.transition().duration(200).style("opacity", .9);

        const mouseX = event.pageX - this.svg.node().getBoundingClientRect().left;

        const hoverAreaWidth = x.bandwidth() * 4;
        const closestIndex = barChartData.data.findIndex((data: IChartProperties, index: number) => {
          const xPosition = x(data.month)! + x.bandwidth() / 2;
          return Math.abs(mouseX - xPosition) < hoverAreaWidth / 2;
        });

        const closestData = barChartData.data[closestIndex];

        if (closestData) {
          tooltip.html(`Temperature: ${closestData.temperature}°C`)
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
        }
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    this.svg.append("text")
      .attr("class", "x-axis-label")
      .attr("x", this.width / 2)
      .attr("y", this.height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Months");

    this.svg.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -this.height / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .style("font-size", "14px")
      .text("Rainfall");
  }

}
