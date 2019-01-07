export const environment = {
  production: true,

  apiUrl: 'http://localhost/EduWebPlatform_api/',
  routeParams: {
    subjectid: 'subjectid',
    topicid: 'topicid'
  },
  routes: {
    // SUBJECTS
    subjectSelect: 'subjects',
    subjectHome: 'subjects/:subjectid',
    subjectNews: 'subjects/:subjectid/news',

    topicSelect: 'subjects/:subjectid/topics',

    // TOPICS
    topicHome: 'subjects/:subjectid/topics/:topicid',
    // LESSONS / TESTS

    
    // USERS
    account_signIn: 'users/signin',
    account: 'users/account'
  }
};
