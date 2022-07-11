import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { InternalPatientDocumentsComponent } from './internal-patient-documents.component';
import { DatePipe } from '@angular/common';
import { NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../spinner/spinner.service';
import { RouterModule, ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { PatientDocumentService } from '../services/patientDocument.service';
import { SearchService } from '../services/search.service';
import { By } from "@angular/platform-browser";
import { of } from 'rxjs/Observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { resolve } from 'path';

describe('InternalPatientDocumentsComponent', () => {
  let component: InternalPatientDocumentsComponent;
  let fixture: ComponentFixture<InternalPatientDocumentsComponent>;
  let params: Subject<Params>;
  let searchService: SearchService;
  let modalService: NgbModal;
  let spinnerService: SpinnerService;
  let router: Router;
  let pSevice: PatientDocumentService;
  let httpClient: HttpClient;
  let authService: AuthService;
  const firstName = 'peggy', lastName = 'Heist', dateOfBirth = '12/21/2000', ssId = "ssId", assigningAuthority = 'assigningAuthority', id = 'id', docSearchDate = 'docSearchDate';
  const testUserName = '9025804', gender = 'Female', addressline1 = "123 Prospect Ln", city = "Chicago", zipcode = "12345", state = "IL";
  let docList = '{"docRefs":[{"id": "391","title": "Ambulatory Summary","status": "Relevant Document Retrieval Success","type": "Ambulatory Summary","typeCode": "34133-9","orgName": "ABCClinic","url": "/Binary?documentId=2.16.840.1.113883.3.2054.2.1.204666161&repositoryId=2.16.840.1.113883.3.2054.2.1&homeCommunityId=2.16.840.1.113883.3.2054.2.112", "contentType": "text/xml","encounterDate": "2020-01-12T00:00","data": null},{"id": "390","title": "Ambulatory Summary", "status": "Relevant Document Retrieval Success","type": "Ambulatory Summary","typeCode": "34133-9","orgName": "GHYClinic","url": "/Binary?documentId=2.16.840.1.113883.3.2054.2.1.204666161&repositoryId=2.16.840.1.113883.3.2054.2.1&homeCommunityId=2.16.840.1.113883.3.2054.2.112", "contentType": "text/xml","encounterDate": "2020-01-12T00:00","data": null}]}'

  beforeEach(waitForAsync(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [
        InternalPatientDocumentsComponent,
        MultiselectComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })
      ],
      providers: [
        AuthService,
        PatientDocumentService,
        DatePipe,
        SpinnerService,
        SearchService,
        NgbModal,
        {
          provide: ActivatedRoute, useValue: { queryParams: Observable.of({ statusCode: "200", httpStatusCode: "200" }) }

        },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    searchService = TestBed.get(SearchService);
    pSevice = TestBed.get(PatientDocumentService);
    httpClient = TestBed.get(HttpClient);
    modalService = TestBed.get(NgbModal);
    router = TestBed.inject(Router);
    spinnerService = TestBed.inject(SpinnerService);
    authService = TestBed.inject(AuthService);
    const patient = {
      "HBSID": "9308198",
      "firstName": firstName,
      "lastName": lastName,
      "gender": gender,
      "dob": dateOfBirth,
      "addressline1": addressline1,
      "city": city,
      "zipCode": zipcode,
      "state": state,
      "docSearchDate": docSearchDate

    }

    const resource = {
      "docRefs": JSON.parse(docList).docRefs,
      "prescriber": "John"
    };
    // spyOn(authService, 'getUser').and.returnValue({ userName: testUserName });
    spyOn(httpClient, 'post').and.returnValue(of({}));
    //   spyOn(searchService, 'getPatient').and.returnValue(patient);
    spyOn(searchService, 'getInternalResourceToPatient').and.returnValue(patient);
    spyOn(searchService, 'getInternalResource').and.returnValue(resource);
    spyOn(pSevice, 'getDocList').and.returnValue(JSON.parse(docList).docRefs);
    fixture = TestBed.createComponent(InternalPatientDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    //expect(component.patient).toBeTruthy()

  });

  it('should check all the fields are loaded to component', () => {
    const orgFilters = fixture.debugElement.query(By.css('.container3'));
    const typeFilters = fixture.debugElement.query(By.css('.container4'));
    const view = fixture.debugElement.query(By.css('.view'));
    const searchBar = fixture.debugElement.query(By.css('#searchBar'));

    expect(orgFilters).toBeTruthy();
    expect(typeFilters).toBeTruthy();
    expect(view).toBeTruthy();
    expect(searchBar).toBeTruthy();


  });

  it('shod show dob fname lname in header', () => {
    fixture.detectChanges();
    const pname = fixture.debugElement.nativeElement.querySelector('.patientName');
    expect(pname).toBeTruthy();
    expect(pname.innerHTML).toContain('Heist, peggy');

  });

  it('should send feedback when click on yes', () => {

    component.show = true;
    fixture.detectChanges();
    spyOn(component, 'feedbackAnswerYes');
    const optY = fixture.debugElement.nativeElement.querySelector('.optionYes');
    optY.click();
    expect(optY).toBeTruthy();
  });

  it('should open dialog when feeback option is NO', () => {
    component.show = true;
    fixture.detectChanges();
    spyOn(component, 'open');
    const optN = fixture.debugElement.nativeElement.querySelector('.optionNo');
    optN.click();
    component.showFeedbackComment = true;
    fixture.detectChanges();

    // spyOn(modalService, 'open').and.callFake(() => Promise.resolve({}));

    expect(optN).toBeTruthy();

  });

  it('should clear text in search bar ', () => {

    const searchInput = fixture.nativeElement.querySelector('#searchBar');
    searchInput.value = '12345'
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const clearAll = fixture.nativeElement.querySelector('.clearAll');
    expect(clearAll).toBeTruthy();
    clearAll.click();
    fixture.detectChanges();
    expect(searchInput.value).toBe('');

  });

  it('should update filter values', () => {
    expect(component.typeFilterValues.length).toBeGreaterThan(0);
    expect(component.organizationFilterValues.length).toBeGreaterThan(0);
  });
  it('should filter DocList and populate matched org name', () => {
    component.filterDocuments('');
    expect(component.filterDocuments.length).toBeGreaterThan(0);
    component.populateMatchedOrgname();
    expect(component.matchedOrgname).toBe('ABCClinic');
  });
  it('should get feedback value - Yes', () => {
    spyOn(searchService, 'captureFeedback').and.callFake(() => { return Observable.from(['{}']) });
    component.feedbackAnswerYes();
    expect(searchService.captureFeedback).toHaveBeenCalled();
  });
  it('should get feedback value - No with comments', () => {
    spyOn(searchService, 'captureFeedback').and.callFake(() => { return Observable.from(['{}']) });
    component.commentSectionForm.controls['comments'].setValue('Got some info');
    component.feedbackAnswerComment();
    expect(searchService.captureFeedback).toHaveBeenCalled();
  });
  it('should call search service with keyword ABCClinic', () => {
    component.filterDocuments('');
    expect(component.filterDocuments.length).toBeGreaterThan(0);
    component.populateMatchedOrgname();
    expect(component.matchedOrgname).toBe('ABCClinic');
  });

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

  describe('externalSearch method', () => {
    it('should navigate to advancedSearch', () => {
      spyOn(searchService, 'setSourcePage');
      fixture.detectChanges();
      component.externalSearch();
      expect(searchService.setSourcePage).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('advancedSearch method', () => {
    it('should navigate to advancedSearch', () => {
      spyOn(searchService, 'setSourcePage');
      fixture.detectChanges();
      component.advancedSearch();
      expect(searchService.setSourcePage).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
  describe('escapeHtml method', () => {
    it('should return escapse html', () => {
      const input = `"hello world"`;
      expect(component.escapeHtml(input)).toBeDefined();
    });

    it('should return escapse html', () => {
      const input = `hello world`;
      expect(component.escapeHtml(input)).toBeDefined();
    });
  });

  describe('EnterSubmit method', () => {
    it('should call sendSearchItem method if keyCode == 13', () => {
      spyOn(component, 'sendSearchItem');
      const event = {
        keyCode: 13
      };
      component.EnterSubmit(event);
      expect(component.sendSearchItem).toHaveBeenCalled();
    });

    it('should not call sendSearchItem method if keyCode != 13', () => {
      spyOn(component, 'sendSearchItem');
      const event = {
        keyCode: 14
      };
      component.EnterSubmit(event);
      expect(component.sendSearchItem).not.toHaveBeenCalled();
    });

  });

  describe('evaluateSearchInput method', () => {
    it('should return false if searchBar value is empty', () => {
      component.internalPatientDocumentForm.controls.searchBar.setValue('');
      fixture.detectChanges();
      component.evaluateSearchInput();
      expect(component.isInvalidSearch).toBeFalsy();
    });

    it('should call sendSearchItem if searchBar value is not empty and event keycode === 13', () => {
      component.internalPatientDocumentForm.controls.searchBar.setValue('hello');
      spyOn(component, 'sendSearchItem');
      fixture.detectChanges();
      component.evaluateSearchInput({ keyCode: 13 });
      expect(component.isInvalidSearch).toBeFalsy();
      expect(component.sendSearchItem).toHaveBeenCalled();
    });
  });
  describe('sendSearchItem method', () => {
    it('should call handleSearchResponse ', () => {
      spyOn(component, 'clearFilters');
      spyOn(component, 'resetErrorBanner');
      component.docList = JSON.parse(docList).docRefs;
      spyOn(searchService, 'searchInput').and.returnValue(of({}));
      spyOn(component, 'handleSearchResponse');
      fixture.detectChanges();
      component.sendSearchItem();
      expect(component.handleSearchResponse).toHaveBeenCalled();
    });
  });

  describe('handleSearchResponse method', () => {
    it('should return response', () => {
      component.docList = JSON.parse(docList).docRefs;
      const body = {
        response: {
          statusCode: '0000',
          resources: [
            {
              docIds: ['391', '392']
            }
          ]
        }
      }
      spyOn(spinnerService, 'hide');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(spinnerService.hide).toHaveBeenCalled();
    });

    it('should filteredDocuments and searchedDocuments empty when statusCode != 0000', () => {
      const body = {
        response: {
          statusCode: '0001',
          resources: {
            statusDesc: 'desc'
          }
        }
      }
      spyOn(component, 'checkOpenNoSearchResultsModal');
      spyOn(spinnerService, 'hide');
      fixture.detectChanges();
      component.handleSearchResponse(body);
      expect(component.filteredDocuments).toEqual([]);
      expect(component.searchedDocuments).toEqual([]);
    });
  });

  describe('handleError', () => {
    it('should handle error', () => {
      const response = {};
      const statusCode = 7003;
      spyOn(component, 'resetErrorBanner');
      spyOn(spinnerService, 'hide');
      component.handleError(response, statusCode);
      expect(component.resetErrorBanner).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });

    it('should handle error if response and statusCode is undifined', () => {
      const response = null;
      const statusCode = 111;
      spyOn(component, 'resetErrorBanner');
      spyOn(spinnerService, 'hide');
      component.handleError(response, statusCode);
      expect(component.resetErrorBanner).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });
  });

  describe('updateSearchResults method', () => {
    it('should call  clearAll when  searchBar value is empty', () => {
      component.internalPatientDocumentForm.controls.searchBar.setValue('');
      component.isSearchClicked = true;
      spyOn(component, 'clearAll');
      fixture.detectChanges();
      component.updateSearchResults();
      expect(component.clearAll).toHaveBeenCalled();
    });
  });

  describe('closeBanner method', () => {
    it('should return false', () => {
      fixture.detectChanges();
      component.closeBanner();
      expect(component.result.display).toBeFalsy();
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

  describe('clearFilters method', () => {
    it('should clear apply filter', () => {
      component.internalPatientDocumentForm.controls.searchBar.setValue('');
      component.docList = JSON.parse(docList).docRefs;
      fixture.detectChanges();
      component.clearFilters();
      expect(component.filterTypes).toEqual([]);
      expect(component.selectedFilters).toEqual([]);
      component.internalPatientDocumentForm.controls.searchBar.setValue('hello world');
      fixture.detectChanges();
      component.clearFilters();
    });
  });

  describe('isEligibleToShowSearch method', () => {
    it('should call getUserProfile method of authService', () => {
      spyOn(authService, 'getUserProfile').and.returnValue({ groups: ['specialty-expedite-pilot', 'specialty-expedite-pilots'] });
      fixture.detectChanges();
      expect(component.isEligibleToShowSearch()).toBeTruthy();
    });
  });

  describe('checkOpenNoSearchResultsModal method', () => {
    it('should call openNoSearchResults method when isSearchClicked is true', () => {
      component.isSearchClicked = true;
      component.internalPatientDocumentForm.controls.searchBar.setValue('hello world');
      component.searchedDocuments = [];
      fixture.detectChanges();
      component.checkOpenNoSearchResultsModal();
      expect(component.searchedDocuments).toEqual([]);
    });
  });

  describe('applyFilter method', () => {
    it('should apply filter', () => {
      let attr = ['Type', ['Type', 'hello']];
      component.initialTypeValues = ['testing', 'Type'];
      spyOn(component, 'checkOpenNoSearchResultsModal');
      fixture.detectChanges();
      component.applyFilter(attr);
      expect(component.checkOpenNoSearchResultsModal).toHaveBeenCalled();
      attr = ['Organization', ['Type', 'hello']];
      component.initialOrganizationValues = ['testing', 'Type'];
      component.isSearchClicked = true;
      fixture.detectChanges();
      component.applyFilter(attr);
    });
  });
});
