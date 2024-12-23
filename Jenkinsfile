pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "real-time-api-api-1"
        DOCKER_REGISTRY = "ahrahr"
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs() 
            }
        }
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/ahr-ahr/RealTime-API.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    docker.image(DOCKER_IMAGE).inside {
                        // Using bat instead of sh if running on Windows
                        bat 'npm run test'
                    }
                }
            }
        }
        stage('Push to Docker Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-credentials-id') {
                        docker.image(DOCKER_IMAGE).push('latest')
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
