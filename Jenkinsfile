pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "auexch-frontend"
        DOCKER_TAG = "latest"
        DOCKER_REGISTRY = "registry.f7information.com:80"  // change to your registry
        DOCKER_CREDENTIALS_ID = "docker-credentials" // Jenkins credentials ID
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
                    """
                }
            }
        }

        stage('Login to Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo $DOCKER_PASSWORD | docker  login -u $DOCKER_USERNAME --password-stdin $DOCKER_REGISTRY"
                    }
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    sh """
                    docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_REGISTRY/$DOCKER_IMAGE:$DOCKER_TAG
                    docker push $DOCKER_REGISTRY/$DOCKER_IMAGE:$DOCKER_TAG
                    """
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh """
                    docker --context remote-webserver rm -f $DOCKER_IMAGE || true
                    sleep 10
                    docker --context remote-webserver run --pull=always -d --name $DOCKER_IMAGE -p 4001:3000 $DOCKER_REGISTRY/$DOCKER_IMAGE:$DOCKER_TAG
                    """
                }
            }
        }

        stage('Clean Container') {
            steps {
                script {
                    sh """
                    docker system prune -a -f
                    
                    """
                }
            }
        }

        stage('Nginx Config Update') {
            steps {
                script {
                    sh """
                    rsync -u auexch-webclient.conf ubuntu@3.249.85.72:/var/www/frontend/nginx_config/
                    ssh ubuntu@3.249.85.72 -T "sudo cp -rf  /var/www/frontend/nginx_config/auexch-webclient.conf /etc/nginx/conf.d/"
                    ssh ubuntu@3.249.85.72 -T  "sudo service nginx reload"
                    ssh ubuntu@3.249.85.72 -T "sudo docker image prune -f"
                    
                    """
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline finished!"
        }
        success {
                echo 'Cleaning workspace on success to remove build cache' 
                cleanWs()  
        }
        failure {
              echo 'Cleaning workspace on failed to remove build cache'   
             cleanWs()  
        }
    }
}
