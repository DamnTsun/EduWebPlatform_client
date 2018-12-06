import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PHeaderComponent } from './components/_shared/p-header/p-header.component';                          // Page header
import { SubjectListComponent } from './components/subjects/subject-list/subject-list.component';             // Subject list/selector
import { SubjectHomeComponent } from './components/subjects/subject-home/subject-home.component';
import { TopicListComponent } from './components/topics/topic-list/topic-list.component';             // Subject home page
import { environment } from '../environments/environment.prod';
import { LoaderComponent } from './components/_shared/loader/loader.component';


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
  },
  // Topic listing and topic
  {
    path: environment.routes.topicSelect,
    component: TopicListComponent
  }
]


@NgModule({
  declarations: [
    AppComponent,
    PHeaderComponent,
    SubjectListComponent,
    SubjectHomeComponent,
    TopicListComponent,
    LoaderComponent
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
