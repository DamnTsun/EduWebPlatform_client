// Base modules / Environment variables.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

// App routes.
import { appRoutes } from './app.router';

// HTTP module.
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Social login.
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
// Quill RCT
import { QuillModule } from 'ngx-quill';
// Infinite-Scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
import { TopicHomeComponent } from './components/content-related/topics/topic-home/topic-home.component';
import { LessonHomeComponent } from './components/content-related/lessons/lesson-home/lesson-home.component';
import { TestHomeComponent } from './components/content-related/tests/test-home/test-home.component';
// ACCOUNT RELATED
import { SignInComponent } from './components/account/sign-in/sign-in.component';
import { AccountComponent } from './components/account/account/account.component';
import { UserTestAttemptComponent } from './components/content-related/user_tests/user-test-attempt/user-test-attempt.component';
import { SubjectCreatorComponent } from './components/content-related/subjects/subject-creator/subject-creator.component';
import { SubjectEditorComponent } from './components/content-related/subjects/subject-editor/subject-editor.component';
import { TopicCreatorComponent } from './components/content-related/topics/topic-creator/topic-creator.component';
import { TopicEditorComponent } from './components/content-related/topics/topic-editor/topic-editor.component';
import { LessonCreatorComponent } from './components/content-related/lessons/lesson-creator/lesson-creator.component';
import { LessonEditorComponent } from './components/content-related/lessons/lesson-editor/lesson-editor.component';
import { TestCreatorComponent } from './components/content-related/tests/test-creator/test-creator.component';
import { TestEditorComponent } from './components/content-related/tests/test-editor/test-editor.component';
import { TestQuestionListComponent } from './components/content-related/testQuestions/test-question-list/test-question-list.component';
import { TestQuestionHomeComponent } from './components/content-related/testQuestions/test-question-home/test-question-home.component';
import { TestQuestionCreatorComponent } from './components/content-related/testQuestions/test-question-creator/test-question-creator.component';
import { TestQuestionEditorComponent } from './components/content-related/testQuestions/test-question-editor/test-question-editor.component';
import { LessonListComponent } from './components/content-related/lessons/lesson-list/lesson-list.component';
import { TestListComponent } from './components/content-related/tests/test-list/test-list.component';
import { UsersListComponent } from './components/account/users-list/users-list.component';
import { MessageListComponent } from './components/account/messages/message-list/message-list.component';
import { MessageFromUserListComponent } from './components/account/messages/message-from-user-list/message-from-user-list.component';
import { SendMessageComponent } from './components/account/messages/send-message/send-message.component';
import { MessageSentListComponent } from './components/account/messages/message-sent-list/message-sent-list.component';
import { MessageSentToUserListComponent } from './components/account/messages/message-sent-to-user-list/message-sent-to-user-list.component';
import { UserTestListComponent } from './components/content-related/user_tests/user-test-list/user-test-list.component';
import { UserTestDetailsComponent } from './components/content-related/user_tests/user-test-details/user-test-details.component';
import { ChatComponent } from './components/account/messages/chat/chat.component';
import { GroupListComponent } from './components/account/groups/group-list/group-list.component';
import { GroupHomeComponent } from './components/account/groups/group-home/group-home.component';
import { GroupChatComponent } from './components/account/groups/group-chat/group-chat.component';
import { SubjectNewsCreatorComponent } from './components/content-related/subjects/subject-news-creator/subject-news-creator.component';
import { SubjectNewsEditorComponent } from './components/content-related/subjects/subject-news-editor/subject-news-editor.component';




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
    TopicHomeComponent,
    LessonHomeComponent,
    TestHomeComponent,
    UserTestAttemptComponent,
    SubjectCreatorComponent,
    SubjectEditorComponent,
    TopicCreatorComponent,
    TopicEditorComponent,
    LessonCreatorComponent,
    LessonEditorComponent,
    TestCreatorComponent,
    TestEditorComponent,
    TestQuestionListComponent,
    TestQuestionHomeComponent,
    TestQuestionCreatorComponent,
    TestQuestionEditorComponent,
    LessonListComponent,
    TestListComponent,
    UsersListComponent,
    MessageListComponent,
    MessageFromUserListComponent,
    SendMessageComponent,
    MessageSentListComponent,
    MessageSentToUserListComponent,
    UserTestListComponent,
    UserTestDetailsComponent,
    ChatComponent,
    GroupListComponent,
    GroupHomeComponent,
    GroupChatComponent,
    SubjectNewsCreatorComponent,
    SubjectNewsEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    SocialLoginModule,
    QuillModule,
    InfiniteScrollModule,
    MarkdownModule.forRoot()
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
