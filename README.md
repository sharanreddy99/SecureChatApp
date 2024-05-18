<p align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">SECURECHAT</h1>
</p>
<p align="center">
    <em>Application which can schedule messages and emails!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/commit-activity/m/sharanreddy99/securechat" alt="last-commit">
	<img src="https://img.shields.io/github/created-at/sharanreddy99/securechat" alt="created_at">
   <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/sharanreddy99/securechat">
   <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/sharanreddy99/securechat">
   <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/sharanreddy99/securechat">

</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br><!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
</details>
<hr>

##  Overview

SecureChat is a sophisticated software project designed to provide a secure and streamlined chat application experience. Leveraging a robust architecture consisting of MongoDB, React frontend, Node.js backend, and NGINX orchestrated through Docker Compose, SecureChat ensures seamless communication and deployment. The frontend integrates key technologies such as React, Firebase, Axios, and Socket.IO, enhancing user interactions while maintaining scalability. Noteworthy components like datetime.bat facilitate precise timestamp handling across the system, enhancing reliability and consistency. By focusing on security and performance, SecureChat aims to deliver a top-tier chat application that prioritizes user privacy and ease of use.

---

##  Features

|    |   Feature         | Description |
|----|-------------------|---------------------------------------------------------------|
| ⚙️  | **Architecture**  | Built with a frontend React app, Node.js backend, MongoDB, and NGINX in Docker Compose. Environment variables and volumes set up for seamless communication and deployment. |
| 🔩 | **Code Quality**  | Codebase includes ESLint configurations for code quality checks. |
| 📄 | **Documentation** | Limited documentation available; some basic explanations in code files. |
| 🔌 | **Integrations**  | Integrates React, Firebase, Axios, Socket.IO, Bootstrap, and more. |
| 🧩 | **Modularity**    | Codebase structure provides some modularity for reusability. |
| 🧪 | **Testing**       | Utilizes Jest for testing. |
| ⚡️  | **Performance**   | Efficiency and resource usage not explicitly mentioned. |
| 🛡️ | **Security**      | Uses some security measures like simple-encryptor and CORS for data protection and access control. |
| 📦 | **Dependencies**  | Key dependencies include React, Node.js, MongoDB, NGINX, Socket.IO, etc. |
| 🚀 | **Scalability**   | Scalability capabilities not explicitly discussed. |

---

##  Repository Structure

