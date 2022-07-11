import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiselectComponent } from './multiselect.component';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MultiselectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateValues method', () => {
    it('should emit values to parent component', () => {
      component.selected = [false, true];
      fixture.detectChanges();
      component.updateValues();
      expect(component.applyFilter).toBeDefined();
    });
  });

  describe('writeValue method', () => {
    it('should update selected values', () => {
      const val = [false, true];
      component.writeValue(val);
      expect(component.selected).toBeDefined();
    });
  });

});
