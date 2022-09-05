import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { allPaths } from '../app-routes';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { PatientDocumentService } from '../services/patientDocument.service';
import { errorBanners } from '../error-messages';
import { DateValidator } from '../DateValidator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../spinner/spinner.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'lookup-patient',
  templateUrl: './lookup-patient.component.html',
  styleUrls: ['./lookup-patient.component.scss']
})
export class LookupPatientComponent implements OnInit {

  @ViewChild('firstName') firstNameElement: ElementRef;
  @ViewChild('hbs') HBSIDElement: ElementRef;
  @ViewChild('noPatientFoundWithDemo', { read: TemplateRef }) noPatientFoundWithDemo: TemplateRef<any>;
  @ViewChild('multiplePatientProfiles', { read: TemplateRef }) multiplePatientProfiles: TemplateRef<any>;


  patientLookupForm: FormGroup;
  result: any;
  selectedLink: any;
  isSubmitted: boolean;
  stateList: JSON;
  modalRef: any;
  isPatientNotFound: boolean = false;
  demographicLookupFields: any = ['firstName', 'lastName', 'dob', 'zipCode', 'gender', 'addressline1', 'city', 'state'];
  multiplePatientProfileList: Array<any> = [];
  selectedMultiplePatientProfileId: String = '';

  constructor(fb: FormBuilder, private router: Router, private authService: AuthService, private searchService: SearchService,
    private spinnerService: SpinnerService, private patientDocService: PatientDocumentService, private modalService: NgbModal, private titleService: Title) {
    this.result = {};
    this.result.display = false;
    this.stateList = this.searchService.getStateList();
    window.onunload = function () {
      sessionStorage.removeItem('hbsId');
      sessionStorage.setItem('lookUpOption', JSON.stringify('HBS'));
    }
    this.patientLookupForm = fb.group({
      patientLookUpOption: ['HBS', [Validators.required]],
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
      NPI: [''],
    });
    // this.setPatientLookUpOptionsValidators();
    this.applyDemographicValidators();
    this.titleService.setTitle("Dataviewer - Lookup Patient");
    const HBSID_VAL = this.searchService.retrieveHbsId();
    const Demo_VAL = this.searchService.retrieveDemographicsInfo();
    const lookUpOption_VAL = this.searchService.retrieveLookupOption();
    if (HBSID_VAL) {
      this.HBSID.setValue(HBSID_VAL);
    }
    if (Demo_VAL) {
      this.patientLookupForm.setValue(Demo_VAL);
      if (Demo_VAL.addressline1 && Demo_VAL.city && Demo_VAL.state) {
        this.isPatientNotFound = true;
      }
    }
    if (lookUpOption_VAL) {

      this.patientLookUpOption.setValue(lookUpOption_VAL, { emitEvent: false });
    }
    if (this.patientLookUpOption.value === 'HBS') {
      this.patientLookupForm.controls['HBSID'].setValidators([Validators.required]);
    }
  }

  ngOnInit() {
  }
  radioChecked(value) {
    console.log(value)
  }

  setValidatorForDemographicFields(validators: any): void {
    var lookupFields = ['firstName', 'lastName', 'dob', 'zipCode', 'gender', 'addressline1', 'city', 'state'];
    if (validators === null) {
      for (var val of lookupFields) {
        this.patientLookupForm.controls[val].clearValidators();
        this.patientLookupForm.controls[val].updateValueAndValidity();
      }
    } else {
      this.applyDemographicValidators();
    }
  }

  applyAddressFieldsValidators() {
    var lookupFields = ['addressline1', 'city', 'state'];
    for (var val of lookupFields) {
      this.patientLookupForm.controls[val].setValidators(Validators.required);
      this.patientLookupForm.controls[val].reset();
    }

  }