```sh
└── securechat/
    ├── README.md
    ├── backend
    │   ├── .dockerignore
    │   ├── .gitignore
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── datetime.bat
    │   ├── package-lock.json
    │   ├── package.json
    │   └── src
    ├── docker-compose.yml
    ├── frontend
    │   ├── .dockerignore
    │   ├── .gitignore
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── debug.log
    │   ├── generate-react-cli.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   └── src
    └── nginx
        ├── Dockerfile
        └── default.conf
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                                 | Summary                                                                                                                                                                                                                                                                |
| ---                                                                                                  | ---                                                                                                                                                                                                                                                                    |
| [docker-compose.yml](https://github.com/sharanreddy99/securechat.git/blob/master/docker-compose.yml) | Defines service configuration for MongoDB, frontend React app, Node.js backend, and NGINX in Docker Compose. Sets up containers with environment variables and volumes, ensuring seamless communication and deployment across the SecureChat application architecture. |

</details>

<details closed><summary>frontend</summary>

| File                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---                                                                                                                     | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [package-lock.json](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/package-lock.json)             | Code SummaryThe `datetime.bat` file in the `backend` directory of the repository `securechat` serves as a utility script for managing date and time operations within the backend infrastructure of the secure chat application. This script plays a critical role in ensuring accurate timestamp handling and synchronization across various components of the system. By leveraging this script, the application can effectively manage time-related functionalities, enhancing the overall reliability and consistency of the secure chat platform. |
| [Dockerfile](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/Dockerfile)                           | Builds frontend image for SecureChat app using Node.js, copying files, and installing npm dependencies to run the application. Prepares for deployment within the SecureChat project architecture.                                                                                                                                                                                                                                                                                                                                                     |
| [package.json](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/package.json)                       | Defines React, Firebase, Axios, Socket.IO integration, Bootstrap, and more. Includes start, build, test scripts, and ESLint configuration for consistent development across the SecureChat repository.                                                                                                                                                                                                                                                                                                                                                 |
| [generate-react-cli.json](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/generate-react-cli.json) | CSS preferences, TypeScript usage, and component structure. Enhances development by enabling CSS modules and customizing component creation with optional features like styling, testing, and storybooks.                                                                                                                                                                                                                                                                                                                                              |

</details>

<details closed><summary>frontend.public</summary>

| File                                                                                                       | Summary                                                                                                                                                                                                                                                         |
| ---                                                                                                        | ---                                                                                                                                                                                                                                                             |
| [manifest.json](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/public/manifest.json) | Defines manifest attributes for a React app. Specifies app name, icons, start URL, display mode, theme, and background color. Supports apps visual representation and behavior for seamless user experience integration within parent repositorys architecture. |
| [robots.txt](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/public/robots.txt)       | Defines web crawler permissions; ensures search engine accessibility in frontend.                                                                                                                                                                               |
| [index.html](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/public/index.html)       | Defines the static structure and initial content for the Secure Chat web application landing page. Sets up metadata, icons, and initial script references for the app, ensuring proper functionality and design coherence.                                      |

</details>

<details closed><summary>frontend.src</summary>

| File                                                                                                          | Summary                                                                                                                                                                                                                                                                                                                |
| ---                                                                                                           | ---                                                                                                                                                                                                                                                                                                                    |
| [index.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/index.js)                 | Initiates React rendering, handles global state using StateProvider and reducer, for frontend interaction. rending, Handles global state for frontend using StateProvider with a reducer.                                                                                                                              |
| [App.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/App.css)                   | Defines color palette variables for theming frontend UI elements like logo, notifications, messages, and modals. Ensures consistent styling across the app for a cohesive user experience.                                                                                                                             |
| [App.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/App.js)                     | Enables frontend routing and data fetching in React app. Sets base URL for API requests. Integrates RouterSetup component for navigation. Synergizes with backend API for dynamic content display.                                                                                                                     |
| [StateProvider.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/StateProvider.js) | Enables global state management for React components by providing a context and a custom hook to access and update shared data. Facilitates centralized data handling in the frontend part of the repositorys architecture.                                                                                            |
| [index.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/index.css)               | Implements global styling settings for the frontend interface. Establishes consistent visual presentation across components in the web application. Essential in maintaining a cohesive user experience within the securechat repository.                                                                              |
| [RouterSetup.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/RouterSetup.js)     | Defines routes and renders corresponding components within a React application, managing navigation structure. As part of the frontend architecture of the repository, it enables seamless user interaction by directing to key sections like login, dashboard, messages, and more using React Router functionalities. |
| [firebase.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/firebase.js)           | Enables Firebase authentication and database access for the frontend in the securechat repository. Configures Firebase SDK with environment variables and exports authentication, Google provider, and Firestore database instances for secure chat functionality.                                                     |
| [reducer.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/reducer.js)             | Defines initial state and actions for user management in React. Implements a reducer to handle setting and removing user information. Intended to manage user state efficiently within the frontend architecture of the SecureChat repository.                                                                         |

</details>

<details closed><summary>frontend.src.components.Connections</summary>

| File                                                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                                | ---                                                                                                                                                                                                                                                                                                                                     |
| [Connections.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Connections/Connections.css) | Styles the Connections component for different devices to ensure responsive design. Sets layouts, sizes, and styles based on screen sizes, enhancing user experience on phones, tablets, and desktops. Maintains consistent visual appeal and usability across various devices within the securechat repositorys frontend architecture. |
| [Connections.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Connections/Connections.js)   | Manages user connections, allowing adding, removing, accepting, and rejecting requests. Displays incoming connection requests for quick action. Handles modals for user feedback. Supports seamless interaction within the frontend, enhancing user engagement on the platform.                                                         |

</details>

<details closed><summary>frontend.src.components.GroupMessages</summary>

| File                                                                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                                              | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [GroupMessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/GroupMessages.js)           | The `GroupMessages.js` file within the `frontend/src/components/GroupMessages` directory of the repository plays a crucial role in managing group messaging functionality in the frontend of the application. It leverages React for dynamic UI rendering and integrates with backend services via Axios for data retrieval. Additionally, it utilizes Socket.IO for real-time communication and incorporates various modals for enhanced user interaction, including EmojiPickerModal, TemplateModal, TimerModal, CreateGroupModal, DeleteGroupModal, and AddMembersModal. The file also employs external libraries like jQuery and DateFormat to enhance the user experience further. |
| [GroupMessages.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/GroupMessages.css)         | Frontend/`The code in the `frontend/` directory of the `securechat` repository serves as the front end component of the application. It is responsible for providing a user-friendly interface for interacting with the backend services. By leveraging technologies like React, this code facilitates smooth user interactions and ensures a seamless experience for users accessing the SecureChat platform.                                                                                                                                                                                                                                                                          |
| [TimerModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/TimerModal.js)                 | Enables scheduling delayed messages within group chats. Allows users to pick a future date and time for the message to be sent. Displays feedback on the message delivery status through a modal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [DeleteMessageModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/DeleteMessageModal.js) | Enables deleting messages in a group chat, updating message list dynamically. Utilizes React, React-Bootstrap, axios for API calls. Maintains user-friendly modal design. Facilitates seamless user experience within the group messaging feature of the securechat repository.                                                                                                                                                                                                                                                                                                                                                                                                         |
| [UpdateMessageModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/UpdateMessageModal.js) | Enables updating group messages with sender email verification. Handles message edits, deletions, and closing modals. Supports React Router integration and dynamic message updates. Facilitates seamless communication within the Secure Chat application.                                                                                                                                                                                                                                                                                                                                                                                                                             |

