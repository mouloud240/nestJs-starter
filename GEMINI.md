
# Project Techninal Overview 
this document provides a technical overview of the Current codeBase, including its architecture, components,  key features, and instuctions for interacting with the code base.
# Tech Stack
- **NestJs**: A backend framework for building efficient, scalable and clean server-side applications.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **PostgreSqL**: A powerful, open-source relational database system that is self-contained, serverless, and zero-configuration.
- **Redis**: An in-memory data structure store, used as a database, cache, and message broker.
- **BullMq**: A Node.js library for handling distributed jobs and messages in Node.js applications using Redis.
- **Passport**: An authentication middleware for Node.js, used to handle various authentication strategies.
- **ElasticSearch**: A distributed, RESTful search and analytics engine capable of addressing a growing number of use cases.


# Folder Structure
- **src**: Contains the main application code.
  - **common**: Contains shared modules, services, and utilities used across the application.
    - **constants**: Application-wide constants.
    - **filter**: Exception filters for global error handling.
    - **interceptors**: Interceptors for logging, transforming, or modifying requests and responses.
    - **modules**: Shared modules used across the application.
    - **scripts**: Utility scripts.
    - **types**: Shared TypeScript types and interfaces.
    - **utils**: Common helper functions to keep the code DRY.
  - **config**: Contains configuration files and modules for managing application settings.
    - **interfaces**: Contains interfaces for configuration settings.
    - **app.config.ts**: Application configuration settings.
    - **auth.config.ts**: Authentication configuration settings.
    - **cloud.config.ts**: Cloud services configuration.
    - **db.config.ts**: Database configuration settings.
    - **elastic-search.config.ts**: Elasticsearch configuration.
    - **mail.config.ts**: Email/mail service configuration.
    - **redis.config.ts**: Redis configuration settings.
  - **core**: Core business logic modules , Any main feature shall be added in here .
    - **authentication**: Handles all authentication and authorization logic.
    - **user**: Manages user-related logic.
    - **websocket**: WebSocket-related functionality.
    - **core.module.ts**: Core module that bundles essential features.
  - **infrastructure**: Infrastructure-related modules and services.
    - **cloudinary**: Cloud storage integration (Cloudinary).
    - **db**: Database configuration and setup.
    - **queue**: Queue management for background jobs.
    - **search**: Search functionality (likely Elasticsearch integration).
    - **infrastructure.module.ts**: Infrastructure module configuration.
  - **monitoring**: Application monitoring and observability.
    - **health**: Health check endpoints and services.
    - **monitoring.module.ts**: Monitoring module configuration.
  - **security**: Security-related modules and services.
    - **rate-limiting**: Rate limiting implementation for API protection.
    - **security.module.ts**: Security module configuration.
  - **app.controller.spec.ts**: Unit tests for the root controller.
  - **app.controller.ts**: The root controller for basic routes.
  - **app.module.ts**: The root module of the application, where all modules are imported and configured.
  - **app.service.ts**: The root service for basic application logic.
  - **main.ts**: The entry point of the application, where the NestJS application is created and started.To interact with the code base as an AI agent, you can follow these steps:
1. **Understand the Architecture**: Familiarize yourself with the overall architecture of the application, including the main modules, services, and controllers.
2. **Identify Key Components**: Identify the key components of the application, such as the main module, feature modules, and common utilities.
3. **Explore the Code**: Navigate through the codebase to understand how different components interact with each 
other. Pay attention to the structure of modules, services, and controllers.
4. **Use TypeScript Features**: Leverage TypeScript features such as interfaces, types, and decorators to enhance your understanding of the code. This will help you grasp the data structures and the flow of data within the application.
5. **Review Documentation**: Check for any existing documentation or comments within the codebase. This can provide valuable insights into the purpose and functionality of different components

6. **Log Changes**: Any prompt written to the ai agent shall be logged into the `ai_logs` folder under the file names <today_date_utc>.md (if this file does not exists you should create it),this file  shall include the prompt text, the user who wrote it derived from the git author name and  the main files changes and a highlights of the changes and the lines contrainsts that were changed , this process is crucial for debugging and tracking changes.
7. **Code Documentation**: Document any implemented methods or created files using jsDoc comments , including examples folders overveiws method descriptions and parameter explanations. This will help maintain clarity and understanding of the codebase.
8. **Follow Best Practices**: Adhere to best practices in coding, such as writing clean, maintainable code, using meaningful variable names, and following the project's coding standards.
