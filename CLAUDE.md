

# Project Techninal Overview 
this document provides a technical overview of the Current codeBase, including its architecture, components,  key features, and instuctions for interacting with the code base.
# Tech Stack
- **NestJs**: A backend framework for building efficient, scalable and clean server-side applications.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **PostgreSqL**: A powerful, open-source relational database system that is self-contained, serverless, and zero-configuration.

# Folder Structure
- **src**: Contains the main application code.
  - **app.module.ts**: The root module of the application, where all modules are imported and configured.
  - **main.ts**: The entry point of the application, where the NestJS application is created and started.
  - **app.controller.ts / app.service.ts**: The root controller and service for basic routes and logic.

  - **authentication**: Handles all authentication and authorization logic.
    - **decorators**: Custom decorators for extracting user info or enforcing permissions.
    - **dtos**: Data Transfer Objects for validating and transforming authentication-related data (e.g., login, register).
    - **guards**: Authentication and role-based access guards.
    - **strategies**: Passport strategies (JWT, OAuth, etc.).
    - **types**: Types and interfaces used across authentication.
    - **authentication.controller.ts**: Handles authentication routes.
    - **authentication.service.ts**: Contains the business logic for authentication.
    - **authentication.module.ts**: Bundles all authentication-related providers and controllers.

  - **user**: Manages user-related logic.
    - **dto**: User-related DTOs.
    - **entities**: User entity definitions for the database.
    - **user.service.ts**: Business logic related to users.
    - **user.controller.ts**: HTTP controllers for user-related routes.
    - **user.module.ts**: Module for user features.

  - **Feature**: A basic feature module that contains the business logic and database interactions.
    - **dto**: Contains DTOs for validating and transforming data.
    - **entities**: Contains entities that represent the database tables.
    - **services**: Contains business logic and interacts with repositories (if one service per module, you can put it directly in the module folder).
    - **controllers**: Contains HTTP controllers that handle incoming requests and responses (if one controller per module, you can put it directly in the module folder).
    - **gateways**: Contains WebSocket gateways for real-time communication (if one gateway per module, you can put it directly in the module folder).

  - **common**: Contains shared modules, services, and utilities used across the application.
    - **constants**: Application-wide constants such as job names and queue names.
      - **jobs.ts**
      - **queues.ts**
    - **utils**: Common helper functions to keep the code DRY.
      - **authentication**: Authentication-related utility functions.
      - **webSocket**: WebSocket-related utility functions.
    - **decorators**: Custom decorators for validation, logging, or data extraction.
    - **filters**: Exception filters for global error handling.
    - **guards**: Guards for implementing authentication and authorization logic globally.
    - **interceptors**: Interceptors for logging, transforming, or modifying requests and responses.
    - **pipes**: Pipes for transforming and validating incoming data.

  - **config**: Contains configuration files and modules for managing application settings.
    - **app.config.ts**: The module that loads and provides configuration settings from `.env`.
    - **interfaces**: Contains interfaces for configuration settings.
      - **app-config.interfaces.ts**

  - **redis**: Handles Redis integration for caching, pub/sub, and streams.
    - **redis.module.ts**: Redis module configuration.
    - **redis.service.ts**: Redis client logic and helpers.
To interact with the code base as an AI agent, you can follow these steps:
1. **Understand the Architecture**: Familiarize yourself with the overall architecture of the application, including the main modules, services, and controllers.
2. **Identify Key Components**: Identify the key components of the application, such as the main module, feature modules, and common utilities.
3. **Explore the Code**: Navigate through the codebase to understand how different components interact with each 
other. Pay attention to the structure of modules, services, and controllers.
4. **Use TypeScript Features**: Leverage TypeScript features such as interfaces, types, and decorators to enhance your understanding of the code. This will help you grasp the data structures and the flow of data within the application.
5. **Review Documentation**: Check for any existing documentation or comments within the codebase. This can provide valuable insights into the purpose and functionality of different components

6. **Log Changes**: Any prompt written to the ai agent shall be logged into the `ai_logs` folder under the file names <today_date_utc>.md (if this file does not exists you should create it),this file  shall include the prompt text, the user who wrote it derived from the git author name and  the main files changes and a highlights of the changes and the lines contrainsts where those changes happened, this process is crucial for debugging and tracking changes.
7. **Code Documentation**: Document any implemented methods or created files using jsDoc comments , including examples folders overveiws method descriptions and parameter explanations. This will help maintain clarity and understanding of the codebase.
8. **Follow Best Practices**: Adhere to best practices in coding, such as writing clean, maintainable code, using meaningful variable names, and following the project's coding standards.
