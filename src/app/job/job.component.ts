import { Component, AfterViewInit, ViewChild, NgZone, OnInit, ElementRef } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http'
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { GapiService } from './../service/gapi.service'
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms';
import { element } from '@angular/core/src/render3';
@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements AfterViewInit, OnInit {
  skillArray: string[] = [];
  resultsLength = 0;
  checked = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource = []
  googleAuth
  skillControl: FormControl = new FormControl();
  skillOptions = [];
  skillsList = []
  skills = '';
  removable = true;
  selectedField = {}
  locationControl: FormControl = new FormControl();
  locationList = [];
  filteredlocation = [];
  location = '';
  selected = ''
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  expControl: FormControl = new FormControl();
  filteredexp = [];
  experienceList = [];
  exp = '';
  public _opened = true;
  public mode = 'push';
  public position = 'left';
  public showBackdrop = false;
  imageUrl = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private gapiService: GapiService, private router: Router, public ngZone: NgZone) {
    this.http.get<any>(` https://nut-case.s3.amazonaws.com/jobs.json`).subscribe(res => {
      console.log(res)
    })
  }
  unique = (value, index, self) => {
    return self.indexOf(value) === index
  }
  private _filterStates(key: string, value: string) {
    if (key == 'skill')
      return this.skillOptions.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    if (key == 'location')
      return this.locationList.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    if (key == 'exp')
      return this.experienceList.filter(option => option.toLowerCase().includes(value.toLowerCase()));

  }
  selectOption(field, value) {
    this.selectedField[field] = value
    this.loadData(this.selectedField)
  }
  remove(skill: string): void {
    const index = this.skillArray.indexOf(skill);

    if (index >= 0) {
      this.skillArray.splice(index, 1);
    }
  }

  selectedAuto(event: MatAutocompleteSelectedEvent): void {
    this.skillArray.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillControl.setValue(null);
    this.loadData(this.selectedField)
  }
  ngOnInit() {

    this.skillControl.valueChanges.subscribe(newValue => {
      console.log(newValue)
      if (newValue)
        this.skillsList = newValue.length ? this._filterStates('skill', newValue) : this.skillOptions.slice();
    })
    this.locationControl.valueChanges.subscribe(newValue => {
      this.filteredlocation = newValue.length ? this._filterStates('location', newValue) : this.locationList.slice();
    })
    this.expControl.valueChanges.subscribe(newValue => {
      this.filteredexp = newValue.length ? this._filterStates('exp', newValue) : this.experienceList.slice();
    })
  }
  setValue(){
    this.checked=!this.checked
    this.loadData(this.selectedField)
  }
  clearField(field) {
    delete this.selectedField[field];
    if (field == 'skill')
      this.skillControl.setValue('')
    if (field == 'location')
      this.locationControl.setValue('');
    if (field == 'exp')
      this.expControl.setValue('');
    this.loadData(this.selectedField)
  }
  ngAfterViewInit() {
    this.gapiService.loadClient().then((res) => {
      // console.log(res);
      this.gapiService.initClient().then(res => {
        this.googleAuth = res.googleAuth;
        this.imageUrl = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl()

      })
    })
    this.loadData({})

  }
  somethingChanged(val) {
    this.loadData(this.selectedField)
  }
  expSortAsc(a, b) {
    if (a.minExperience == b.minExperience) {
      return (a.maxExperience < b.maxExperience) ? -1 : (a.maxExperience > b.maxExperience) ? 1 : 0;
    } else {
      return (a.minExperience < b.minExperience) ? -1 : 1;
    }
  }
  expSortDesc(a, b) {
    if (a.minExperience == b.minExperience) {
      return (a.maxExperience < b.maxExperience) ? 1 : (a.maxExperience > b.maxExperience) ? -1 : 0;
    } else {
      return (a.minExperience < b.minExperience) ? 1 : -1;
    }
  }

  loadData(search) {
    this.paginator.pageIndex = 0
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.http.get<any>(` https://nut-case.s3.amazonaws.com/jobs.json`);
        }),
        map(data => {
          let unfilteredData = data.data.map(ele => {
            let date1 = new Date(ele.timestamp*1000);
            let date2 = new Date(ele.enddate);
            let diffTime = Math.abs(date2.getTime() - date1.getTime());
            ele.ExpiringIn = isNaN(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))?Infinity:Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let exp = ele.experience.length ? ele.experience.replace(/yrs/gmi, '').toLowerCase() : ele.experience
            ele.minExperience = exp.includes('-') ? parseInt(exp.split('-')[0]) : exp.includes('to') ? parseInt(exp.split('to')[0]) : 0
            ele.maxExperience = exp.includes('-') ? parseInt(exp.split('-')[1]) : exp.includes('to') ? parseInt(exp.split('to')[1]) : 0
            return ele
          })
          if(this.checked){
            unfilteredData.sort((a,b)=>a.ExpiringIn-b.ExpiringIn)
          }
          if (this.selected == 'expAsc') {
            unfilteredData.sort(this.expSortAsc)
          }
          if (this.selected == 'expDesc') {
            unfilteredData.sort(this.expSortDesc)
          }
          if (this.selected == 'LocAsc') {
            unfilteredData.sort((a, b) => (a.location.toLowerCase() > b.location.toLowerCase()) ? 1 : ((b.location.toLowerCase() > a.location.toLowerCase()) ? -1 : 0))
          }
          if (this.selected == 'LocDesc') {
            unfilteredData.sort((a, b) => (a.location.toLowerCase() > b.location.toLowerCase()) ? -1 : ((b.location.toLowerCase() > a.location.toLowerCase()) ? 1 : 0))
          }
          this.skillOptions = data.data.map(skills => skills.skills).join(',').split(',').filter(this.unique)
          this.locationList = data.data.map(loc => loc.location).filter(this.unique)
          this.experienceList = data.data.map(loc => loc.experience.trim()).filter(this.unique).sort((a, b) => a - b)
          console.log(unfilteredData)
          this.isLoadingResults = false;
          this.isRateLimitReached = false;

          if (this.skillArray.length) {
            unfilteredData = unfilteredData.filter(value => {
              let filterEle = false
              this.skillArray.forEach(element => {
                if (value.skills.includes(element))
                  filterEle = true
              })
              return filterEle
            })
          }
          if (search['location']) {
            unfilteredData = unfilteredData.filter(value => value.location.includes(search['location']))
          }
          if (search['exp']) {
            unfilteredData = unfilteredData.filter(value => value.experience.includes(search['exp']))
          }
          this.resultsLength = unfilteredData.length;
          return unfilteredData.slice(this.paginator.pageIndex * 20, (this.paginator.pageIndex + 1) * 20);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataSource = data;
        console.log(this.dataSource)
      });
  }
  signOut() {
    console.log('sign out')
    gapi.auth2.getAuthInstance().signOut().then(_ => {
      this.ngZone.run(() => this.router.navigateByUrl('/home'))
    });
  }

}
