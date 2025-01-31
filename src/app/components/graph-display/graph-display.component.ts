import { Component, Input, ChangeDetectorRef, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { ServiceFuncsService } from '../../services/service-funcs.service';

@Component({
  selector: 'app-graph-display',
  imports: [ FormsModule],
  templateUrl: './graph-display.component.html',
  styleUrls: ['./graph-display.component.scss']
})
export class GraphDisplayComponent implements AfterViewInit, OnInit{

  constructor(private cd: ChangeDetectorRef,  private workoutService: ServiceFuncsService) { }

  @Input() data: any[] = [];

  @ViewChild('barCanvas') barCanvas: ElementRef | undefined; 

  newUsers: {name: string, mins: number}[] = [];
  values: number[] = [];
  names: string[] = [];

  selectedName: string = '';

  barChart: any;


  ngAfterViewInit(): void {
    
    this.barChartMethod();

  }

  ngOnInit(): void {

    if (this.data.length > 0) {

      this.newUsers = this.data.map((item) => {
          return {
            name: item.name, 
            mins: this.getWorkoutSum(item.workouts)
          };
      });

      this.values = this.newUsers.map((e) => e.mins);
      this.names = this.newUsers.map((e) => e.name.toLowerCase());
    }
    
  }

  getWorkoutSum(workouts: any[]): number {
      return this.workoutService.calculateWorkoutSum( workouts )
  }

  spliceSearch(name: string){

    if (name.trim() === '') {
      
      this.names = this.newUsers.map((e) => e.name.toLowerCase());
      this.values = this.newUsers.map((e) => e.mins);
    } else {
      const filteredNames = this.newUsers.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
  
      if (filteredNames.length > 0) {
        this.names = filteredNames.map(e => e.name.toLowerCase());
        this.values = filteredNames.map(e => e.mins);
      } else {
        this.names = [];
        this.values = [];
      }
    }

    this.barChartMethod();
    this.cd.detectChanges();
  }

  barChartMethod(): void{

    if(this.barChart) { this.barChart.destroy() }

    this.barChart = new Chart(this.barCanvas?.nativeElement, {
      type: 'bar',
      data: {
        labels: this.names,
        datasets: [{
          label: 'Total Time Exercised',
          data: this.values,
        }]
      },
      options: {
        
      }}
    )
  }

}
