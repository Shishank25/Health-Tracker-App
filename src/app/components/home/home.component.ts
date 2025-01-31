import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphDisplayComponent } from '../graph-display/graph-display.component';
import { DisplayTableComponent } from '../display-table/display-table.component';
import { ServiceFuncsService } from '../../services/service-funcs.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, GraphDisplayComponent, DisplayTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  constructor( private workoutService: ServiceFuncsService ) { }

//----Local Storage Keys------
  LOCAL_STORAGE_KEY: string = 'usersAuth';
  WORKOUTS_KEY: string = 'newWorkoutList';
  SEARCH_LIST_KEY: string = 'customSearchList';


//----User Input Variables-----
  userName: string = '';
  selectedValue: string = 'Other';
  duration: number | null = null;

 
  newType: string = '';
  newUser: any[] = [];

//----Arrays for 'Select' tags---- 
  workoutList: any[] = ["Running","Cycling","Swimming","Yoga","Other"];
  searchList: any[] = ["All","Running","Cycling","Swimming","Yoga"];

//----Initial Users List----
  usersList: any[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [{ type: 'Running', mins: 30 },
                { type: 'Cycling', mins: 45 } ]
    },{
      id: 2,
      name: 'Jane Smith',
      workouts: [{ type: 'Swimming', mins: 60 },
                { type: 'Running', mins: 20 } ]
    },{
      id: 3,
      name: 'Mike Johnson',
      workouts: [{ type: 'Yoga', mins: 50 },
                { type: 'Cycling', mins: 40 } ]
    },
  ];

//----ID Variable------
  nextId: number = this.usersList.length;

//----Variables for Pagination
  currentPage = 0;
  pageSize = 5;
  paginatedData: any[] = [];
  totalPages = 0;

  

  ngOnInit(){

      const storedData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const storedSearchList = localStorage.getItem(this.SEARCH_LIST_KEY);
      const storedList = localStorage.getItem(this.WORKOUTS_KEY);

      if(storedData) {
        this.usersList = JSON.parse(storedData);
      } else { 
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.usersList))}

      if(storedSearchList){
        this.searchList = JSON.parse(storedSearchList);
      }

      if(storedList){
        this.workoutList = JSON.parse(storedList);
      }

      this.getPaginatedData();
      this.totalPages = Math.ceil(this.usersList.length / this.pageSize);
    
  }

  getPaginatedData = () => {
    this.paginatedData = this.workoutService.updatePaginatedData(this.usersList, this.currentPage, this.pageSize);
  }

  onSubmit() {

    if (this.userName && this.selectedValue && this.duration) {

    
    //----To get value from <Input> incase <Select> is "Other"----
      this.newType = this.selectedValue == "Other" ? this.newType :
      this.selectedValue;

      if ( this.newType.length === 0)  { alert("Please fill in all the fields."); return}


    //----To Read and Store values of New Workout Types------

      if(!this.workoutList.some(e => e.toLowerCase().includes(this.newType.toLowerCase()))){
        this.workoutList.splice(this.workoutList.length - 1, 0,this.newType)
      }

      localStorage.setItem(this.WORKOUTS_KEY,JSON.stringify(this.workoutList));

      if(!this.searchList.some(e => e.toLowerCase().includes(this.newType.toLowerCase()))){
        this.searchList.push(this.newType)
      }

      localStorage.setItem(this.SEARCH_LIST_KEY,JSON.stringify(this.searchList));

    //-----

    //----To check if user already exists---
    
      this.newUser = this.usersList.filter(person => person.name.toLowerCase().includes(this.userName.toLowerCase()))

      this.nextId = this.usersList.length + 1;
      
      if(this.newUser.length === 0){
        this.usersList.push({
          id: this.nextId,
          name: this.userName,
          workouts: [{ type: this.newType, mins: this.duration }]
          })
      } else {
        this.newUser[0].workouts.push({type: this.newType, mins: this.duration});
      }
    
      localStorage.setItem(this.LOCAL_STORAGE_KEY,JSON.stringify(this.usersList));

      this.usersList = JSON.parse(JSON.stringify(this.usersList));

    //----

    //----Reset form after submission----
      this.userName = '';
      this.selectedValue = '';
      this.duration = null;
      this.newType = '';

      this.totalPages = Math.ceil(this.usersList.length / this.pageSize);
      this.getPaginatedData();

    } else {
      // Handle validation: inform the user if any field is missing
      alert("Please fill in all the fields.");
    }


  }
}