  applyDemographicValidators() {
    var lookupFields = ['firstName', 'lastName', 'dob', 'gender', 'zipCode'];
    for (var val of lookupFields) {
      if (val === 'dob') {
        this.patientLookupForm.controls[val].setValidators([Validators.required, DateValidator]);
      } else if (val === 'zipCode') {
        this.patientLookupForm.controls[val].setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
      } else {
        this.patientLookupForm.controls[val].setValidators(Validators.required);
      }
    }
  }

  // setPatientLookUpOptionsValidators() {
  //   const hbsID = this.patientLookupForm.get('HBSID');
  //   this.patientLookupForm.get('patientLookUpOption').valueChanges
  //     .subscribe(patientLookUpOptionVal => {
  //       this.isSubmitted = false;
  //       this.clearSearch();

  //       if (patientLookUpOptionVal === 'HBS') {
  //         this.patientLookupForm.controls['HBSID'].setValidators([Validators.required]);

  //         this.setValidatorForDemographicFields(null);
  //       } else {
  //         hbsID.clearValidators();
  //         hbsID.updateValueAndValidity();
  //         this.setValidatorForDemographicFields(Validators.required);
  //       }

  //     });
  // }

  resetOptionValue() {
    const hbsID = this.patientLookupForm.get('HBSID');
    this.isSubmitted = false;
    this.clearSearch();
    this.searchService.storeLookupOption(this.patientLookUpOption.value);
    this.isPatientNotFound = false;

    if (this.patientLookUpOption.value === 'HBS') {
      this.patientLookupForm.controls['HBSID'].setValidators([Validators.required]);

      this.setValidatorForDemographicFields(null);
    } else {
      hbsID.clearValidators();
      hbsID.updateValueAndValidity();
      this.setValidatorForDemographicFields(Validators.required);
    }

  }

  startSearch() {
    this.router.navigate([allPaths.advancedSearch.link]);
  }

  onSubmit() {
    this.searchService.setShowfeedbackQuestion(true);
    this.isSubmitted = true;
    this.resetErrorBanner();
    console.info(this.patientLookUpOption.value);
    if (this.patientLookUpOption.value === 'HBS') {
      if (!this.patientLookupForm.controls.HBSID.value) {
        this.patientLookupForm.controls['HBSID'].setErrors({ 'required': true });
        return;
      }
      console.info(this.patientLookupForm.value);
      this.searchService.setPatient(this.patientLookupForm.value);
      this.searchService.storeHbsId(this.patientLookupForm.value.HBSID);
      this.searchService.searchInternalPatient(this.patientLookupForm.value).subscribe(data => { this.handleSearchResponse(data) }, (error) => {
        if (error.response) {
          this.handleError(error.response, error.response.statusCode, error.status);
          console.log("errorResponse", error.response);
        }
        else {
          this.handleError(null, null, null);
        }
      });
    }
    else if (this.patientLookupForm.valid && this.patientLookUpOption.value === 'demographic') {
      if (!this.result.displayDemographicError && !this.isPatientNotFound) {
        this.searchService.setPatient(this.patientLookupForm.value);
        this.searchService.storeDemographicsInfo(this.patientLookupForm.value);
        this.searchService.searchPatientByDemo(this.patientLookupForm.value).subscribe(data => { this.handleSearchResponse(data) }, (error) => {
          console.log("PatientInfoValuewithDemo", this.patientLookupForm.value);
          if (error.response) {
            this.handleError(error.response, error.response.statusCode, error.status);
          }
          else {
            this.handleError(null, null, null);
          }
        });
      } else {
        this.searchService.setPatient(this.patientLookupForm.value);
        this.searchService.storeDemographicsInfo(this.patientLookupForm.value);
        this.searchService.searchPatientByAddressDemo(this.patientLookupForm.value).subscribe(data => { this.handleSearchResponse(data) }, (error) => {
          console.log("PatientInfoValuewithDemo", this.patientLookupForm.value);
          if (error.response) {
            this.handleError(error.response, error.response.statusCode, error.status);
          }
          else {
            this.handleError(null, null, null);
          }
        });
      }

    }
  }

