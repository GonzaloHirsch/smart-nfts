const sonarqubeScanner = require('sonarqube-scanner');
     sonarqubeScanner({
       serverUrl: 'http://localhost:9000',
token: '99b087eb1863daddbc9dbc2d6d0bf3f701e70ba1',
       options : {
      'sonar.projectKey': 'Proyecto-Final',
  'sonar.login': '99b087eb1863daddbc9dbc2d6d0bf3f701e70ba1',
       'sonar.sources': '.',
       'sonar.inclusions' : 'src/**' // Entry point of your code
       }
     }, () => {});
