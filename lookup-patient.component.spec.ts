import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LookupPatientComponent } from './lookup-patient.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SpinnerService } from '../spinner/spinner.service';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { PatientDocumentService } from '../services/patientDocument.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('LookupPatientComponent', () => {
  let component: LookupPatientComponent;
  let fixture: ComponentFixture<LookupPatientComponent>;
  let form: DebugElement;
  let hbsID: DebugElement;
  let searchButton: DebugElement;
  let clearButton: DebugElement;
  let fb: FormBuilder;
  let searchService: SearchService;
  let spinnerService: SpinnerService;
  let patientDocService: PatientDocumentService;
  let modelService: NgbModal;
  let router: Router;

  let firstName: DebugElement;
  let lastName: DebugElement;
  let dob: DebugElement;
  let male: DebugElement;
  let female: DebugElement;
  let notSpecified: DebugElement;
  let address1: DebugElement;
  let address2: DebugElement;
  let city: DebugElement;
  let state: DebugElement;
  let zip: DebugElement;
  let phone: DebugElement;
  let gender: DebugElement;
  let maleLabel: DebugElement;
  let femaleLabel: DebugElement;
  let notSpecifiedLabel: DebugElement;
  let yesdemo: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LookupPatientComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        DatePipe,
        SpinnerService,
        AuthService,
        PatientDocumentService,
        SearchService,
        NgbModal,
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LookupPatientComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    searchService = TestBed.inject(SearchService);
    spinnerService = TestBed.inject(SpinnerService);
    patientDocService = TestBed.inject(PatientDocumentService);
    modelService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    form = fixture.debugElement.query(By.css('#patientLookupForm'));
    clearButton = fixture.debugElement.query(By.css('#reset'));
    firstName = fixture.debugElement.query(By.css('#firstName'));
    lastName = fixture.debugElement.query(By.css('#lastName'));
    dob = fixture.debugElement.query(By.css('#dob'));
    male = fixture.debugElement.query(By.css('#male'));
    maleLabel = fixture.debugElement.query(By.css('#maleLabel'));
    female = fixture.debugElement.query(By.css('#female'));
    yesdemo = fixture.debugElement.query(By.css('#yes-demo'));
    femaleLabel = fixture.debugElement.query(By.css('#femaleLabel'));
    notSpecified = fixture.debugElement.query(By.css('#notSpecified'));
    notSpecifiedLabel = fixture.debugElement.query(By.css('#notSpecifiedLabel'));
    address1 = fixture.debugElement.query(By.css('#addressline1'));
    address2 = fixture.debugElement.query(By.css('#addressline2'));
    city = fixture.debugElement.query(By.css('#city'));
    state = fixture.debugElement.query(By.css('#state'));
    zip = fixture.debugElement.query(By.css('#zipCode'));
    phone = fixture.debugElement.query(By.css('#phone'));
    searchButton = fixture.debugElement.query(By.css('#searchButton'));
    clearButton = fixture.debugElement.query(By.css('#reset'));
    gender = fixture.debugElement.query(By.css('#gender'));
    component.patientLookupForm = fb.group({
      patientLookUpOption: ['HBS'],
      HBSID: [''],
      firstName: [''],
      lastName: [''],
      dob: [''],
      zipCode: [''],
      gender: [''],
      addressline1: [''],
      addressline2: [''],
      city: [''],
      state: [''],
      phone: [''],
      NPI: ['']
    });
    fixture.detectChanges();
  });

  it('should set Validator For DemographicFields', () => {
    let errors = {};
    let firstName = component.patientLookupForm.controls['firstName'];
    expect(firstName.valid).toBeTruthy();
    errors = firstName.errors || {};
    expect(errors).toEqual({});
    expect(component.patientLookupForm.valid).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should form object exist', () => {
    form = fixture.debugElement.query(By.css('#patientLookupForm'))
    expect(form).toBeTruthy();
  });

  it('should form has all the fileds', () => {

    hbsID = fixture.debugElement.query(By.css('#hbs'));
    searchButton = fixture.debugElement.query(By.css('#search'));
    clearButton = fixture.debugElement.query(By.css('#reset'));
    expect(hbsID).toBeTruthy();
    expect(searchButton).toBeTruthy();
    expect(clearButton).toBeTruthy();

  });

  it('should allow us to set a value input field patient HBS ID', () => {
    const hbsID = component.patientLookupForm.controls.HBSID;
    hbsID.setValue('1234567890');
    expect(component.HBSID.value).toEqual('1234567890');
    expect(hbsID.valid).toBeTruthy();
  });

  it('should allow us to enter only 10 characters for the field patient HBS ID', () => {
    const hbsID = component.patientLookupForm.controls.HBSID;
    hbsID.setValue('12345678909');
    expect(component.HBSID.value).toEqual('12345678909');
    expect(hbsID.valid).toBeFalsy();

  });
  it('Should have called onSubmit function on click of the button', () => {
    spyOn(component, 'onSubmit');
    form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });
  describe('changeOption method', () => {
    it('first name text box should be present in default', () => {
      changeOption(yesdemo);
      expect(firstName).toBeDefined();
    });
    it('last name text box should be present in default', () => {
      expect(lastName).toBeDefined();
    });
    it('dob text box should be present in default', () => {
      expect(dob).toBeDefined();
    });
    it('male select component should present', () => {
      expect(male).toBeDefined();
    });
    it('female select component should present', () => {
      expect(female).toBeDefined();
    });
    it('not specified select component should present', () => {
      expect(notSpecified).toBeDefined();
    });
    it('Address line1 text box should be present', () => {
      expect(address1).toBeDefined();
    });
    it('Address line2 text box should be present', () => {
      expect(address2).toBeDefined();
    });
    it('City text box should be present', () => {
      expect(city).toBeDefined();
    });
    it('State text box should be present', () => {
      expect(state).toBeDefined();
    });
    it('Zip code text box should be present', () => {
      expect(zip).toBeDefined();
    });
    it('Phone text box should be present', () => {
      expect(phone).toBeDefined();
    });
    it('search button should be present', () => {
      expect(searchButton).toBeDefined();
    });
    it('clear link should be present', () => {
      expect(clearButton).toBeDefined();
    });
  });
  describe('onSubmit method', () => {
    it('should return error if HBSID is null', () => {
      spyOn(component, 'resetErrorBanner');
      component.onSubmit();
      expect(component.HBSID.errors).toBeDefined();
    });
    it(`should return response if patientLookUpOption == 'HBS'`, () => {
      spyOn(component, 'resetErrorBanner');
      component.HBSID.setValue('123456');
      spyOn(component, 'handleSearchResponse');
      spyOn(searchService, 'searchInternalPatient').and.returnValue(of(''));
      fixture.detectChanges();
      component.onSubmit();
      expect(component.handleSearchResponse).toHaveBeenCalled();
    });

    it(`should return response if patientLookUpOption == 'demographic'`, () => {
      component.patientLookUpOption.setValue('demographic');
      spyOn(component, 'resetErrorBanner');
      component.HBSID.setValue('123456');
      spyOn(component, 'handleSearchResponse');
      spyOn(searchService, 'searchPatientByDemo').and.returnValue(of(''));
      fixture.detectChanges();
      component.onSubmit();
      expect(component.handleSearchResponse).toHaveBeenCalled();
    });
  });

  describe('handleSearchResponse', () => {
    it('should return response', () => {
      const body = {
        response: {
          statusCode: '0000',
          resources: [
            {
              docRefs: [
                {
                  contentType: 'text/xml'
                }
              ]
            }
          ]
        }
      }
      spyOn(searchService, 'setInternalResource');
      spyOn(spinnerService, 'hide');
      spyOn(patientDocService, 'setDocList');
      spyOn(patientDocService, 'setPrescriber');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(searchService.setInternalResource).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(patientDocService.setDocList).toHaveBeenCalled();
      expect(patientDocService.setPrescriber).toHaveBeenCalled();
    });
    it('should return response', () => {
      const body = {
        response: {
          statusCode: '0000',
          resources: []
        }
      }
      spyOn(searchService, 'setInternalResource');
      spyOn(spinnerService, 'hide');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(searchService.setInternalResource).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });

    it('should return response', () => {
      const body = {
        response: {
          statusCode: '7003',
          resources: []
        }
      }
      spyOn(searchService, 'setShowfeedbackQuestion');
      spyOn(searchService, 'setInternalResource');
      spyOn(spinnerService, 'hide');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(searchService.setInternalResource).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });

    it('should return response', () => {
      const body = {
        response: {
          statusCode: '70031',
          resources: []
        }
      }
      spyOn(component, 'handleError');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(component.handleError).toHaveBeenCalled();
    });
    it('should return response', () => {
      const body = {}
      spyOn(component, 'handleError');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(component.handleError).toHaveBeenCalled();
    });

  });

  describe('handleError', () => {
    it('should handle error', () => {
      const response = {};
      const statusCode = 7003;
      const httpStatusCode = 500;
      spyOn(component, 'resetErrorBanner');
      spyOn(spinnerService, 'hide');
      component.handleError(response, statusCode, httpStatusCode);
      expect(component.resetErrorBanner).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });

    it('should handle error if response and statusCode is undifined', () => {
      const response = null;
      const statusCode = 111;
      const httpStatusCode = 500;
      spyOn(component, 'resetErrorBanner');
      spyOn(spinnerService, 'hide');
      component.handleError(response, statusCode, httpStatusCode);
      expect(component.resetErrorBanner).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });
  });
  describe('close method', () => {
    it('should call modalService dismissAll method', () => {
      spyOn(modelService, 'dismissAll');
      component.close();
      expect(modelService.dismissAll).toHaveBeenCalled();
    });
  });

  describe('advancedSearch method', () => {
    it('should call close method', () => {
      spyOn(component, 'close');
      component.advancedSearch();
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('maskDate method', () => {
    it('should call formatDate method', () => {
      const event = {
        inputType: 'click',
        target: {
          value: '2/2/1992'
        }
      };
      component.maskDate(event);
      expect(component.dob).toBeDefined();
    });

    it('should  format date when value length is 3', () => {
      const event = {
        inputType: 'click',
        target: {
          value: '2/2'
        }
      };
      component.maskDate(event);
      expect(component.dob).toBeDefined();
    });

    it('should  format date when value length is 5', () => {
      const event = {
        inputType: 'click',
        target: {
          value: '12/12'
        }
      };
      component.maskDate(event);
      expect(component.dob).toBeDefined();
    });

    it('should  format date when value length is 2', () => {
      const event = {
        inputType: 'click',
        target: {
          value: '2/'
        }
      };
      component.maskDate(event);
      expect(component.dob).toBeDefined();
      event.target.value = '12';
      component.maskDate(event)
      event.target.value = '';
      component.maskDate(event)
    });
  });

  describe('closeBanner method', () => {
    it('should set false to display in result', () => {
      component.closeBanner();
      expect(component.result.display).toBeFalsy();
    });
  });

  describe('setradio method', () => {
    it('should call close method', () => {
      spyOn(component, 'resetErrorBanner');
      spyOn(component, 'close');
      component.setradio('reset', '123');
      expect(component.close).toHaveBeenCalled();
    });

  });

  describe('advStartSearch method', () => {
    it('should call setInternalResource ', () => {
      spyOn(searchService, 'setInternalResource');
      spyOn(searchService, 'setSourcePage');
      component.advStartSearch();
      expect(searchService.setInternalResource).toHaveBeenCalled();
      expect(searchService.setSourcePage).toHaveBeenCalled();
    });
  });

  describe('startSearch method', () => {
    it('should call router navigate method ', () => {
      component.startSearch();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('fnNumbers method', () => {
    it('should return false if charcode is 32 ', () => {
      const status = component.fnNumbers({charCode: 32});
      expect(status).toBeFalsy();
    });
  });
  function changeOption(field: DebugElement) {
    fixture.detectChanges();
    field.nativeElement.checked = true;
    field.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }
});
