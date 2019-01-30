import { environment } from "src/environments/environment";
import { SubjectListComponent } from "./components/content-related/subjects/subject-list/subject-list.component";
import { SubjectHomeComponent } from "./components/content-related/subjects/subject-home/subject-home.component";
import { SubjectNewsComponent } from "./components/content-related/subjects/subject-news/subject-news.component";
import { TopicListComponent } from "./components/content-related/topics/topic-list/topic-list.component";
import { TopicHomeComponent } from "./components/content-related/topics/topic-home/topic-home.component";
import { LessonHomeComponent } from "./components/content-related/lessons/lesson-home/lesson-home.component";
import { TestHomeComponent } from "./components/content-related/tests/test-home/test-home.component";
import { UserTestAttemptComponent } from './components/content-related/user_tests/user-test-attempt/user-test-attempt.component';
import { SignInComponent } from "./components/account/sign-in/sign-in.component";
import { AccountComponent } from "./components/account/account/account.component";
import { SubjectCreatorComponent } from "./components/content-related/subjects/subject-creator/subject-creator.component";
import { SubjectEditorComponent } from "./components/content-related/subjects/subject-editor/subject-editor.component";
import { TopicCreatorComponent } from "./components/content-related/topics/topic-creator/topic-creator.component";
import { TopicEditorComponent } from "./components/content-related/topics/topic-editor/topic-editor.component";
import { LessonCreatorComponent } from "./components/content-related/lessons/lesson-creator/lesson-creator.component";
import { LessonEditorComponent } from "./components/content-related/lessons/lesson-editor/lesson-editor.component";
import { TestCreatorComponent } from "./components/content-related/tests/test-creator/test-creator.component";
import { TestEditorComponent } from "./components/content-related/tests/test-editor/test-editor.component";
import { TestQuestionListComponent } from "./components/content-related/testQuestions/test-question-list/test-question-list.component";
import { TestQuestionHomeComponent } from "./components/content-related/testQuestions/test-question-home/test-question-home.component";
import { TestQuestionCreatorComponent } from "./components/content-related/testQuestions/test-question-creator/test-question-creator.component";
import { TestQuestionEditorComponent } from "./components/content-related/testQuestions/test-question-editor/test-question-editor.component";
import { LessonListComponent } from "./components/content-related/lessons/lesson-list/lesson-list.component";
import { TestListComponent } from "./components/content-related/tests/test-list/test-list.component";
import { UsersListComponent } from "./components/account/users-list/users-list.component";
import { MessageListComponent } from "./components/account/messages/message-list/message-list.component";
import { MessageFromUserListComponent } from "./components/account/messages/message-from-user-list/message-from-user-list.component";
import { SendMessageComponent } from "./components/account/messages/send-message/send-message.component";
import { MessageSentListComponent } from "./components/account/messages/message-sent-list/message-sent-list.component";
import { MessageSentToUserListComponent } from "./components/account/messages/message-sent-to-user-list/message-sent-to-user-list.component";
import { UserTestListComponent } from "./components/content-related/user_tests/user-test-list/user-test-list.component";

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
  { // Lesson select.
    path: environment.routes.lessonList,
    component: LessonListComponent
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
  { // Test editor.
    path: environment.routes.testEditor,
    component: TestEditorComponent
  },
  { // Test list.
    path: environment.routes.testList,
    component: TestListComponent
  },
  { // Test home.
    path: environment.routes.testHome,
    component: TestHomeComponent
  },



  // TEST QUESTIONS
  { // Test question creator.
    path: environment.routes.testQuestionCreator,
    component: TestQuestionCreatorComponent
  },
  { // Test question editor.
    path: environment.routes.testQuestionEditor,
    component: TestQuestionEditorComponent
  },
  { // Test question list.
    path: environment.routes.testQuestionList,
    component: TestQuestionListComponent
  },
  { // Test question home.
    path: environment.routes.testQuestionHome,
    component: TestQuestionHomeComponent
  },



  // USER TESTS
  { // Attempt user test.
    path: environment.routes.userTestAttempt,
    component: UserTestAttemptComponent
  },
  { // View previous test results (all)
    path: environment.routes.userTestList,
    component: UserTestListComponent
  },
  // *** END OF CONTENT RELATED ***


  // Sign in and account related.
  { // Sign in.
    path: environment.routes.account_signIn,
    component: SignInComponent
  },
  { // Account dashboard.
    path: environment.routes.account,
    component: AccountComponent
  },
  { // Users list.
    path: environment.routes.usersList,
    component: UsersListComponent
  },



  // Messages
  { // Sent messages.
    path: environment.routes.messageSentList,
    component: MessageSentListComponent
  },
  { // Sent messages to a specific user.
    path: environment.routes.messageSentToList,
    component: MessageSentToUserListComponent
  },
  { // Send message
    path: environment.routes.sendMessage,
    component: SendMessageComponent
  },
  { // Received message list.
    path: environment.routes.messageList,
    component: MessageListComponent
  }, 
  { // Received message list from a specific user.
    path: environment.routes.messageFromList,
    component: MessageFromUserListComponent
  }
];