  handleSearchResponse(body) {
    this.isPatientNotFound = false;
    if (body && body.response) {
      if (body.response.statusCode === '0000') {
        console.log("response", body.response);
        const resource = body.response.resources[0];
        this.searchService.setInternalResource(resource);
        this.spinnerService.hide();
        if (body.response.resources && body.response.resources.length > 0) {
          let list = body.response.resources[0].docRefs;
          list = list.filter(doc => doc.contentType == "text/xml");
          this.patientDocService.setDocList(list);
          this.patientDocService.setPrescriber(body.response.resources[0].prescriber);
          this.router.navigate([allPaths.internalPatientDocuments.link]);
        } else {
          this.result.display = true;
          this.result.banner = errorBanners.lookupPatient[7004];
        }
      } else if (body.response.statusCode === '7003') {
        this.searchService.setShowfeedbackQuestion(false);
        const resource = body.response.resources[0];
        this.searchService.setInternalResource(resource);
        this.spinnerService.hide();
        this.searchService.setSourceLookupPage('Patient lookup');
        localStorage.setItem('patientLookup', 'Patient lookup');
        localStorage.removeItem("quickLookup");
        this.router.navigate([allPaths.internalPatientDocuments.link]);
      }
      else {
        this.handleError(body.response, body.response.statusCode, null);
      }
    }
    else {
      let body = {
        statusCode: "Unknown",
        statusDesc: "Unknown error occured while calling backend service."
      }
      this.handleError(body, body.statusCode, null);
    }
  }

  handleError(response, statusCode, httpStatusCode) {
    this.resetErrorBanner();
    this.spinnerService.hide();
    this.result.display = true;
    if (response) {
      console.log("Error response", response);
      this.result.banner = errorBanners.lookupPatient[response.statusCode];
    } else {
      this.result.banner = errorBanners.lookupPatient[1111];
    }
    if (!this.result.banner) {
      let code = statusCode ? statusCode : 'default';
      this.result.banner = errorBanners.lookupPatient[code];
    }
    if (statusCode) {
      if (this.result.banner && this.result.banner.displayResponseStatus) {
        this.result.banner.info = '';
        if (httpStatusCode) {
          this.result.banner.info = httpStatusCode + ' - ';
        }
        this.result.banner.info += `${statusCode} - ${response?.statusDesc}`;
      }
      else {
        this.handleDisplayError(statusCode, response);
      }
    }
  }

  handleDisplayError(statusCode, response) {
    if (this.patientLookupForm.get("patientLookUpOption").value === 'demographic') {
      this.result.displayDemosError = true;
      // this.result.displayDemographicError = false;
      if (statusCode === '7027') {
        this.result.display = false;
        console.log('the response is ..............', response);
        if(response && response.resources && response.resources.length > 0){
           this.multiplePatientProfileList = response.resources;
           this.selectedMultiplePatientProfileId = this.multiplePatientProfileList[0].id;
        }
        this.modalRef = this.modalService.open(this.multiplePatientProfiles, { centered: true, size: 'lg' }).result.then((result) => {
        }, (reason) => {
          this.close();
        });
      }
      else if (statusCode !== '7027' || statusCode === '7028') {
        this.result.display = false;
        this.modalRef = this.modalService.open(this.noPatientFoundWithDemo, { centered: true, size: 'lg' }).result.then((result) => {
        }, (reason) => {
          this.close();
        });
      } else if (statusCode == '7000') {
        this.result.displayDemographicError = true;
        this.result.displayDemosError = false;
        this.isSubmitted = false;
        this.isPatientNotFound = true;
        this.applyAddressFieldsValidators();
      }
    }
    else if (this.patientLookupForm.get("patientLookUpOption").value === 'HBS') {
      this.result.displayHBSIDError = true;
    }
  }

