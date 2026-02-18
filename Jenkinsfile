pipeline {
    agent any

    environment {
        DOCKER_APP_NAME = "auexch-frontend"
        DOCKER_IMAGE = "universecode11/auexch-frontend"
        CONTEXT_NAME = "btf-ireland"
        DOCKER_TAG = "latest"
        AWS_ACCOUNT_ID = '372777850584' // Replace with your AWS Account ID
        AWS_DEFAULT_REGION = 'eu-west-1' // Replace with your AWS Region (e.g., us-east-1)
        ECR_REGISTRY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
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

        stage('Login to AWS ECR') {
            steps {
                script {
                    sh """
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY_URI}
                    """
                }
                
            }
        }

        stage('Push Image') {
            steps {
                script {
                    sh """
                    docker tag $DOCKER_IMAGE:$DOCKER_TAG $ECR_REGISTRY_URI/$DOCKER_IMAGE:$DOCKER_TAG
                    docker push $ECR_REGISTRY_URI/$DOCKER_IMAGE:$DOCKER_TAG
                    """
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh """
                    docker --context $CONTEXT_NAME rm  $DOCKER_APP_NAME --force || true
                    docker --context $CONTEXT_NAME  system prune -a -f
                    docker --context $CONTEXT_NAME run --pull=always -d --name $DOCKER_APP_NAME -p 4000:3000 $ECR_REGISTRY_URI/$DOCKER_IMAGE:$DOCKER_TAG
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
                    rsync -u auexch-webclient.conf ubuntu@3.249.85.72:/var/www/html/conf/
                    ssh ubuntu@3.249.85.72 -T "sudo cp -rf  /var/www/html/conf/auexch-webclient.conf /etc/nginx/conf.d/"
                    ssh ubuntu@3.249.85.72 -T  "sudo service nginx reload"
                    
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
