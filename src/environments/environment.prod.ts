export const environment = {
  production: true,

  apiUrl: 'http://localhost/EduWebPlatform_api/',
  routeParams: {
    // Content related.
    subjectid: 'subjectid',
    topicid: 'topicid',
    lessonid: 'lessonid',
    testid: 'testid'
  },
  routes: {
    // *** CONTENT RELATED ***
    // SUBJECTS
    subjectSelect: 'subjects',
    subjectHome: 'subjects/:subjectid',
    subjectNews: 'subjects/:subjectid/news',

    topicSelect: 'subjects/:subjectid/topics',

    // TOPICS
    topicHome: 'subjects/:subjectid/topics/:topicid',
    // LESSONS / TESTS
    lessonHome: 'subjects/:subjectid/topics/:topicid/lessons/:lessonid',
    testHome: 'subjects/:subjectid/topics/:topicid/tests/:testid',
    // USER TEST ATTEMPT
    userTestAttempt: 'subjects/:subjectid/topics/:topicid/tests/:testid/user_test',
    // *** END OF CONTENT RELATED ***

    // USERS
    account_signIn: 'users/signin',
    account: 'users/account'
  }
};