  // close the modal when user clicks cross button in the modal
  close() {
    this.modalService.dismissAll();
  }

  advancedSearch() {
    this.searchService.setSourcePage('lookupPatientPage');
    this.router.navigate([allPaths.advancedSearch.link]);
    this.close();
  }

  viewPatientProfile(){
    this.searchService.setShowfeedbackQuestion(false);
    const resource = this.multiplePatientProfileList.find(profile => profile.id === this.selectedMultiplePatientProfileId);
    this.searchService.setInternalResource(resource);
    this.searchService.setSourceLookupPage('Patient lookup');
    localStorage.setItem('patientLookup', 'Patient lookup');
    localStorage.removeItem("quickLookup");
    this.router.navigate([allPaths.internalPatientDocuments.link]);
    this.close();
  }

  closeBanner() {
    this.result.display = false;
  }

  resetErrorBanner() {
    this.result.display = false;
    this.result.displayHBSIDError = false;
    this.result.displayDemosError = false;
    this.result.displayDemographicError = false;
  }

  setradio(id, value) {
    this.resetErrorBanner();
    this.patientLookupForm.reset();
    document.getElementById(id).focus();
    this.patientLookupForm.get("patientLookUpOption").setValue(value);
    this.close();
  }

  clearSearch() {
    this.isSubmitted = false;
    this.resetErrorBanner();
    this.resetFormFieldsExceptLookUpOption();
    this.searchService.storeHbsId(null);
    this.searchService.storeDemographicsInfo(null);
    this.searchService.setPatient(null);
    this.searchService.setResource(null);
    // this.patientLookupForm.setErrors(null);
  }

  advStartSearch() {
    this.searchService.setInternalResource(null);
    this.searchService.setSourcePage('internalSearch');
    this.router.navigate([allPaths.advancedSearch.link]);
  }

  resetFormFieldsExceptLookUpOption() {
    Object.keys(this.patientLookupForm.controls).forEach(field => {
      if (field === 'patientLookUpOption') {
        return;
      }
      const control = this.patientLookupForm.get(field);
      if (control instanceof FormControl) {
        control.reset();
      }
    }
    );
  }

  restrictValue(control, type) {
    var newVal = control.value;
    if (type == 'numeric') {
      newVal = newVal.replace(/[^0-9]/g, '');
    } else {
      newVal = newVal.replace(/[^a-z0-9]/gi, '');
    }
    control.setValue(newVal);
  }

  maskDate(event) {
    if (event.inputType !== 'deleteContentBackward') {
      // remove all mask characters (keep only numeric)
      var newVal = event.target.value.replace(/[^0-9/]/g, '');
      // don't show braces for empty value
      if (newVal.length == 0) {
        newVal = '';
      } else {
        let dList = newVal.split("/");
        let count = (dList || []).length;
        //if the input already contains two / then format it.
        if (count >= 3) {
          newVal = this.formatDate(newVal);
        } else {
          if (newVal.length == 2) { //only with two chars decides whether to append zero or not.
            if (newVal.indexOf('/') == 1) {
              newVal = '0' + newVal;
            } else if (newVal.indexOf('/') < 0) { //if both chars are digits then append with / at end
              newVal = newVal.replace(/^(\d{0,2})/, '$1/');
            }
          } else if (newVal.length == 3) { //if user edit after entering 3 chars, we need append / accordingly.
            if (newVal.indexOf('/') != 2) {
              newVal = newVal.replace(/[^0-9]/g, ''); //clear all / and format it as below.
              newVal = newVal.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
            }
          }
          else if (newVal.length == 5) { //when 5 chars, decide whether append dd with zero or not.
            if (newVal.substring(3, 5).indexOf('/') == 1) {
              newVal = newVal.substring(0, 3) + '0' + newVal.substring(3, 5);
            } else if (newVal.substring(3, 5).indexOf('/') < 0) { //if dd slash is not entered, then add it at end.
              newVal = newVal.replace(/[^0-9]/g, '');
              newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1/$2/');
            }
          } else if (newVal.length >= 6) { //if length is more than 6 chars eligible for MM/DD/YYYY or it could be pasted content.
            newVal = this.formatDate(newVal);
          }
        }

      }
      // set the new value
      this.dob.setValue(newVal);
    }
  }

