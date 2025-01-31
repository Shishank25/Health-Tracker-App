import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayTableComponent } from './display-table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceFuncsService } from '../../services/service-funcs.service';
import { By } from '@angular/platform-browser';

describe('DisplayTableComponent', () => {
  let component: DisplayTableComponent;
  let fixture: ComponentFixture<DisplayTableComponent>;
  let service: ServiceFuncsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, DisplayTableComponent],
      providers: [ServiceFuncsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTableComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceFuncsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize search list from localStorage on ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(component.searchList).toEqual(["All","Running","Cycling","Swimming","Yoga"]);
  });

  it('should call searchData on ngOnChanges', () => {
    spyOn(component, 'searchData');
    component.ngOnChanges();
    expect(component.searchData).toHaveBeenCalled();
  });

  it('should filter users based on searchTerm', () => {
    component.usersList = [
      { name: 'John Doe', workouts: [] },
      { name: 'Jane Smith', workouts: [] }
    ];
    component.searchTerm = 'Jane';
    component.searchData();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Jane Smith');
  });

  it('should return correct workout sum', () => {
    spyOn(service, 'calculateWorkoutSum').and.returnValue(100);
    const sum = component.getWorkoutSum([{ type: 'Running', mins: 50 }, { type: 'Cycling', mins: 50 }]);
    expect(sum).toBe(100);
  });

  it('should paginate data correctly', () => {
    spyOn(service, 'updatePaginatedData').and.returnValue([]);
    component.getPaginatedData();
    expect(service.updatePaginatedData).toHaveBeenCalledWith(component.filteredData, component.currentPage, component.pageSize);
  });

  it('should navigate to the next page', () => {
    component.totalPages = 3;
    component.currentPage = 0;
    component.nextPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not go beyond last page', () => {
    component.totalPages = 3;
    component.currentPage = 2;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should navigate to the previous page', () => {
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not go below first page', () => {
    component.currentPage = 0;
    component.prevPage();
    expect(component.currentPage).toBe(0);
  });
});