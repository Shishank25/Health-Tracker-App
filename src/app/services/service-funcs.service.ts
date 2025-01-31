import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceFuncsService {

  constructor() { }

  updatePaginatedData(usersList: any[], currentPage: number, pageSize: number): any[] {
    const start = currentPage * pageSize;
    return usersList.slice(start, start + pageSize);
  }

  calculateWorkoutSum(workouts: any[]): number {
    if (!workouts || workouts.length === 0) {
      return 0; 
    }
    return workouts.reduce((sum, workout) => sum + workout.mins, 0);
  }
}
