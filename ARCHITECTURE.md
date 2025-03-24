# Quiz Application Architecture

## System Architecture Diagram

```mermaid
graph TD
    subgraph "User Interface"
        Browser[Web Browser]
    end

    subgraph "AWS Cloud"
        subgraph "Amazon ECS with Fargate"
            FrontendContainer[Frontend Container<br/>React.js App]
            BackendContainer[Backend Container<br/>Node.js API]
        end

        subgraph "Amazon ECR"
            FrontendImage[Frontend Image]
            BackendImage[Backend Image]
        end

        subgraph "Networking"
            ALB[Application Load Balancer]
            VPC[VPC]
            subgraph "Public Subnets"
                PublicSubnet1[Public Subnet 1]
                PublicSubnet2[Public Subnet 2]
            end
            subgraph "Private Subnets"
                PrivateSubnet1[Private Subnet 1]
                PrivateSubnet2[Private Subnet 2]
            end
        end

        subgraph "Security"
            IAM[IAM Roles]
            SecurityGroups[Security Groups]
        end

        subgraph "Database"
            MongoDB[MongoDB Atlas]
        end
    end

    subgraph "CI/CD"
        GitHub[GitHub Repository]
        CircleCI[CircleCI Pipeline]
    end

    %% Connections
    Browser --> ALB
    ALB --> FrontendContainer
    ALB --> BackendContainer
    FrontendContainer --> BackendContainer
    BackendContainer --> MongoDB
    
    CircleCI --> GitHub
    CircleCI --> FrontendImage
    CircleCI --> BackendImage
    FrontendImage --> FrontendContainer
    BackendImage --> BackendContainer
    
    IAM --> FrontendContainer
    IAM --> BackendContainer
    SecurityGroups --> FrontendContainer
    SecurityGroups --> BackendContainer

    %% Network Flow
    PublicSubnet1 --> PrivateSubnet1
    PublicSubnet2 --> PrivateSubnet2
```

## Component Details

### Frontend Container
- React.js application
- Context API for state management
- Responsive UI components
- JWT token handling
- API integration

### Backend Container
- Node.js + Express API
- RESTful endpoints
- JWT authentication
- MongoDB integration
- Business logic

### AWS Infrastructure
1. **ECS/Fargate**
   - Serverless container management
   - Auto-scaling capabilities
   - Task definitions and services

2. **Networking**
   - VPC with public/private subnets
   - Application Load Balancer
   - Security groups and NACLs

3. **Security**
   - IAM roles and policies
   - VPC endpoints
   - SSL/TLS encryption

### CI/CD Pipeline
1. **Source Control**
   - GitHub repository
   - Branch protection rules
   - Code review process

2. **CircleCI**
   - Automated testing
   - Docker image building
   - AWS deployment
   - Environment management 