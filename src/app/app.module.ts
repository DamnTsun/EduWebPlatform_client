import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PHeaderComponent } from './components/_shared/p-header/p-header.component';                          // Page header
import { SubjectListComponent } from './components/subjects/subject-list/subject-list.component';             // Subject list/selector
import { SubjectHomeComponent } from './components/subjects/subject-home/subject-home.component';             // Subject home page


const appRoutes = [
  // Base url and Subject Select.
  {
    path: '',
    redirectTo: 'subjects',
    pathMatch: 'full'
  },
  {
    path: 'subjects',
    component: SubjectListComponent
  },
  // Subject home page.
  {
    path: 'subjects/:subjectid',
    component: SubjectHomeComponent
  }
]


@NgModule({
  declarations: [
    AppComponent,
    PHeaderComponent,
    SubjectListComponent,
    SubjectHomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
