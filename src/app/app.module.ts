// Base modules / Environment variables.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

// HTTP module.
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Social login.
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

// Components.
// AppComponent and shared stuff (header, animated CSS loading icon thingy, etc)
import { AppComponent } from './app.component';
import { PHeaderComponent } from './components/_shared/p-header/p-header.component';
import { LoaderComponent } from './components/_shared/loader/loader.component';
// GENERAL CONTENT COMPONENTS
import { SubjectListComponent } from './components/content-related/subjects/subject-list/subject-list.component';
import { SubjectHomeComponent } from './components/content-related/subjects/subject-home/subject-home.component';
import { SubjectNewsComponent } from './components/content-related/subjects/subject-news/subject-news.component';
import { TopicListComponent } from './components/content-related/topics/topic-list/topic-list.component';
import { SubjectPostListComponent } from './components/content-related/subjects/subject-post-list/subject-post-list.component';
import { TopicHomeComponent } from './components/content-related/topics/topic-home/topic-home.component';
import { LessonHomeComponent } from './components/content-related/lessons/lesson-home/lesson-home.component';
import { TestHomeComponent } from './components/content-related/tests/test-home/test-home.component';
// ACCOUNT RELATED
import { SignInComponent } from './components/account/sign-in/sign-in.component';
import { AccountComponent } from './components/account/account/account.component';
import { UserTestAttemptComponent } from './components/content-related/tests/user-test-attempt/user-test-attempt.component';



const appRoutes = [
  // *** CONTENT RELATED ***
  // SUBJECTS
  // Redirect from '' to subject list.
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

  // TOPICS
  {
    path: environment.routes.topicHome,
    component: TopicHomeComponent
  },

  // LESSONS
  {
    path: environment.routes.lessonHome,
    component: LessonHomeComponent
  },
  // TESTS
  {
    path: environment.routes.testHome,
    component: TestHomeComponent
  },
  // USER TEST ATTEMPT
  {
    path: environment.routes.userTestAttempt,
    component: UserTestAttemptComponent
  },
  // *** END OF CONTENT RELATED ***


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
    SubjectPostListComponent,
    TopicHomeComponent,
    LessonHomeComponent,
    TestHomeComponent,
    UserTestAttemptComponent
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
