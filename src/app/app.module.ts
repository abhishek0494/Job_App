import { BrowserModule } from '@angular/platform-browser';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JobComponent } from './job/job.component';
import {HttpClientModule} from '@angular/common/http'
import { MatPaginatorModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatToolbarModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { SsoComponent } from './sso/sso.component';
import { SidebarModule } from 'ng-sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    JobComponent,
    SsoComponent
  ],
  imports: [
    BrowserModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatChipsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    SidebarModule.forRoot(),
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  // schemas:[NO_ERRORS_SCHEMA]
})
export class AppModule { }
