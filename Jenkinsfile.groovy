pipeline {
  agent { label 'z-node12-agent' }
  environment {
      CODECOMMIT_URL = "git-codecommit.ap-south-1.amazonaws.com/v1/repos/swirepay-ionic-app"
  }
  options { timestamps() }
  stages {
    stage('Code Commit Push') {
      when {
        anyOf {
          branch 'develop'
          branch 'release/*'
          branch 'hotfix/*'
          allOf {
            branch 'master'
            triggeredBy 'user'
          }
        }
      }
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'c58a861e-2ec7-494d-be64-b6d91062ad1b',
            usernameVariable: 'GIT_USERNAME',
            passwordVariable: 'GIT_PASSWORD'
          )
        ]) {
          sh("""
            git remote add aws https://${CODECOMMIT_URL}
            git checkout ${env.GIT_BRANCH}
            git remote -v
            git branch -a
            git push -f https://${GIT_USERNAME}:${GIT_PASSWORD}@${CODECOMMIT_URL} ${env.GIT_BRANCH}
          """)
        }
      }
    }
  }
}