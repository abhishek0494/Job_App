import { Component, AfterViewInit,OnInit,NgZone } from '@angular/core';
import {Router} from '@angular/router'
import {GapiService} from './../service/gapi.service'
@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements AfterViewInit,OnInit {
  private googleAuth: any;
  public isGoogleSignedIn = false;
  public googleUser: gapi.auth2.GoogleUser;
  constructor(public gapiService:GapiService,private router:Router,private ngZone: NgZone){}
  ngAfterViewInit() {
    this.isGoogleSignedIn = false
    this.loadGapi()
  }
  ngOnInit(){
    // this.loadGapi()
  }
  loadGapi() {
    this.gapiService.loadClient().then((res) => {
      // console.log(res);
      this.gapiService.initClient().then(res => {
        this.googleAuth = res.googleAuth;
        this.checkGapiLogin();
      })
        .catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    })
  }
  checkGapiLogin() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.signinChanged);
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.isGoogleSignedIn = true;
      this.navigate()
      // this.router.navigateByUrl('/jobs')
      this.googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    } else {
      this.isGoogleSignedIn = false;
    }
  }
  signInGapi() { 
    var self=this
      this.googleAuth.signIn({
        prompt: 'select_account'
      }).then(res=>{
        console.log(res,"===============")
        this.ngZone.run(() => self.router.navigateByUrl('/jobs'))      
      })
  }
  navigate(){
    this.ngZone.run(() => this.router.navigateByUrl('/jobs'))
    
  }
  
  signinChanged(val) {
    console.log('Google Signed In state change: ', val);
    if (!val) {
      this.isGoogleSignedIn = false;
    }
  }

}
