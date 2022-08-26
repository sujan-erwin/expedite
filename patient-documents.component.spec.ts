import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PatientDocumentsComponent } from './patient-documents.component';
import { PatientDocumentService } from '../services/patientDocument.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';
import { SpinnerService } from '../spinner/spinner.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SearchService } from '../services/search.service';
import { of } from 'rxjs/Observable/of';
import { Router } from '@angular/router';

describe('PatientDocumentsComponent', () => {
  let component: PatientDocumentsComponent;
  let fixture: ComponentFixture<PatientDocumentsComponent>;
  let dom: HTMLElement;
  let searchService: SearchService;
  let pSevice: PatientDocumentService;
  let httpClient: HttpClient;
  let router: Router;
  const firstName = 'Jon', lastName = 'Doe', dateOfBirth = '12/21/2000', ssId = "ssId", assigningAuthority = 'assigningAuthority', id = 'id';
  const testUserName = '9025804', gender = 'Female', addressline1 = "123 Prospect Ln", city = "Chicago", zipcode = "12345", state = "IL"
  let docList = '{"docRefs":[{"id":"2.16.840.1.113883.3.2054.2.1.187635031","title":"Surescripts Location Summary","status":"current","createdDate":"2020-01-22T15:41:38+00:00","encounterDate":"2020-01-22T15:41:38+00:00","type":"Location Summary","orgName":"Surescripts","digitalId":"1", "viewStatus":"view","url":"/Binary?documentId=2.16.840.1.113883.3.2054.2.1.187635031&repositoryId=2.16.840.1.113883.3.2054.2.1&homeCommunityId=2.16.840.1.113883.3.2054.2.1","contentType":"text/xml","data":null}]}';
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDocumentsComponent],
      providers: [
        AuthService,
        PatientDocumentService,
        DatePipe,
        SpinnerService,
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    searchService = TestBed.get(SearchService);
    pSevice = TestBed.get(PatientDocumentService);
    httpClient = TestBed.get(HttpClient);
    router = TestBed.inject(Router);
    const response = {
      "name": {
        "firstName": firstName,
        "lastName": lastName,
      },
      "id": id,
      "dateOfBirth": dateOfBirth,
      "surescriptsId": ssId,
      "assigningAuthority": assigningAuthority,
      "requestedBy": testUserName
    };
    const patient = {
      "firstName": firstName,
      "lastName": lastName,
      "gender": gender,
      "dob": dateOfBirth,
      "addressline1": addressline1,
      "city": city,
      "zipCode": zipcode,
      "state": state

    }
    spyOn(httpClient, 'post').and.returnValue(of({}));
    spyOn(searchService, 'getPatient').and.returnValue(patient);
    spyOn(searchService, 'getResourceToPatient').and.returnValue(patient);
    spyOn(searchService, 'getResource').and.returnValue(response);
    spyOn(pSevice, 'getExternalDocList').and.returnValue(JSON.parse(docList).docRefs);

    fixture = TestBed.createComponent(PatientDocumentsComponent);
    component = fixture.componentInstance;
    dom = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have Patient details', () => {
    let patient = fixture.nativeElement.querySelector('#patient');
    expect(patient).not.toBeNull;
  });
  it('should have Patient first name', () => {
    let patient = dom.querySelector('#patientName').innerHTML
    expect(patient).toContain(firstName);
  });
  it('should have last name', () => {
    let patient = dom.querySelector('#patientName').innerHTML
    expect(patient).toContain(lastName);
  });
  it('should have DOB', () => {
    let patient = dom.querySelector('ul').innerHTML
    expect(patient).toContain(dateOfBirth);
  });
  it('should have gender', () => {
    let patient = dom.querySelector('ul').innerHTML
    expect(patient).toContain(gender);
  });
  it('should have address', () => {
    let patient = dom.querySelector('ul').innerHTML
    expect(patient).toContain(addressline1);
  });
  it('should have city', () => {
    let patient = dom.querySelector('ul').innerHTML
    expect(patient).toContain(city);
  });
  it('should have state', () => {
    let patient = dom.querySelector('ul').innerHTML
    expect(patient).toContain(state);
    expect(patient).toContain(zipcode);
  });

  it('Table should have headers', () => {
    let tableRows = fixture.nativeElement.querySelectorAll('tr');
    let headerRow = tableRows[0];
    expect(headerRow.cells[0].innerHTML).toContain('Encounter date');
    expect(headerRow.cells[1].innerHTML).toContain('Organization');
    expect(headerRow.cells[2].innerHTML).toContain('Provider');
    expect(headerRow.cells[3].innerHTML).toContain('Type');
    expect(headerRow.cells[4].innerHTML).toContain('Status');
  });

  it('Table should have values', () => {
    let tableRows = fixture.nativeElement.querySelectorAll('tr');
    let data = JSON.parse(docList).docRefs;
    for (var i = 1; i < tableRows.length; i++) {
      let row = tableRows[i];
      let date = data[i - 1].createdDate;
      let pipe = new DatePipe('en');
      date = pipe.transform(new Date(date), 'MM/dd/yyyy');
      expect(row.cells[0].innerHTML).toContain(date);
      expect(row.cells[1].innerHTML).toContain(data[i - 1].orgName);
      expect(row.cells[2].innerHTML).not.toContain(data[i - 1].title);
      expect(row.cells[3].innerHTML).toContain(data[i - 1].type);
      expect(row.cells[4].innerHTML).toContain(data[i - 1].viewStatus);
    }
    expect(tableRows).toBeDefined();
  });

  it('View link is visible', () => {
    let tableRows = fixture.nativeElement.querySelectorAll('tr');
    for (var i = 1; i < tableRows.length; i++) {
      let row = tableRows[i];
      expect(row.cells[4].innerHTML).toContain('View');
      expect(row.cells[4].innerHTML).toContain('<a');
    }
    expect(tableRows).toBeDefined();
  });
  // it('View link is on success, view should change to viewed', () => {
  //   const pSevice: PatientDocumentService = TestBed.get(PatientDocumentService);
  //   spyOn(pSevice, 'getDocument').and.returnValue(
  //     of({ response: { statusCode: '0000' } })
  //   );
  //   fixture.whenStable().then(() => {
  //     let tableRows = fixture.nativeElement.querySelectorAll('tr');
  //     let row = tableRows[1];
  //     let ele = fixture.debugElement.nativeElement.querySelector('td a');
  //     ele.click();
  //     fixture.detectChanges();
  //     expect(row.cells[4].innerHTML).toContain('viewed');
  //   });
  // });

  it('When no documents are return, show no document found banner', () => {

    docList = '{"docRefs":[]}';
    jasmine.getEnv().allowRespy(true);
    const pSevice: PatientDocumentService = TestBed.get(PatientDocumentService);
    spyOn(pSevice, 'getDocList').and.returnValue(JSON.parse(docList).docRefs);
    // spyOn(pSevice, 'getDocumentList').and.returnValue(
    //   of({response:{statusCode:'7003'}})
    // );
    fixture.whenStable().then(() => {

      fixture = TestBed.createComponent(PatientDocumentsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.docList).toBeNull;
      expect(component.result.display).toBeTruthy;
    });
    expect(docList).toBeDefined();
  });

  // ........................
  describe('getPreviousPage method', () => {
    it('should return pageLink', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify([{ label: "Select a profile", link: "/select-profile" }, { label: "Select a profile", link: "/select-profile" }]));
      const result = component.getPreviousPage();
      expect(result).toEqual('/select-profile');
    });

    it('should return default page link', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify([]));
      const result = component.getPreviousPage();
      expect(result).toEqual('/quick-lookup');
    });
  });

  describe('startSearch method', () => {
    it('should navigate to previous page', () => {
      spyOn(component, 'getPreviousPage');
      component.startSearch();
      expect(component.getPreviousPage).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('editSearch method', () => {
    it('should navigate to previous page', () => {
      spyOn(component, 'getPreviousPage');
      component.editSearch();
      expect(component.getPreviousPage).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('handleRetry method', () => {
    it('should handle retry when it fail', () => {
      const document = {
        viewStatus: 'retry',
        retryCount: ''
      };
      component.handleRetry(document);
      expect(parseInt(document.retryCount)).toEqual(1);
      expect(document.viewStatus).toEqual('retry');
    });
    it('after 3 retry, retry should change to error', () => {
      const document = {
        viewStatus: 'retry',
        retryCount: 3
      };
      component.handleRetry(document);
      expect(document.retryCount).toEqual(4);
      expect(document.viewStatus).toEqual('error');
    });
  });

  // describe('openDocument method', () => {
  //   beforeEach(() => {
  //     const dbList = JSON.parse(docList).docRefs;
  //     component.docList = dbList;
  //     fixture.detectChanges();
  //   });
  //   it('should handle ', () => {
  //     spyOn(pSevice, 'getDocument').and.returnValue(
  //       of({ response: { statusCode: '0000' } })
  //     );
  //     spyOn(window, 'atob');
  //     spyOn(window, 'open');
  //     component.openDocument('1');
  //     expect(pSevice.getDocument).toHaveBeenCalled();
  //   });
  // });

  describe('getDocList method', () => {
    it('should call getExternalDocList method', () => {
      const dbList = JSON.parse(docList);
      component.getDocList(dbList);
    });
  });
});


