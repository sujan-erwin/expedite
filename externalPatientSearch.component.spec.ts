import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExternalPatientSearchComponent } from './externalPatientSearch.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from "@angular/platform-browser";
import { errorBanners } from '../error-messages';
import { DatePipe } from '@angular/common';
import { SpinnerService } from '../spinner/spinner.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from '../services/search.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const patient = {
  HBSID:'123',
  firstName:'testing',
  lastName:'testing',
  middleName:'testing',
  suffix:'/',
  dob:'23072020',
  gender:'M',
  addressline1:'usa',
  addressline2:'texas',
  city:'newyork',
  state:'texas',
  zipCode:'523114',
  phone:'879033331',
  npi:'state'
};

describe('ExternalPatientSearchComponent', () => {
  let component: ExternalPatientSearchComponent;
  let fixture: ComponentFixture<ExternalPatientSearchComponent>;
  let hbsID: DebugElement;
  let firstName: DebugElement;
  let lastName: DebugElement;
  let dob: DebugElement;
  let form: DebugElement;
  let middleInital: DebugElement;
  let suffix: DebugElement;
  let male: DebugElement;
  let female: DebugElement;
  let notSpecified: DebugElement;
  let address1: DebugElement;
  let address2: DebugElement;
  let city: DebugElement;
  let state: DebugElement;
  let zip: DebugElement;
  let phone: DebugElement;
  let searchButton: DebugElement;
  let clearButton: DebugElement;
  let gender: DebugElement;
  let maleLabel: DebugElement;
  let femaleLabel: DebugElement;
  let notSpecifiedLabel: DebugElement;
  let router: Router;
  let searchService: SearchService;
  let spinnerService: SpinnerService;
  //let notSpecified:DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExternalPatientSearchComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        DatePipe,
        SpinnerService,
        SearchService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalPatientSearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchService = TestBed.inject(SearchService);
    spinnerService = TestBed.inject(SpinnerService);
    spyOn(searchService, 'getSourcePage').and.returnValue('lookupPatientPage');
    spyOn(searchService, 'getPatient').and.returnValue(patient);
    spyOn(searchService, 'getInternalResourceToPatient').and.returnValue(patient);
    form = fixture.debugElement.query(By.css('#externalsearchForm'));
    hbsID = fixture.debugElement.query(By.css('#HBS'));
    firstName = fixture.debugElement.query(By.css('#firstName'));
    lastName = fixture.debugElement.query(By.css('#lastName'));
    middleInital = fixture.debugElement.query(By.css('#middleName'));
    suffix = fixture.debugElement.query(By.css('#suffix'));
    dob = fixture.debugElement.query(By.css('#dob'));
    male = fixture.debugElement.query(By.css('#male'));
    maleLabel = fixture.debugElement.query(By.css('#maleLabel'));
    female = fixture.debugElement.query(By.css('#female'));
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should form object exist', () => {
    expect(form).toBeTruthy();
  });

  it('HBS ID text box should be present in default', () => {
    expect(hbsID).toBeTruthy();
  });
  // it('HBS ID search component should have empty value by default', () => {
  //   expect(component.HBSID.value).toEqual('');
  // });
  it('first name text box should be present in default', () => {
    expect(firstName).toBeTruthy();
  });
  it('last name text box should be present in default', () => {
    expect(lastName).toBeTruthy();
  });
  it('middle initial text box should be present in default', () => {
    expect(middleInital).toBeTruthy();
  });
  it('suffix text box should be present in default', () => {
    expect(suffix).toBeTruthy();
  });
  it('dob text box should be present in default', () => {
    expect(dob).toBeTruthy();
  });
  it('male select component should present', () => {
    expect(male).toBeTruthy();
  });
  it('female select component should present', () => {
    expect(female).toBeTruthy();
  });
  it('not specified select component should present', () => {
    expect(notSpecified).toBeTruthy();
  });
  // it('Address line1 text box should be present', () => {
  //   expect(address1).toBeTruthy();
  // });
  it('Address line2 text box should be present', () => {
    expect(address2).toBeTruthy();
  });
  it('City text box should be present', () => {
    expect(city).toBeTruthy();
  });
  it('State text box should be present', () => {
    expect(state).toBeTruthy();
  });
  it('Zip code text box should be present', () => {
    expect(zip).toBeTruthy();
  });
  it('Phone text box should be present', () => {
    expect(phone).toBeTruthy();
  });
  it('search button should be present', () => {
    expect(searchButton).toBeTruthy();
  });
  it('clear link should be present', () => {
    expect(clearButton).toBeTruthy();
  });
  it('Should have called onSubmit function on click of the button', () => {
    spyOn(component, 'onSubmit');
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });
  // it('Should get required fields highlighted with red color when submit clicked without giving required fields', () => {  
  //   //spyOn(component, 'onSubmit');
  //   form.triggerEventHandler('submit', null);
  //   fixture.detectChanges();
  //   expect(hbsID.nativeElement.classList).toContain('error');
  //   expect(firstName.nativeElement.classList).toContain('error');
  //   expect(lastName.nativeElement.classList).toContain('error');
  //   expect(dob.nativeElement.classList).toContain('error');
  //   expect(maleLabel.nativeElement.classList).toContain('error');
  //   expect(femaleLabel.nativeElement.classList).toContain('error');
  //   expect(notSpecifiedLabel.nativeElement.classList).toContain('error');
  //   expect(address1.nativeElement.classList).toContain('error');
  //   expect(city.nativeElement.classList).toContain('error');
  //   expect(state.nativeElement.classList).toContain('error');
  //   expect(zip.nativeElement.classList).toContain('error');
  // });
  it('Should have called clearSearch function on click of the button', () => {
    spyOn(component, 'clearSearch');
    clearButton.nativeElement.click();
    form.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.clearSearch).toHaveBeenCalled();
  });
  // it('should allow us to set a value input field patient HBS ID', () => {
  //   setInputValue(hbsID, '123456');
  //   expect(component.HBSID.value).toEqual('123456');
  //   expect(hbsID.nativeElement.classList).not.toContain('error');
  // });
  // it('should allow us to set a alphanumeric only for the field patient HBS ID', () => {
  //   setInputValue(hbsID, '!@#');
  //   expect(component.HBSID.value).toEqual('');
  //   expect(hbsID.nativeElement.classList).toContain('error');
  // });
  // it('should allow us to enter only 10 characters for the field patient HBS ID', () => {
  //   const  hbsID =  component.externalsearchForm.controls.HBSID;
  //   hbsID.setValue('12345678901234');
  //   expect(component.HBSID.value).toEqual('12345678901234');
  //   expect(hbsID.valid).toBeFalsy();
  // });
  it('should allow us to set 36 characters for input field patient first name', () => {
    setInputValue(firstName, 'KeihanaikukauakahihuliheekahaunaeleKeihanaikukauakahihuliheekahaunaele');
    expect(component.firstName.value).toEqual('KeihanaikukauakahihuliheekahaunaeleKeihanaikukauakahihuliheekahaunaele');
    expect(firstName.nativeElement.classList).toContain('error');
  });
  it('should allow us to set a value input field patient first name', () => {
    setInputValue(firstName, 'Mike');
    expect(component.firstName.value).toEqual('Mike');
    expect(firstName.nativeElement.classList).not.toContain('error');
  });

  it('should allow us to set a value input field patient last name', () => {
    setInputValue(lastName, 'Douglar');
    expect(component.lastName.value).toEqual('Douglar');
    expect(lastName.nativeElement.classList).not.toContain('error');
  });
  it('should allow us to set 36 characters for input field patient last name', () => {
    setInputValue(lastName, 'KeihanaikukauakahihuliheekahaunaeleKeihanaikukauakahihuliheekahaunaele');
    expect(component.lastName.value).toEqual('KeihanaikukauakahihuliheekahaunaeleKeihanaikukauakahihuliheekahaunaele');
    expect(lastName.nativeElement.classList).toContain('error');
  });
  it('should allow us to set a value input field patient dob', () => {
    setInputValue(dob, '01/13/2020');
    expect(component.dob.value).toEqual('01/13/2020');
    expect(dob.nativeElement.classList).not.toContain('error');
  });
  it('should allow us to enter valid date without leading zeros such as 1/1/2000 for input field patient dob', () => {
    setInputValue(dob, '1/1/2000');
    expect(component.dob.value).toEqual('01/01/2000');
    expect(dob.nativeElement.classList).not.toContain('error');
  });
  it('should allow us to enter valid date without leading zeros on date such as 01/1/2000 for input field patient dob', () => {
    setInputValue(dob, '01/1/2000');
    expect(component.dob.value).toEqual('01/01/2000');
    expect(dob.nativeElement.classList).not.toContain('error');
  });
  it('should allow us to enter valid date without leading zeros on month such as  1/01/2000 for input field patient dob', () => {
    setInputValue(dob, '1/01/2000');
    expect(component.dob.value).toEqual('01/01/2000');
    expect(dob.nativeElement.classList).not.toContain('error');
  });
  it('should allow us to enter leap year and feb month with 29 days such as 02/29/2000 for input field patient dob', () => {
    setInputValue(dob, '02/29/2000');
    expect(component.dob.value).toEqual('02/29/2000');
    expect(dob.nativeElement.classList).not.toContain('error');
  });
  it('should display invalid date if user enters invalid month such as 13/30/2000 for input field patient dob', () => {
    setInputValue(dob, '13/30/2000');
    expect(component.dob.value).toEqual('13/30/2000');
    expect(dob.nativeElement.classList).toContain('error');
  });
  it('should display invalid date if user enters invalid day such as 12/91/2000 for input field patient dob', () => {
    setInputValue(dob, '12/91/2000');
    expect(component.dob.value).toEqual('12/91/2000');
    expect(dob.nativeElement.classList).toContain('error');
  });
  it('should display invalid date if user enters before year 1920 such as 12/30/1919 for input field patient dob', () => {
    setInputValue(dob, '12/30/1919');
    expect(component.dob.value).toEqual('12/30/1919');
    expect(dob.nativeElement.classList).toContain('error');
  });
  it('should display invalid date if user enters day as 31 for the month have only 30 days such as 04/31/2000 for input field patient dob', () => {
    setInputValue(dob, '04/31/2000');
    expect(component.dob.value).toEqual('04/31/2000');
    expect(dob.nativeElement.classList).toContain('error');
  });
  it('should display invalid date if user enters invalid day for feb month such as 02/30/2000 input field patient dob', () => {
    setInputValue(dob, '02/30/2000');
    expect(component.dob.value).toEqual('02/30/2000');
    expect(dob.nativeElement.classList).toContain('error');
  });
  it('should display invalid date if user enters future date such as 04/27/2100 input field patient dob', () => {
    setInputValue(dob, '04/27/2100');
    expect(component.dob.value).toEqual('04/27/2100');
    expect(dob.nativeElement.classList).toContain('error');
  });
  it('change search option from male to female', () => {
    changeOption(female);
    expect(component.gender.value).toEqual('Female');
  });
  // it('should allow us to set a value input field patient addressLine1', () => {
  //   setInputValue(address1, '926 N cook Rd');
  //   expect(component.addressline1.value).toEqual('926 N cook Rd');
  //   expect(address1.nativeElement.classList).not.toContain('error');
  // });

  // it('should allow us to set only 100 characters in input field patient addressLine1', () => {
  //   setInputValue(address1, 'Northeast Kentucky Industrial ParkwayNortheast Kentucky Industrial ParkwayNortheast Kentucky Industrial ParkwayNortheast Kentucky Industrial ParkwayNortheast Kentucky Industrial Parkway');
  //   expect(component.addressline1.value).toEqual('Northeast Kentucky Industrial ParkwayNortheast Kentucky Industrial ParkwayNortheast Kentucky Industrial ParkwayNortheast Kentucky Industrial ParkwayNortheast Kentucky Industrial Parkway');
  //   expect(address1.nativeElement.classList).toContain('error');
  // });

  it('should allow us to set a value input field patient addressLine2', () => {
    setInputValue(address2, '926 N cook Rd');
    expect(component.addressline2.value).toEqual('926 N cook Rd');
    expect(address2.nativeElement.classList).not.toContain('error');
  });

  it('should allow us to set addressline max of 50 chars for input field patient addressLine2', () => {
    setInputValue(address2, '926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd');
    expect(component.addressline2.value).toEqual('926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd926 N cook Rd');
    expect(address2.nativeElement.classList).not.toContain('error');
  });

  it('should allow us to set a value input field patient city', () => {
    setInputValue(city, 'Northbrook');
    expect(component.city.value).toEqual('Northbrook');
    expect(city.nativeElement.classList).not.toContain('error');
  });

  it('should allow us to set only length of 46 chars for input field patient city', () => {
    setInputValue(city, 'Chargoggagoggmanchauggagoggchaubunagungamauggdd');
    expect(component.city.value).toEqual('Chargoggagoggmanchauggagoggchaubunagungamauggdd');
    expect(city.nativeElement.classList).toContain('error');
  });

  // it('should allow us to set a value input field to state', () => {
  //   state.nativeElement.value = state.nativeElement.options[5].value;
  //   state.nativeElement.dispatchEvent(new Event('change'));
  //   fixture.detectChanges();
  //   expect(component.state.value).toEqual('AR');
  //   form.triggerEventHandler('submit', null);
  //   expect(state.nativeElement.classList).not.toContain('error');
  // });

  it('should allow us to set a value input field patient zipcode', () => {
    setInputValue(zip, '60070');
    expect(component.zipCode.value).toEqual('60070');
    expect(zip.nativeElement.classList).not.toContain('error');
  });

  it('shouldnt allow us to set zipcode more than 5 chars for input field patient zipcode', () => {
    setInputValue(zip, '600704');
    expect(component.zipCode.value).toEqual('600704');
    expect(zip.nativeElement.classList).toContain('error');
  });

  it('should allow us to set phone number for input field patient phone number', () => {
    setInputValue(phone, '847-922-7905');
    expect(component.phone.value).toEqual('8479227905');
    expect(phone.nativeElement.classList).not.toContain('error');
  });

  it('shouldnt allow us to set invalid phone number for input field patient phone number', () => {
    setInputValue(phone, '123');
    expect(component.phone.value).toEqual('123');
    expect(phone.nativeElement.classList).toContain('error');
  });

  it('error Banner should displayed when service returns error', () => {
    component.result.display = true;
    component.result.banner = errorBanners.externalPatientSearch['default'];
    fixture.detectChanges();
    let banner = fixture.nativeElement.querySelector('#msgBanner');
    expect(banner.classList).toContain(component.result.banner.type);
  });

  it('error Banner should have title as server error when service returns error', () => {
    component.result.display = true;
    component.result.banner = errorBanners.externalPatientSearch['default'];
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('#title');
    expect(title.innerHTML).toContain(component.result.banner.title);
  });
  it('error Banner should have info when service returns error', () => {
    component.result.display = true;
    component.result.banner = errorBanners.externalPatientSearch['default'];
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('#content');
    expect(content.innerHTML).toContain(component.result.banner.info);
  });

  it('error Banner should clear when clear button is clicked', () => {
    component.result.display = true;
    component.result.banner = errorBanners.externalPatientSearch['default'];
    fixture.detectChanges();
    let banner = fixture.nativeElement.querySelector('#msgBanner');
    expect(banner.classList).toContain(component.result.banner.type);
    clearButton.nativeElement.click();
    form.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.result.display).toBeFalsy();
    banner = fixture.nativeElement.querySelector('#msgBanner');
    expect(banner).toBeNull;
  });

  describe('formatPatient method', () => {
    it('should call ', () => {
      const patient = {};
      const result = component.formatPatient(patient);
      expect(result).toBeDefined();
    });
  });

  describe('startSearch method', () => {
    it('should call navigate method', () => {
      spyOn(router, 'navigate');
      fixture.detectChanges();
      component.startSearch();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('handleSearchResponse method', () => {
    it('should call handleError method if the body response is empty', () => {
       const body = {};
       spyOn(component, 'handleError');
       fixture.detectChanges();
       component.handleSearchResponse(body);
       expect(component.handleError).toHaveBeenCalled();
    });
    it('should call router navigate method if the body response is defined', () => {
      const body = {
        response: {
          statusCode: '7203',
          resources:[{
            statusCode: '7203', 
          }]
        }
      };
      spyOn(router, 'navigate');
      spyOn(spinnerService, 'hide');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(router.navigate).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
   });
   it(`should call router navigate method if statusCode === '7003' || statusCode === '7205' || statusCode === '7206'`, () => {
    const body = {
      response: {
        statusCode: '7206',
        resources:[{
          statusCode: '7206', 
        }]
      }
    };
    spyOn(router, 'navigate');
    spyOn(spinnerService, 'hide');
    fixture.detectChanges();
    component.handleSearchResponse(body);
    expect(router.navigate).toHaveBeenCalled();
    expect(spinnerService.hide).toHaveBeenCalled();
 });

 it(`should call handleError method if statusCode doesn't match`, () => {
  const body = {
    response: {
      statusCode: '72061',
      resources:[{
        statusCode: '72061', 
      }]
    }
  };
  spyOn(component, 'handleError');
  fixture.detectChanges();
  component.handleSearchResponse(body);
  expect(component.handleError).toHaveBeenCalled();
});
  });

  describe('handleError method', () => {
    it('should handle error when we get runtime error', () => {
        spyOn(spinnerService, 'hide');
        fixture.detectChanges();
        const response = {
          statusCode: 7003,
          statusDesc: 'description'
        };
        component.handleError(response);
        expect(spinnerService.hide).toHaveBeenCalled();

        response.statusCode = 70031;
      component.handleError(response);

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

      event.target.value ='1201/';
      component.maskDate(event);
      expect(component.dob).toBeDefined();
    });

    it('should  format date when value length more than 6', () => {
      const event = {
        inputType: 'click',
        target: {
          value: '12121992'
        }
      };
      spyOn(component, 'formatDate');
      fixture.detectChanges();
      component.maskDate(event);
      expect(component.dob).toBeDefined();
      expect(component.formatDate).toHaveBeenCalled();
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

  describe('restrictValue method', () => {
    it('should remove restrictValue from the input', () => {
      component.middleName.setValue('testing');
      component.suffix.setValue('pre-');
      fixture.detectChanges();
      component.restrictValue(component.middleName, 'non-numeric');
      expect(component.middleName.value).toEqual('testing');
    });
  });
  describe('getAddress method', () => {
    it('should get address', () => {
        const event = {
          address: 'new york'
        };
       component.getAddress(event);
       expect(component.addressline1.value).toEqual(event.address);

       const event1 = {};
       component.getAddress(event1);
       expect(component.addressline1.value).toEqual('');
    });

    it('should return address1 if event.place is defined', () => {
       const event = {
         place: 'new york, usa'
       };
       component.getAddress(event);
       expect(component.addressline1.value).toBeDefined();
       expect(component.city.value).toBeDefined();
       expect(component.state.value).toBeDefined();
       expect(component.zipCode.value).toBeDefined();
    });
  });

  function setInputValue(field: DebugElement, value: string) {
    fixture.detectChanges();
    field.nativeElement.value = value;
    field.nativeElement.dispatchEvent(new Event('input'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
  }
  function changeOption(field: DebugElement) {
    fixture.detectChanges();
    field.nativeElement.checked = true;
    field.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }
});
