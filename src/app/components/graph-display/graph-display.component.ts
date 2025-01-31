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


//----To access the Service Functions-----
  constructor(private cd: ChangeDetectorRef,  private workoutService: ServiceFuncsService) { }


//----To store the User List passed from the "Home" Component----
  @Input() data: any[] = [];


//----To obtain the canvas HTML Element with the id #barCanvas----
  @ViewChild('barCanvas') barCanvas: ElementRef | undefined; 


//----Arrays to store Filtered User Data and Chart Plotting Data----
  newUsers: {name: string, mins: number}[] = [];
  values: number[] = [];
  names: string[] = [];

//----Variable to read name of user in the chart----
  selectedName: string = '';

//----Variable to store Chart object----
  barChart: any;



//----Render the chart after everything is set----
  ngAfterViewInit(): void {
    
    this.barChartMethod();

  }


//----Initialize Arrays-----
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

//----Function to communicate with Service----
  getWorkoutSum(workouts: any[]): number {
      return this.workoutService.calculateWorkoutSum( workouts )
  }

//----Function to Search <input> value and filter arrays----
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


//----Function to Render Bar Chart-----
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