</details>

<details closed><summary>frontend.src.components.GroupMessages.Modals</summary>

| File                                                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                        |
| ---                                                                                                                                                     | ---                                                                                                                                                                                                                                                                                                            |
| [RemoveMembersModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/RemoveMembersModal.js) | Enables removing group members with a clean UI in the app. Dynamically updates member list with style customization. Handles member removal requests and displays success/failure messages in a modal. Enhances user engagement by providing a seamless experience within the parent repositorys architecture. |
| [CreateGroupModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/CreateGroupModal.js)     | Enables creating a new group with name and image URL input validations, triggering success/error pop-ups. Intended for creating interactive group creation modals in the frontend of the SecureChat repository.                                                                                                |
| [DeleteGroupModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/DeleteGroupModal.js)     | Manages deletion confirmation for groups, ensuring user authorization and feedback in the frontend. Prompts users to enter group name for deletion verification and displays status messages. Enables secure group deletion functionality.                                                                     |
| [AddMembersModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/AddMembersModal.js)       | Enables adding members to a group chat via a modal. Handles member selection and displays success or error messages. Integrates with backend via axios for seamless group membership management in the frontend.                                                                                               |
| [RemoveAdminsModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/RemoveAdminsModal.js)   | Manages modal for converting admins to members in a group. Allows selection of members, role update, and error handling. Supports dynamic styling and feedback through an embedded TemplateModal component.                                                                                                    |
| [CreatePollModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/CreatePollModal.js)       | Enables creating polls with names, descriptions, and deadlines, displaying result modals. Integrates with the backend for creating and notifying groups. Handles user input validation and submission.                                                                                                         |
| [MakeAdminsModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/MakeAdminsModal.js)       | Enables converting group members to admins by selecting from a list. Displays a modal with member selection, admin assignment, and status updates. Integrates with backend API for role updates.                                                                                                               |
| [ViewPollModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/ViewPollModal.js)           | Enables displaying poll results in a styled modal with close functionality. Uses React Bootstrap components and maps responses for a visual representation. Enhances user experience when viewing poll data within the frontend architecture of the repository.                                                |
| [GroupInfoModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/GroupMessages/Modals/GroupInfoModal.js)         | Enables visualization and management of group details within a modal interface. Facilitates viewing admins and members, exiting groups, and dynamically updating group information. Enhances user experience in accessing and interacting with group data seamlessly.                                          |

