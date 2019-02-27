export const environment = {
  production: true,

  apiUrl: 'http://localhost/EduWebPlatform_api/',
  routeParams: {
    // Content related.
    subjectid: 'subjectid',
    postid: 'postid',
    topicid: 'topicid',
    lessonid: 'lessonid',
    testid: 'testid',
    questionId: 'testquestionid',

    // User_tests
    usertestid: 'usertestid',

    // User / Messaging related.
    userid: 'userid',

    // Group related.
    groupid: 'groupid'
  },
  routes: {
    // *** CONTENT RELATED ***
    // SUBJECTS
    subjectSelect: 'subjects',
    subjectHome: 'subjects/:subjectid',
    subjectCreator: 'subjects/create',
    subjectEditor: 'subjects/:subjectid/edit',
    // SUBJECT POSTS
    subjectNews: 'subjects/:subjectid/news',
    subjectPostCreator: 'subjects/:subjectid/news/create',
    subjectPostEditor: 'subjects/:subjectid/news/:postid/edit',

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
    // *** END OF CONTENT RELATED ***
    // *** USER TEST RELATED ***
    userTestAttempt: 'subjects/:subjectid/topics/:topicid/tests/:testid/user_test',
    userTestList: 'subjects/:subjectid/topics/:topicid/tests/:testid/user_tests',
    userTestDetails: 'subjects/:subjectid/topics/:topicid/tests/:testid/user_tests/:usertestid',
    
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

    sendMessage: 'users/messages/send/:userid',
    chat: 'users/chat/:userid',

    // sentList -> sentTolist -> sendMessage -> messageFromlist ->  messagelist

    // GROUPS
    // Group list.
    groupList: 'groups',
    // All groups (admin).

    // Group creator / editor.
    groupCreator: 'groups/create',
    groupEditor: 'groups/:groupid/edit',
    // Group home (including add/remove users).
    groupHome: 'groups/:groupid',
    // Group chat.
    groupChat: 'groups/:groupid/chat'
  }
};
