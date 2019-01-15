import { environment } from "src/environments/environment";
import { SubjectListComponent } from "./components/content-related/subjects/subject-list/subject-list.component";
import { SubjectHomeComponent } from "./components/content-related/subjects/subject-home/subject-home.component";
import { SubjectNewsComponent } from "./components/content-related/subjects/subject-news/subject-news.component";
import { TopicListComponent } from "./components/content-related/topics/topic-list/topic-list.component";
import { TopicHomeComponent } from "./components/content-related/topics/topic-home/topic-home.component";
import { LessonHomeComponent } from "./components/content-related/lessons/lesson-home/lesson-home.component";
import { TestHomeComponent } from "./components/content-related/tests/test-home/test-home.component";
import { UserTestAttemptComponent } from "./components/content-related/tests/user-test-attempt/user-test-attempt.component";
import { SignInComponent } from "./components/account/sign-in/sign-in.component";
import { AccountComponent } from "./components/account/account/account.component";
import { SubjectCreatorComponent } from "./components/content-related/subjects/subject-creator/subject-creator.component";

// Routes for app.
export const appRoutes = [
    // *** CONTENT RELATED ***
  // SUBJECTS
  // Redirect from '' to subject list.
  {
    path: '',
    redirectTo: environment.routes.subjectSelect,
    pathMatch: 'full'
  },
  // Subject creator.
  {
    path: environment.routes.subjectCreator,
    component: SubjectCreatorComponent
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
];