</details>

<details closed><summary>frontend.src.components.Emails</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                                 |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                                     |
| [Emails.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Emails/Emails.css)                       | Styles Email component for responsive emails layout across various device sizes in the frontend. Implements dynamic scaling and positioning to ensure optimal user experience on small to extra-large devices within the securechat repository architecture.            |
| [TimerModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Emails/TimerModal.js)                 | Enables sending delayed emails with chosen date and time. Handles form submissions and displays result modal. Integrates with backend API for email delivery. Resides in the frontend component Emails folder.                                                          |
| [DeleteMessageModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Emails/DeleteMessageModal.js) | Enables deletion of messages with confirmation modal. Deletes message via API call, updates UI with filtered data, and provides user feedback on action. Essential for maintaining data integrity and enhancing user experience in the frontend component architecture. |
| [Emails.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Emails/Emails.js)                         | Manages email operations such as sending, deleting, and organizing emails with modals for templates, emojis, and group creation. Displays inbox and sent emails, allowing users to interact efficiently with customized styling and robust functionality.               |

</details>

<details closed><summary>frontend.src.components.Emails.Modals</summary>

| File                                                                                                                                         | Summary                                                                                                                                                                                                                                                                                                                   |
| ---                                                                                                                                          | ---                                                                                                                                                                                                                                                                                                                       |
| [CreateGroupModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Emails/Modals/CreateGroupModal.js) | Enables creating email groups with custom names and recipients, facilitating group management. Implements dynamic styles and modals for user interaction. Integrates with backend endpoints for group creation and data retrieval. Streamlines group creation and updates UI in real-time for a seamless user experience. |
| [DeleteGroupModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Emails/Modals/DeleteGroupModal.js) | Enables deletion of email groups with dynamic UI updates. Utilizes React, React-Bootstrap, axios, and react-select for smooth interactivity. Implements graceful handling of deletions and permission issues, enhancing user experience.                                                                                  |

</details>

<details closed><summary>frontend.src.components.Dashboard</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                                                                        |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                                                                            |
| [Dashboard.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Dashboard/Dashboard.js)   | Manages real-time messaging interactions, displaying direct messages, group messages, and emails. Utilizes WebSocket for live updates and Axios for API calls. Dynamically updates message lists without page refresh. Enhances user experience by facilitating seamless communication within the application. |
| [Dashboard.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Dashboard/Dashboard.css) | Defines responsive styles for a dashboard interface on various devices, adjusting layout, sizes, and positioning. Enhances user experience by optimizing visual elements based on screen size, ensuring consistent presentation across different device types.                                                 |

</details>

<details closed><summary>frontend.src.components.Login</summary>

| File                                                                                                             | Summary                                                                                                                                                                                                                                                    |
| ---                                                                                                              | ---                                                                                                                                                                                                                                                        |
| [Login.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Login/Login.js)   | Enables user authentication and data retrieval upon Google sign-in. Sorts fetched data for displaying user connections, email connections, and groups on the SecureChat dashboard. Drive user interaction seamlessly from the login page to the dashboard. |
| [Login.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Login/Login.css) | Defines responsive styling for the login component in the frontend. Sets layout, sizing, and styling based on different device screen sizes to enhance user experience.                                                                                    |

</details>

<details closed><summary>frontend.src.components.PageTemplate</summary>

