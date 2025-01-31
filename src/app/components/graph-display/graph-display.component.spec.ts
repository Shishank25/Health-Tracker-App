import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphDisplayComponent } from './graph-display.component';
import { FormsModule } from '@angular/forms';
import { ServiceFuncsService } from '../../services/service-funcs.service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

describe('GraphDisplayComponent', () => {
  let component: GraphDisplayComponent;
  let fixture: ComponentFixture<GraphDisplayComponent>;
  let service: ServiceFuncsService;
  let cd: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, GraphDisplayComponent],
      providers: [ServiceFuncsService, ChangeDetectorRef]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphDisplayComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceFuncsService);
    cd = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on ngOnInit', () => {
    component.data = [
      { name: 'John', workouts: [{ type: 'Running', mins: 30 }] },
      { name: 'Jane', workouts: [{ type: 'Cycling', mins: 45 }] }
    ];
    component.ngOnInit();
    expect(component.newUsers.length).toBe(2);
    expect(component.values).toEqual([30, 45]);
    expect(component.names).toEqual(['john', 'jane']);
  });

  it('should calculate workout sum', () => {
    spyOn(service, 'calculateWorkoutSum').and.returnValue(75);
    const sum = component.getWorkoutSum([{ type: 'Yoga', mins: 75 }]);
    expect(sum).toBe(75);
  });

  it('should filter search results correctly', () => {
    component.newUsers = [
      { name: 'John Doe', mins: 50 },
      { name: 'Jane Smith', mins: 60 }
    ];
    component.spliceSearch('Jane');
    expect(component.names).toEqual(['jane smith']);
    expect(component.values).toEqual([60]);
  });

  it('should reset search when input is empty', () => {
    component.newUsers = [
      { name: 'John Doe', mins: 50 },
      { name: 'Jane Smith', mins: 60 }
    ];
    component.spliceSearch('');
    expect(component.names).toEqual(['john doe', 'jane smith']);
    expect(component.values).toEqual([50, 60]);
  });

  it('should initialize bar chart', () => {
    spyOn(Chart.prototype, 'destroy');
    component.barCanvas = new ElementRef(document.createElement('canvas'));
    component.barChartMethod();
    expect(component.barChart).toBeTruthy();
  });
});
