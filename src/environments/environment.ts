// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  apiUrl: 'http://localhost/EduWebPlatform_api/',
  routeParams: {
    // Content related.
    subjectid: 'subjectid',
    topicid: 'topicid',
    lessonid: 'lessonid',
    testid: 'testid',
    questionId: 'testquestionid',

    // User / Messaging related.
    userid: 'userid'
  },
  routes: {
    // *** CONTENT RELATED ***
    // SUBJECTS
    subjectSelect: 'subjects',
    subjectHome: 'subjects/:subjectid',
    subjectNews: 'subjects/:subjectid/news',
    subjectCreator: 'subjects/create',
    subjectEditor: 'subjects/:subjectid/edit',

    // TOPICS
    topicHome: 'subjects/:subjectid/topics/:topicid',
    topicCreator: 'subjects/:subjectid/topics/create',
    topicEditor: 'subjects/:subjectid/topics/:topicid/edit',
    topicSelect: 'subjects/:subjectid/topics',

    // LESSONS / TESTS
    lessonCreator: 'subjects/:subjectid/topics/:topicid/lessons/create',
    lessonEditor: 'subjects/:subjectid/topics/:topicid/lessons/:lessonid/edit',
    lessonHome: 'subjects/:subjectid/topics/:topicid/lessons/:lessonid',
    lessonList: 'subjects/:subjectid/topics/:topicid/lessons',
    testCreator: 'subjects/:subjectid/topics/:topicid/tests/create',
    testEditor: 'subjects/:subjectid/topics/:topicid/tests/:testid/edit',
    testHome: 'subjects/:subjectid/topics/:topicid/tests/:testid',
    testList: 'subjects/:subjectid/topics/:topicid/tests',

    // TEST QUESTIONS
    testQuestionCreator: 'subjects/:subjectid/topics/:topicid/tests/:testid/questions/create',
    testQuestionEditor: 'subjects/:subjectid/topics/:topicid/tests/:testid/questions/:testquestionid/edit',
    testQuestionList: 'subjects/:subjectid/topics/:topicid/tests/:testid/questions',
    testQuestionHome: 'subjects/:subjectid/topics/:topicid/tests/:testid/questions/:testquestionid',
    // USER TEST ATTEMPT
    userTestAttempt: 'subjects/:subjectid/topics/:topicid/tests/:testid/user_test',
    // *** END OF CONTENT RELATED ***
    
    // USERS
    account_signIn: 'users/signin',
    account: 'users/account',
    usersList: 'users',

    // MESSAGES
    // Messages received
    messageList: 'users/messages',
    messageFromList: 'users/messages/:userid',
    // Messages sent.
    messageSentList: 'users/messages/sent',
    messageSentToList: 'users/messages/sent/:userid',

    sendMessage: 'users/messages/send/:userid'

    // sentList -> sentTolist -> sendMessage -> messageFromlist ->  messagelist
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