| File                                                                                                                                  | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                                                   | ---                                                                                                                                                                                                                                                                         |
| [PageTemplate.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/PageTemplate/PageTemplate.css) | Defines responsive styling for a page template in the frontend component. Adjusts layout based on device sizes for an optimal user experience.                                                                                                                              |
| [PageTemplate.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/PageTemplate/PageTemplate.js)   | Manages user authentication, fetches user connections, groups, and messages, and provides navigation handlers for SecureChats dashboard, connections, about page, and logout functionality. Displays the SecureChat logo, user options, and the current year in the footer. |

</details>

<details closed><summary>frontend.src.components.DirectMessages</summary>

| File                                                                                                                                              | Summary                                                                                                                                                                                                                                                                                         |
| ---                                                                                                                                               | ---                                                                                                                                                                                                                                                                                             |
| [TimerModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/DirectMessages/TimerModal.js)                 | Implements a delayed message feature allowing users to set a future date and time for sending messages. Integrates with the main applications frontend to enhance user communication capabilities with a simple and intuitive UI.                                                               |
| [DirectMessages.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/DirectMessages/DirectMessages.css)       | Defines responsive styling for Direct Messages component, enhancing user experience on various screen sizes. Ensures proper alignment, sizing, and interaction for chat elements across devices in the securechat frontend.                                                                     |
| [DeleteMessageModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/DirectMessages/DeleteMessageModal.js) | Implements deleting messages in a modal, updating UI and server data in the frontend. Maintains message state consistency and enhances user experience in the Direct Messages component of the parent repository.                                                                               |
| [UpdateMessageModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/DirectMessages/UpdateMessageModal.js) | Enables updating direct messages with modal interaction in the frontend of the securechat repository. Key features include message editing, cancellation, and dynamic UI updates.                                                                                                               |
| [DirectMessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/DirectMessages/DirectMessages.js)         | Manages real-time direct messaging features, including sending, updating, and deleting messages. Displays message history and enables interaction with user connections. Integrates socket.io for instant updates and axios for HTTP requests. Supports emoji selection and message scheduling. |

</details>

<details closed><summary>frontend.src.components.Modals</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                            |
| ---                                                                                                                                     | ---                                                                                                                                                                                                                                                                                                                |
| [TemplateModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Modals/TemplateModal.js)         | Creates a reusable modal component for displaying dynamic content with customizable title and body. Enhances user experience by providing a clean, styled interface in the frontend of the securechat app.                                                                                                         |
| [EmojiPickerModal.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Modals/EmojiPickerModal.css) | Defines responsive styles for emoji picker modal component across various device sizes to ensure optimal user experience. Controls dimensions, font sizes, colors, and visual effects based on device breakpoints for consistent display in different viewport environments within the frontend of the repository. |
| [EmojiPickerModal.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/Modals/EmojiPickerModal.js)   | Enables Emoji selection and insertion in modals, enhancing user messaging experience. Handles emoji input events, updates message content dynamically, and provides an intuitive interface for emoji selection. Complements frontend interactivity within the securechat repositorys architecture.                 |

</details>

<details closed><summary>frontend.src.components.AboutUs</summary>

