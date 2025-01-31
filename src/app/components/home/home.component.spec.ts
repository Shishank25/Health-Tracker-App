import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GraphDisplayComponent } from '../graph-display/graph-display.component';
import { DisplayTableComponent } from '../display-table/display-table.component';
import { ServiceFuncsService } from '../../services/service-funcs.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: ServiceFuncsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, GraphDisplayComponent, DisplayTableComponent, HomeComponent],
      providers: [ServiceFuncsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceFuncsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize local storage data on ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    component.ngOnInit();
    expect(localStorage.setItem).toHaveBeenCalledWith(component.LOCAL_STORAGE_KEY, jasmine.any(String));
  });

  it('should update paginated data', () => {
    spyOn(service, 'updatePaginatedData').and.returnValue([]);
    component.getPaginatedData();
    expect(service.updatePaginatedData).toHaveBeenCalledWith(component.usersList, component.currentPage, component.pageSize);
  });

  it('should add new user on form submission', () => {
    spyOn(localStorage, 'setItem');
    component.userName = 'Alice';
    component.selectedValue = 'Running';
    component.duration = 30;
    component.onSubmit();
    expect(component.usersList.some(user => user.name === 'Alice')).toBeTruthy();
  });

  it('should update existing user workout on form submission', () => {
    spyOn(localStorage, 'setItem');
    component.userName = 'John Doe';
    component.selectedValue = 'Yoga';
    component.duration = 40;
    component.onSubmit();
    const user = component.usersList.find(user => user.name === 'John Doe');
    expect(user?.workouts.some((workout: any) => workout.type === 'Yoga' && workout.mins === 40)).toBeTruthy();
  });

  it('should not submit if required fields are empty', () => {
    spyOn(window, 'alert');
    component.userName = '';
    component.selectedValue = '';
    component.duration = null;
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Please fill in all the fields.');
  });
});
