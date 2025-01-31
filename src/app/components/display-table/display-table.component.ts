import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceFuncsService } from '../../services/service-funcs.service';

@Component({
  selector: 'app-display-table',
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './display-table.component.html',
  styleUrl: './display-table.component.scss'
})
export class DisplayTableComponent {
  

//----To access the Service Functions-----  
  constructor(private workoutService: ServiceFuncsService){}


//----To store the data from the parent-----
  @Input() usersList: any[]= [];
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 5;
  @Input() totalPages: number = 0;


  SEARCH_LIST_KEY: string = 'customSearchList';

//----Arrays to store parsed or filtered data----
  searchList: any[] = [];
  paginatedData: any[] = [];
  filteredData: any[] = [];

//----Variables to store Searching Terms from <Input> and <Select> tags----
  searchTerm: string = '';
  searchWorkoutType: string = '';


//----Filter Data on change detection----
  ngOnChanges(){
    this.searchData();
  }


//----Access Local Storage data on Initialization----
  ngOnInit(){

      const storedSearchList = localStorage.getItem(this.SEARCH_LIST_KEY);

      if(!storedSearchList){
        this.searchList = ["All","Running","Cycling","Swimming","Yoga"];
      }
      else{
        this.searchList = JSON.parse(storedSearchList);
      }
      this.searchWorkoutType = this.searchList[0];

      this.searchData();
  }

  

//----Data for Table Loop----
  getPaginatedData = () => {
    this.paginatedData = this.workoutService.updatePaginatedData(this.filteredData, this.currentPage, this.pageSize)
  }



//----Searching Operations----

  workoutSearch(workouts: any[], searchTerm: string): boolean{
    
    const tempArr = workouts.filter(e => e.type.includes(searchTerm))

    if(tempArr.length === 0){
      return false;
    } else {
      return true;
    }

  }

  searchData(){

    this.filteredData = this.usersList.filter(e => e.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.getPaginatedData();
  }

//----


//----Array Operations

  stringOfItems(workouts: any[]) {
    return workouts.map(workout => workout.type).join(', ');
  }


  getWorkoutSum(workouts: any[]): number {
      return this.workoutService.calculateWorkoutSum( workouts );
  }

//----


//----Pagination Controls----

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getPaginatedData();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getPaginatedData();
    }
  }

}
