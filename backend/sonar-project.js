const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  token: 'e9acd8efac03fd60289850b405d70af7df3ea0f1',
  options: {
    'sonar.projectKey': 'Proyecto-Final',
    'sonar.login': 'e9acd8efac03fd60289850b405d70af7df3ea0f1',
    'sonar.sources': '.',
    'sonar.inclusions': 'src/**' // Entry point of your code
  }
}, () => { });