| File                                                                                                                   | Summary                                                                                                                                                                                                                                   |
| ---                                                                                                                    | ---                                                                                                                                                                                                                                       |
| [AboutUs.js](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/AboutUs/AboutUs.js)   | Showcase team members profiles dynamically, enhancing user engagement. Photos and role details are displayed with links to their social profiles. Improves user interaction with the team, fostering a connection within the application. |
| [AboutUs.css](https://github.com/sharanreddy99/securechat.git/blob/master/frontend/src/components/AboutUs/AboutUs.css) | Defines styling for the About Us section in the frontend interface. Sets dimensions, alignments, and card layout properties to enhance visual presentation and user experience in the securechat app.                                     |

</details>

<details closed><summary>nginx</summary>

| File                                                                                           | Summary                                                                                                                                                                                                                                                                                                     |
| ---                                                                                            | ---                                                                                                                                                                                                                                                                                                         |
| [Dockerfile](https://github.com/sharanreddy99/securechat.git/blob/master/nginx/Dockerfile)     | Implements Nginx configuration for securechat repo.-Utilizes Alpine-based Nginx image.-Copies default.conf to Nginx conf.d.-Critical for serving frontend and reverse proxy setup.                                                                                                                          |
| [default.conf](https://github.com/sharanreddy99/securechat.git/blob/master/nginx/default.conf) | Establishes reverse proxy configuration for React frontend and Node.js backend services using NGINX. Routes API requests to Node server and serves frontend assets from React server. Facilitates seamless communication between frontend and backend components in the securechat repository architecture. |

</details>

<details closed><summary>backend</summary>

| File                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                               |
| [package-lock.json](https://github.com/sharanreddy99/securechat.git/blob/master/backend/package-lock.json) | This code file in the backend directory of the repository serves as the core logic for the secure chat application. It handles user authentication, message encryption, and secure data exchange between clients. This crucial component ensures end-to-end encryption for secure communication within the chat platform, maintaining privacy and data integrity. |
| [Dockerfile](https://github.com/sharanreddy99/securechat.git/blob/master/backend/Dockerfile)               | Initializes backend node environment, installs dependencies, copies and starts application.                                                                                                                                                                                                                                                                       |
| [package.json](https://github.com/sharanreddy99/securechat.git/blob/master/backend/package.json)           | Enables auto-restarting Node.js server using Nodemon. Manages backend dependencies crucial for chat app functionality. Facilitates real-time communication, file handling, and email notifications. Enhances server robustness and performance within the parent repository structure.                                                                            |
| [datetime.bat](https://github.com/sharanreddy99/securechat.git/blob/master/backend/datetime.bat)           | Outputs current date and time within the securechat repository. Aids backend functionality by providing a timestamp for various operations.                                                                                                                                                                                                                       |

</details>

<details closed><summary>backend.src</summary>

| File                                                                                         | Summary                                                                                                                                                                                                                                                 |
| ---                                                                                          | ---                                                                                                                                                                                                                                                     |
| [index.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/index.js) | Starts server with error handling, logging server & database details. Facilitates connection to frontend for a secure chat app.                                                                                                                         |
| [app.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/app.js)     | Orchestrates API routing and WebSocket connections for real-time chat within the backend. Utilizes Express, CORS, and Socket.IO to manage direct/group messages, users, emails, and server automation. Serves static files and fallbacks to index.html. |

</details>

<details closed><summary>backend.src.routers</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [directmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/routers/directmessages.js)   | Deletion, updates, sending, fetching, tracking unseen, marking as seen, and delaying messages. Encrypts text, filters profanity, and emits real-time updates using WebSocket.                                                                                                                                                                                                                                        |
| [emails.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/routers/emails.js)                   | Enables creating, deleting, and sending emails in specific groups. Manages email attachments and storage. Handles delayed email sending, retrieval, and deletion for a secure chat application. Organizes emails into groups and provides functionality for inbox management.                                                                                                                                        |
| [automaticserver.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/routers/automaticserver.js) | Automates message and email delivery scheduling, synchronizes delayed messages across direct and group chats, and sends emails with attachments. Employs cron jobs to execute tasks at scheduled intervals, enhancing communication efficiency in the SecureChat application.                                                                                                                                        |
| [users.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/routers/users.js)                     | Adds, accepts, removes connections, and fetches accepted user connections. Handles connection requests, updates, and deletions with error handling and modal notifications. Synchronizes data removal across associated models, triggering socket events for real-time updates.                                                                                                                                      |
| [groupmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/routers/groupmessages.js)     | The groupmessages.js file, located in the backend/src/routers directory, is an essential component of the SecureChat repository. It leverages Express to manage routes related to group messages, utilizing date formatting functionalities from the DateFormat library. Its core purpose lies in defining and handling API endpoints for group message interactions within the SecureChat application architecture. |

</details>

<details closed><summary>backend.src.miscellaneous</summary>

| File                                                                                                       | Summary                                                                                                                                                                   |
| ---                                                                                                        | ---                                                                                                                                                                       |
| [email.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/miscellaneous/email.js) | Enables email functionality for the backend, using Node.js along with Nodemailer to send emails securely. Configuration details are retrieved from environment variables. |

</details>

<details closed><summary>backend.src.db</summary>

| File                                                                                                  | Summary                                                                                                                                                                               |
| ---                                                                                                   | ---                                                                                                                                                                                   |
| [mongoose.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/db/mongoose.js) | Establishes MongoDB connection for the backend of the SecureChat app, utilizing Mongoose. Configures connection settings for efficient data handling, including indexing and parsing. |

</details>

<details closed><summary>backend.src.models</summary>

| File                                                                                                                            | Summary                                                                                                                                                                                                                                                     |
| ---                                                                                                                             | ---                                                                                                                                                                                                                                                         |
| [delaygroupmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/delaygroupmessages.js)   | Defines delay group message schema with Mongoose for backend data modeling in the securechat repository. Captures group messaging details for improved communication within the application.                                                                |
| [pollmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/pollmessages.js)               | Defines poll messages schema for MongoDB using Mongoose. Organizes poll ID and responses (yes/no) with required fields. Crucial for structuring and managing poll messages within the backend architecture.                                                 |
| [directmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/directmessages.js)           | Defines MongoDB schema for direct messages with text, sender/receiver emails, date/time, and seen status. It structures and models direct message data within the backend system of the Secure Chat repository.                                             |
| [delaydirectmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/delaydirectmessages.js) | Defines MongoDB schema for delayed direct messages in backend of SecureChat. Uses Mongoose to structure and model attributes like text, sender/receiver email, date, and time. Enables storing and retrieving of delayed messages for the chat application. |
| [emails.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/emails.js)                           | Defines MongoDB schema for emails with text, sender & receiver emails, attachments, subject, date, time. Tracks email status (seen, inbox status) and deletion status. Facilitates storage and retrieval of email data.                                     |
| [delayemails.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/delayemails.js)                 | Defines MongoDB schema for delayed emails with text, sender/receiver emails, attachments, subject, date/time, and status tracking. Supports storing email visibility status and deletion flags for both sent and inbox.                                     |
| [emailgroups.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/emailgroups.js)                 | Defines MongoDB schema for email groups, enforcing required fields. Integrates with Mongoose for modeling and exporting. Essential for managing email recipients within the backend architecture of the SecureChat repository.                              |
| [users.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/users.js)                             | Defines MongoDB schema for user data including display name, email, avatar URL, and connections with other users. Implements user model functionality for the SecureChat backend architecture.                                                              |
| [groupmessages.js](https://github.com/sharanreddy99/securechat.git/blob/master/backend/src/models/groupmessages.js)             | Defines MongoDB schema for group chat messages with essential fields like name, picture, members, and messages. Organized structure for storing group chat data in the backend architecture of the securechat repository.                                   |

</details>

---

##  Getting Started

###  Installation

<h4>From <code>source</code></h4>

> 1. Clone the securechat repository:
>
> ```console
> $ git clone https://github.com/sharanreddy99/securechat.git
> ```
>
> 2. Change to the project directory:
> ```console
> $ cd securechat
> ```
>

> 3. Run the project using docker compose
> ```console
> $ docker compose up
> ```

###  Usage


> Access the application in the browser at http://localhost

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/sharanreddy99/securechat.git/issues)**: Submit bugs found or log feature requests for the `securechat` project.
- **[Submit Pull Requests](https://github.com/sharanreddy99/securechat.git/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/sharanreddy99/securechat.git/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/sharanreddy99/securechat.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
   <a href="https://github.com/sharanreddy99/securechat.git/graphs/contributors">
      <img src="https://contrib.rocks/image?repo=sharanreddy99/securechat">
   </a>
</p>
</details>

---