  formatDate(date) {
    let dList = date.split("/");
    let count = (dList || []).length;
    if (count >= 3 && (dList[0].length == 1 || dList[1].length == 1)) {
      if (dList[0].length == 1) {
        dList[0] = "0" + dList[0];
      }
      if (dList[1].length == 1) {
        dList[1] = "0" + dList[1];
      }
      date = dList[0] + "/" + dList[1] + "/" + dList[2];
    }
    return date;
  }

  fnNumbers(event) {
    if (event.charCode != 43 && event.charCode > 31 && (event.charCode < 48 || event.charCode > 57)) {
      return false;
    }
  }

  getAddress(event) {
    if (!event.place) {
      let address = event.address ? event.address : '';
      this.patientLookupForm.controls['addressline1'].setValue(address);
      return;
    }
    let postalField: HTMLInputElement = document.querySelector("#zipCode") as HTMLInputElement;
    let cityField: HTMLInputElement = document.querySelector("#city") as HTMLInputElement;
    let stateField = '';
    let options = {
      types: ['address'],
      componentRestrictions: {
        'country': ['us']
      },
      fields: ["address_components", "geometry"]
    }
    let address1 = "";
    for (const component of event.place.address_components as google.maps.GeocoderAddressComponent[]) {
      const componentType = component.types[0];
      switch (componentType) {
        case "street_number":
          address1 = `${component.long_name} ${address1}`;
          break;
        case "route":
          address1 += component.long_name;
          break;
        case "postal_code":
          postalField.value = component.long_name;
          break;
        case "locality":
          cityField.value = component.long_name;
          break;
        case "administrative_area_level_3":
          if (!cityField.value)
            cityField.value = component.long_name;
          break;
        case "sublocality_level_1":
          if (!cityField.value)
            cityField.value = component.long_name;
          break;
        case "administrative_area_level_1":
          stateField = component.short_name;
          break;
      }
    }
    const states: Array<any> = this.searchService.getStateList();
    const stateValue = states.find(state => state.abbreviation === stateField);
    this.patientLookupForm.controls['addressline1'].setValue(address1);
    this.patientLookupForm.controls['city'].setValue(cityField.value);
    this.patientLookupForm.controls['state'].setValue(stateValue.name);
    this.patientLookupForm.controls['zipCode'].setValue(postalField.value);
  }


  get firstName() { return this.patientLookupForm.get('firstName'); }
  get lastName() { return this.patientLookupForm.get('lastName'); }
  get HBSID() { return this.patientLookupForm.get('HBSID'); }
  get patientLookUpOption() { return this.patientLookupForm.get('patientLookUpOption'); }
  get dob() { return this.patientLookupForm.get('dob'); }
  get zipCode() { return this.patientLookupForm.get('zipCode'); }
  get gender() { return this.patientLookupForm.get('gender'); }
  get addressline1() { return this.patientLookupForm.get('addressline1'); }
  get addressline2() { return this.patientLookupForm.get('addressline2'); }
  get city() { return this.patientLookupForm.get('city'); }
  get state() { return this.patientLookupForm.get('state'); }
  get phone() { return this.patientLookupForm.get('phone'); }
  get NPI() { return this.patientLookupForm.get('NPI'); }

  ngOnDestroy() {
    if (this.modalService.hasOpenModals()) {
      this.close();
    }

  }

  onItemChange(value){
    console.log(" Value is : ", value );
    this.selectedMultiplePatientProfileId = value;
  }

}
