// Base modules.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// HTTP module.
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Social login.
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

// Components.
import { AppComponent } from './app.component';
import { PHeaderComponent } from './components/_shared/p-header/p-header.component';                          // Page header
import { SubjectListComponent } from './components/subjects/subject-list/subject-list.component';             // Subject list/selector
import { SubjectHomeComponent } from './components/subjects/subject-home/subject-home.component';
import { TopicListComponent } from './components/topics/topic-list/topic-list.component';             // Subject home page
import { environment } from '../environments/environment.prod';
import { LoaderComponent } from './components/_shared/loader/loader.component';
import { SignInComponent } from './components/account/sign-in/sign-in.component';
import { AccountComponent } from './components/account/account/account.component';
import { SubjectNewsComponent } from './components/subjects/subject-news/subject-news.component';
import { SubjectPostListComponent } from './components/subjects/subject-post-list/subject-post-list.component';



const appRoutes = [
  // *** CONTENT RELATED ***
  // SUBJECTS
  {
    path: '',
    redirectTo: environment.routes.subjectSelect,
    pathMatch: 'full'
  },
  // Subject list.
  {
    path: environment.routes.subjectSelect,
    component: SubjectListComponent
  },
  // Subject home page.
  {
    path: environment.routes.subjectHome,
    component: SubjectHomeComponent
  },
  // Subject news page.
  {
    path: environment.routes.subjectNews,
    component: SubjectNewsComponent
  },
  // Subject topic list.
  {
    path: environment.routes.topicSelect,
    component: TopicListComponent
  },


  // Sign in and account related.
  {
    path: environment.routes.account_signIn,
    component: SignInComponent
  },
  {
    path: environment.routes.account,
    component: AccountComponent
  }
]


// Social login config.
const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('140771721886-3ht78s72map4d75dd0iletdh6b5lkmsr.apps.googleusercontent.com', googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('288853295310755')
  }
]);
export function provideConfig() {
  return config;
}



@NgModule({
  declarations: [
    AppComponent,
    PHeaderComponent,
    SubjectListComponent,
    SubjectHomeComponent,
    TopicListComponent,
    LoaderComponent,
    SignInComponent,
    AccountComponent,
    SubjectNewsComponent,
    SubjectPostListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
