import { TestBed } from '@angular/core/testing';
import { ServiceFuncsService } from './service-funcs.service';

describe('ServiceFuncsService', () => {
  let service: ServiceFuncsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFuncsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return paginated data correctly', () => {
    const usersList = [
      { name: 'User1' }, { name: 'User2' }, { name: 'User3' },
      { name: 'User4' }, { name: 'User5' }, { name: 'User6' }
    ];
    const paginatedData = service.updatePaginatedData(usersList, 1, 2);
    expect(paginatedData).toEqual([{ name: 'User3' }, { name: 'User4' }]);
  });

  it('should return correct workout sum', () => {
    const workouts = [
      { type: 'Running', mins: 30 },
      { type: 'Cycling', mins: 45 }
    ];
    const sum = service.calculateWorkoutSum(workouts);
    expect(sum).toBe(75);
  });

  it('should return 0 if workouts array is empty', () => {
    const sum = service.calculateWorkoutSum([]);
    expect(sum).toBe(0);
  });

  it('should return 0 if workouts array is null or undefined', () => {
    expect(service.calculateWorkoutSum(null as any)).toBe(0);
    expect(service.calculateWorkoutSum(undefined as any)).toBe(0);
  });
});