export const environment = {
  production: true,

  apiUrl: 'http://localhost/EduWebPlatform_api/',
  routes: {
    subjectSelect: 'subjects',
    subjectHome: 'subjects/:subjectid',

    topicSelect: 'subjects/:subjectid/topics',
    
    account_signIn: 'users/signin',
    account: 'users/account'
  }
};
