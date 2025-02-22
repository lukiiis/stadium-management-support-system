# Stadium Management Support System
Stadium Management Support System is a comprehensive application that enables users to book stadium facilities, organize tournaments, and manage user accounts. It includes both web and mobile apps, integrated with a REST API server.

## Table of contents

1. [Key Features](#key-features)
2. [Technologies](#usedtechnologies)
3. [Presentation](#presentation)

## Key Features

- **Facility Reservations** – Users can book different parts of the stadium (e.g., track, field) for specific dates and time slots.  
- **Tournament Management** – Users with higher privilege level can create, edit, and manage sports tournaments, while registered users can join or leave tournaments.  
- **User Roles & Permissions** – The system defines four main user roles with different access levels:  
  - **Guest** – Can browse available reservations and upcoming tournaments but cannot make bookings.  
  - **Client** – Can register, log in, book stadium facilities, manage their reservations, join tournaments, and view their booking history.  
  - **Employee** – Can manage reservation schedules, create and update tournament details.  
  - **Administrator** – Has full system access, including user management (e.g., creating employee accounts, promoting employees to administrators, and blocking/unblocking users).  
- **Authentication & Security** – Secure user authentication via login and role-based access control.  
- **Multi-Platform Support** – Available as a responsive web application and a mobile application for easy access.  
- **User-Friendly Interface** – Designed for an intuitive and seamless experience across different devices. 

## Technologies

### Database  

- **PostgreSQL** – A powerful, open-source relational database used to store data about users, reservations, tournaments, and stadium facilities. PostgreSQL was chosen for its advanced querying capabilities, scalability, and support for complex relationships between data tables.  

### Backend  

- **C# with ASP.NET Core** – The server-side logic is built with ASP.NET Core, which provides a fast and secure REST API. It handles business logic, user authentication (JWT tokens), and database operations using Entity Framework Core for Object-Relational Mapping.  
- **Entity Framework Core** – Simplifies data access by mapping database tables to C# classes, allowing seamless interaction with PostgreSQL.  

### Web Application  

- **React with TypeScript** – The web app is built with React for creating dynamic, component-based UIs and TypeScript for static type-checking, which enhances code reliability and maintainability.  
- **Material UI (MUI)** – Provides pre-built, customizable React components for creating a modern, responsive user interface.  
- **TanStack Query** – Handles data fetching, caching, and synchronization with the REST API, ensuring smooth and optimized communication between the client and server.  
- **React Hook Form** – Used for managing forms and validations, keeping the code minimal and efficient.  
- **Sass** – Extends CSS with variables, nested rules, and mixins, making it easier to manage complex styles.  

### Mobile Application  

- **React Native with Expo** – The mobile app is built using React Native, allowing cross-platform development for both Android and iOS. Expo simplifies the setup, development, and testing processes.  
- **NativeWind** – Integrates Tailwind CSS styling into React Native for fast and consistent UI design.  

## Presentation

### Web application



### Mobile application

