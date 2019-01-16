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
import { SubjectEditorComponent } from "./components/content-related/subjects/subject-editor/subject-editor.component";
import { TopicCreatorComponent } from "./components/content-related/topics/topic-creator/topic-creator.component";
import { TopicEditorComponent } from "./components/content-related/topics/topic-editor/topic-editor.component";
import { LessonCreatorComponent } from "./components/content-related/lessons/lesson-creator/lesson-creator.component";
import { LessonEditorComponent } from "./components/content-related/lessons/lesson-editor/lesson-editor.component";
import { TestCreatorComponent } from "./components/content-related/tests/test-creator/test-creator.component";

// Routes for app.
export const appRoutes = [
  { // Default route. Go to subject select.
    path: '',
    redirectTo: environment.routes.subjectSelect,
    pathMatch: 'full'
  },



  // *** CONTENT RELATED ***
  // SUBJECTS
  { // Subject creator.
    path: environment.routes.subjectCreator,
    component: SubjectCreatorComponent
  },
  { // Subject editor.
    path: environment.routes.subjectEditor,
    component: SubjectEditorComponent
  },
  { // Subject list.
    path: environment.routes.subjectSelect,
    component: SubjectListComponent
  },
  { // Subject home page.
    path: environment.routes.subjectHome,
    component: SubjectHomeComponent
  },
  { // Subject news page.
    path: environment.routes.subjectNews,
    component: SubjectNewsComponent
  },



  // TOPICS
  { // Topic creator.
    path: environment.routes.topicCreator,
    component: TopicCreatorComponent
  },
  { // Topic editor. (todo)
    path: environment.routes.topicEditor,
    component: TopicEditorComponent
  },
  { // Topic select.
    path: environment.routes.topicSelect,
    component: TopicListComponent
  },
  { // Topic home.
    path: environment.routes.topicHome,
    component: TopicHomeComponent
  },



  // LESSONS
  { // Lesson creator.
    path: environment.routes.lessonCreator,
    component: LessonCreatorComponent
  },
  { // Lesson editor.
    path: environment.routes.lessonEditor,
    component: LessonEditorComponent
  },
  { // Lesson home.
    path: environment.routes.lessonHome,
    component: LessonHomeComponent
  },
  // TESTS
  { // Test creator.
    path: environment.routes.testCreator,
    component: TestCreatorComponent
  },
  { // Test home.
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