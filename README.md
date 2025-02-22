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

### Web app

#### Home page

![1](https://github.com/user-attachments/assets/74a52e30-73b1-4726-a5d8-ac5a65a9464f)

![2](https://github.com/user-attachments/assets/f3acf763-9cdb-4012-b849-4957da65bf0c)

#### Login page

![3](https://github.com/user-attachments/assets/5dabade2-acc4-4243-bdd5-d3780d508efa)

#### Register page

![4](https://github.com/user-attachments/assets/01e494b2-427c-4d93-9334-01ccce2450cd)

#### Reservations

![5](https://github.com/user-attachments/assets/e23c57e9-34cc-4eeb-a37f-2def0a5ff906)

#### Tournaments

![tourn](https://github.com/user-attachments/assets/f739fbd7-97b5-4f40-b8cf-aba3acc4d3cf)

#### Facilities

![obj](https://github.com/user-attachments/assets/e307e012-c40f-492b-abd7-64da5a8e4634)


#### Dashboards

![client_dashboard](https://github.com/user-attachments/assets/318ed52a-ffae-4b47-88b8-2b09b6bb475b)

![adm_dashboard](https://github.com/user-attachments/assets/36deb400-ce05-4772-bf03-c443fc4256a3)

![empl_dashboard](https://github.com/user-attachments/assets/8115872a-eeb0-48bf-b67d-3fc802cfa02f)


### Mobile app

#### Home screen

![mobile1](https://github.com/user-attachments/assets/5cbbfbf6-fc56-4d8f-8e2b-c57844f7d586)

#### Login screen

![mobile2](https://github.com/user-attachments/assets/0738530b-424e-4bae-a16f-b9ec1cb9485a)

#### Creating reservation

![mobile3](https://github.com/user-attachments/assets/46034028-6de2-453b-a55f-fa877ed4846a)

#### Tournaments screen

![mobile4](https://github.com/user-attachments/assets/b58a7bc5-ba8c-49a2-a221-f0477ab3c66a)

#### Client dashboard

![mobile5](https://github.com/user-attachments/assets/59610c40-c7a6-4097-b246-b2303f55496d)

![mobile6](https://github.com/user-attachments/assets/0dda78a2-2b45-45f9-8369-e1253b9af120)

![mobile7](https://github.com/user-attachments/assets/a0d56329-c2a7-430b-999f-8c33d70e7751)

![mobile8](https://github.com/user-attachments/assets/2c302e0d-6d24-4b33-bef0-a042051ea988)


