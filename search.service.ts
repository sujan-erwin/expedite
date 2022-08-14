import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { DatePipe } from '@angular/common';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  sourcePage: string;
  patient: any;
  user: any;
  resource: any;
  internalResource: any;
  sourcelookupPage: any;

  setShowfeedbackQuestion(show: boolean) {
    sessionStorage.setItem('showFeedbackQuestion', JSON.stringify(show));
  }

  getShowfeedbackQuestion() {
    let showFeedbackQuestion = sessionStorage.getItem('showFeedbackQuestion');
    return showFeedbackQuestion ? JSON.parse(showFeedbackQuestion) : undefined;
  }

  storeHbsId(hbsId) {
    if (hbsId) {
      sessionStorage.setItem('hbsId', JSON.stringify(hbsId));
    } else {
      sessionStorage.removeItem('hbsId');
    }
  }

  retrieveHbsId() {
    const hbsId = sessionStorage.getItem('hbsId');
    return hbsId ? JSON.parse(hbsId) : null;
  }
  storeDemographicsInfo(demo) {
    sessionStorage.setItem('demographicInfo', JSON.stringify(demo));
  }

  retrieveDemographicsInfo() {
    const demographicInfo = sessionStorage.getItem('demographicInfo');
    return demographicInfo ? JSON.parse(demographicInfo) : null;
  }
  storeLookupOption(option) {
    sessionStorage.setItem('lookUpOption', JSON.stringify(option));
  }
  retrieveLookupOption() {
    const lookUpOption = sessionStorage.getItem('lookUpOption');
    return lookUpOption ? JSON.parse(lookUpOption) : null;
  }

  setSourcePage(sourcePage: string) {
    this.sourcePage = sourcePage;
  }
  getSourcePage() {
    return this.sourcePage;
  }

  setPatient(patient) {
    sessionStorage.setItem('patientInfo', JSON.stringify(patient));
    this.patient = patient;
  }

  getPatient() {
    if (!this.patient) {
      let obj = sessionStorage.getItem('patientInfo');
      this.patient = obj ? JSON.parse(obj) : {};
    }
    return this.patient;
  }

  constructor(private httpClient: HttpClient, private datePipe: DatePipe, private spinnerService: SpinnerService, private authService: AuthService) { }

  searchPatient(searchDetails) {
    this.user = this.authService.getUser();
    var data = {
      "patient": {
        "address": {
          "addressLine1": searchDetails.addressLine1,
          "city": searchDetails.city,
          "state": searchDetails.state,
          "zipCode": searchDetails.Zipcode
        },
        "dateOfBirth": `${searchDetails.dob.YYYY}-${searchDetails.dob.MM}-${searchDetails.dob.DD}`, //searchDetails.dob
        "gender": searchDetails.gender,
        "id": searchDetails.HBSID,
        "name": {
          "firstName": searchDetails.frstName,
          "lastName": searchDetails.lstName,
        },
        "phNumber": searchDetails.Phone,
      },
      "requestedBy": this.user.userName
    }

    return this.httpClient.post(
      environment.config.serverEndPoint + environment.config.path.patientSearch,
      // 'https://httpbin.org/status/500'
      JSON.stringify(data));
  }

  /* InternalPatientSearch service call */
  searchInternalPatient(searchDetails) {
    console.log("Service call started");
    this.spinnerService.show();
    this.user = this.authService.getUser();
    var data = {
      "hbsId": searchDetails.HBSID,
      // "requestedBy": this.user.userName,
      "requestedBy": "9308198",
      "searchBy": "HBS_ID"
    }
    return this.httpClient.post(
      this.getInternalServerEndPoint() + environment.config.path.internalPatientSearch,
      JSON.stringify(data));
  }

  getInternalServerEndPoint() {
    let serverEndPoint = environment.config.serverEndPoint;
    console.log("env:", environment.env);
    if (environment.env === 'prod') {
      serverEndPoint = environment.config.serverEndPointWest;
    }
    return serverEndPoint;
  }

  searchPatientByDemo(searchDetails) {
    this.spinnerService.show();
    this.user = this.authService.getUser();
    const states: Array<any> = this.getStateList();
    const stateValue = states.find(state => state.name === searchDetails.state);
    var data = {
      "patient": {
        "address": {
          "addressLine1": searchDetails.addressline1,
          "addressLine2": searchDetails.addressline2, // should it send in a request - confirm with services
          "city": searchDetails.city,
          "state": stateValue.abbreviation,
          "zipCode": searchDetails.zipCode
        },
        "dateOfBirth": this.datePipe.transform(new Date(searchDetails.dob), 'yyyy-MM-dd'),
        "gender": searchDetails.gender,
        "id": "1234",
        "name": {
          "firstName": searchDetails.firstName,
          "lastName": searchDetails.lastName,
        },
        "prescriber": {
          "npi": searchDetails.NPI
        },
        "phNumber": searchDetails.phone,
      },
      "requestedBy": '1234'

    }
    return this.httpClient.post(
      this.getInternalServerEndPoint() + environment.config.path.lookupPatientByDemo,
      JSON.stringify(data));
  }

  searchInput(term, docIds: any[], hbsId) {
    this.spinnerService.show();
    this.user = this.authService.getUser();
    var data = {
      "search": {
        "term": term,
        "docIds": docIds
      },
      "hbsId": hbsId,
      "requestedBy": this.user.userName
    }
    return this.httpClient.post(
      this.getInternalServerEndPoint() + environment.config.path.docSearch,
      JSON.stringify(data));
  }

  /* New ExternalPatientSearch service call */
  advancedPatientSearch(searchDetails) {
    this.spinnerService.show();
    this.user = this.authService.getUser();
    var data = {
      "patient": {
        "address": {
          "addressLine1": searchDetails.addressline1,
          "addressLine2": searchDetails.addressline2,
          "city": searchDetails.city,
          "state": searchDetails.state,
          "zipCode": searchDetails.zipCode
        },
        "dateOfBirth": this.datePipe.transform(new Date(searchDetails.dob), 'yyyy-MM-dd'),
        "gender": searchDetails.gender,
        "id": searchDetails.HBSID,
        "name": {
          "firstName": searchDetails.firstName,
          "lastName": searchDetails.lastName,
          "middleName": searchDetails.middleName,
          "suffix": searchDetails.suffix,

        },
        "phNumber": searchDetails.phone,
        "prescriber": {
          "npi": searchDetails.npi
        }
      },
      "requestedBy": this.user.userName
    }
    return this.httpClient.post(
      environment.config.serverEndPoint + environment.config.path.advancedPatientSearch,
      JSON.stringify(data));
  }

  captureFeedback(hbsId, option, comment) {
    {
      this.user = this.authService.getUser();
      var feedbacks = [];
      var data = { "hbsId": hbsId, "feedbacks": feedbacks, "requestedBy": this.user.userName };
      data.hbsId = hbsId;

      feedbacks.push({ "questionSequence": 1, "questionText": "Did you find all the information you needed to complete the task?", "answerText": option });
      if (option === "No") {
        this.spinnerService.show();
        feedbacks.push({ "questionSequence": 2, "questionText": "What information could you not find?", "answerText": comment.comments });
      }
      return this.httpClient.post(
        this.getInternalServerEndPoint() + environment.config.path.userfeedback,
        JSON.stringify(data));
    }
  }

  setResource(resource) {
    sessionStorage.setItem('resourceInfo', JSON.stringify(resource));
    this.resource = resource;
  }
  getResource() {
    if (!this.resource) {
      let obj = sessionStorage.getItem('resourceInfo');
      this.resource = obj ? JSON.parse(obj) : {};
    }
    return this.resource;
  }

  setInternalResource(resource) {
    if (resource) {
      sessionStorage.setItem('internalResourceInfo', JSON.stringify(resource));
    } else {
      sessionStorage.removeItem('internalResourceInfo');
    }
    this.internalResource = resource;
  }

  getInternalResource() {
    if (!this.internalResource) {
      let obj = sessionStorage.getItem('internalResourceInfo');
      this.internalResource = obj ? JSON.parse(obj) : {};
    }
    return this.internalResource;
  }

  getResourceToPatient() {
    this.getResource();
    return this.generateResourceToPatient(this.resource);
  }

  getInternalResourceToPatient() {
    this.getInternalResource();
    return this.generateResourceToPatient(this.internalResource);
  }

  generateResourceToPatient(resource) {
    let patient;
    if (resource) {
      patient = {
        firstName: resource.name ? resource.name.firstName : "",
        lastName: resource.name ? resource.name.lastName : "",
        middleName: resource.name ? resource.name.middleName : "",
        suffix: resource.name ? resource.name.suffix : "",
        HBSID: resource.id,
        dob: resource.dateOfBirth,
        gender: resource.gender,
        addressline1: resource.address ? resource.address.addressLine1 : "",
        addressline2: resource.address ? resource.address.addressLine2 : "",
        city: resource.address ? resource.address.city : "",
        state: resource.address ? resource.address.state : "",
        zipCode: resource.address ? resource.address.zipCode : "",
        phone: resource.phNumber,
        docSearchDate: resource.docSearchDate,
      };
    }

    return patient;
  }

  setSourceLookupPage(sourcelookupPage) {
    this.sourcelookupPage = sourcelookupPage;
  }

  getSourceLookupPage() {
    return this.sourcelookupPage;
  }

  // List of states
  public getStateList() {
    var stateList: any = [
      {
        "name": "Alabama",
        "abbreviation": "AL"
      },
      {
        "name": "Alaska",
        "abbreviation": "AK"
      },
      {
        "name": "American Samoa",
        "abbreviation": "AS"
      },
      {
        "name": "Arizona",
        "abbreviation": "AZ"
      },
      {
        "name": "Arkansas",
        "abbreviation": "AR"
      },
      {
        "name": "California",
        "abbreviation": "CA"
      },
      {
        "name": "Colorado",
        "abbreviation": "CO"
      },
      {
        "name": "Connecticut",
        "abbreviation": "CT"
      },
      {
        "name": "Delaware",
        "abbreviation": "DE"
      },
      {
        "name": "District Of Columbia",
        "abbreviation": "DC"
      },
      {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
      },
      {
        "name": "Florida",
        "abbreviation": "FL"
      },
      {
        "name": "Georgia",
        "abbreviation": "GA"
      },
      {
        "name": "Guam",
        "abbreviation": "GU"
      },
      {
        "name": "Hawaii",
        "abbreviation": "HI"
      },
      {
        "name": "Idaho",
        "abbreviation": "ID"
      },
      {
        "name": "Illinois",
        "abbreviation": "IL"
      },
      {
        "name": "Indiana",
        "abbreviation": "IN"
      },
      {
        "name": "Iowa",
        "abbreviation": "IA"
      },
      {
        "name": "Kansas",
        "abbreviation": "KS"
      },
      {
        "name": "Kentucky",
        "abbreviation": "KY"
      },
      {
        "name": "Louisiana",
        "abbreviation": "LA"
      },
      {
        "name": "Maine",
        "abbreviation": "ME"
      },
      {
        "name": "Marshall Islands",
        "abbreviation": "MH"
      },
      {
        "name": "Maryland",
        "abbreviation": "MD"
      },
      {
        "name": "Massachusetts",
        "abbreviation": "MA"
      },
      {
        "name": "Michigan",
        "abbreviation": "MI"
      },
      {
        "name": "Minnesota",
        "abbreviation": "MN"
      },
      {
        "name": "Mississippi",
        "abbreviation": "MS"
      },
      {
        "name": "Missouri",
        "abbreviation": "MO"
      },
      {
        "name": "Montana",
        "abbreviation": "MT"
      },
      {
        "name": "Nebraska",
        "abbreviation": "NE"
      },
      {
        "name": "Nevada",
        "abbreviation": "NV"
      },
      {
        "name": "New Hampshire",
        "abbreviation": "NH"
      },
      {
        "name": "New Jersey",
        "abbreviation": "NJ"
      },
      {
        "name": "New Mexico",
        "abbreviation": "NM"
      },
      {
        "name": "New York",
        "abbreviation": "NY"
      },
      {
        "name": "North Carolina",
        "abbreviation": "NC"
      },
      {
        "name": "North Dakota",
        "abbreviation": "ND"
      },
      {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
      },
      {
        "name": "Ohio",
        "abbreviation": "OH"
      },
      {
        "name": "Oklahoma",
        "abbreviation": "OK"
      },
      {
        "name": "Oregon",
        "abbreviation": "OR"
      },
      {
        "name": "Palau",
        "abbreviation": "PW"
      },
      {
        "name": "Pennsylvania",
        "abbreviation": "PA"
      },
      {
        "name": "Puerto Rico",
        "abbreviation": "PR"
      },
      {
        "name": "Rhode Island",
        "abbreviation": "RI"
      },
      {
        "name": "South Carolina",
        "abbreviation": "SC"
      },
      {
        "name": "South Dakota",
        "abbreviation": "SD"
      },
      {
        "name": "Tennessee",
        "abbreviation": "TN"
      },
      {
        "name": "Texas",
        "abbreviation": "TX"
      },
      {
        "name": "Utah",
        "abbreviation": "UT"
      },
      {
        "name": "Vermont",
        "abbreviation": "VT"
      },
      {
        "name": "Virgin Islands",
        "abbreviation": "VI"
      },
      {
        "name": "Virginia",
        "abbreviation": "VA"
      },
      {
        "name": "Washington",
        "abbreviation": "WA"
      },
      {
        "name": "West Virginia",
        "abbreviation": "WV"
      },
      {
        "name": "Wisconsin",
        "abbreviation": "WI"
      },
      {
        "name": "Wyoming",
        "abbreviation": "WY"
      }
    ]

    return stateList;
  }
}
