# FullStack_Developer_Project
# Server Generator from JSON Configuration

## Overview

This project dynamically generates a Node.js Express server based on a JSON configuration file. The script reads the configuration, sets up middleware, defines routes, and writes a `server.js` file.

## Features

- **Dynamic Server Generation**: Reads a JSON file to generate API endpoints.
- **Middleware Support**: Includes authentication, admin authorization, and logging.
- **Error Handling**: Handles invalid configurations and missing routes.

## Installation

1. **Clone the Repository:**
   ```sh
   git clone (https://github.com/Chirag-Tank1971/FullStack_Developer_Project.git)
   cd FullStack_Developer_Project
   ```
2. **Install Dependencies:**
   ```sh
   npm install express cors fs path
   ```

## Usage

1. \*\*Modify \*\***`config.json`**
   Define API routes and middleware in `config.json`.
   ```json
   {
     "nodes": [ 
    {
        "id": "1", "name": "Start", "source": null, "target": "2", "properties": {"type": "entry"}
    }, 
    {
        "id": "2", "name": "CORS Middleware", "source": "1", "target": "3", "properties": {"type": "middleware", "allowed_origins": ["*"]}
    }, 
    {
        "id": "3", "name": "Auth Middleware", "source": "2", "target": ["4", "5", "6", "7"], "properties": {"type": "middleware", "auth_required": true}
    }, 
    {
        "id": "4", "name": "Login Route", "source": "3", "target": "8", "properties": {"endpoint": "/login", "method": "POST"}
    }, 
    {
        "id": "5", "name": "Signup Route", "source": "3", "target": "9", "properties": {"endpoint": "/signup", "method": "POST"}
    }, 
    {
        "id": "6", "name": "Signout Route", "source": "3", "target": "10", "properties": {"endpoint": "/signout", "method": "POST"}
    }, 
    {
        "id": "7", "name": "Admin Auth Middleware", "source": "3", "target": "9", "properties": {"type": "middleware", "admin_required": true}
    }, 
    {
        "id": "8", "name": "User Route", "source": "4", "target": "12", "properties": {"endpoint": "/user", "method": "GET"}
    }, 
    {
        "id": "9", "name": "Admin Route", "source": "7", "target": "13", "properties": {"endpoint": "/admin", "method": "GET"}
    }, 
    {
        "id": "10", "name": "Logging Middleware", "source": "5", "target": ["12", "13", "14"], "properties": {"type": "middleware", "log_requests": true}
    }, 
    {
        "id": "11", "name": "Home Page", "source": "2", "target": "14", "properties": {"endpoint": "/home", "method": "GET", "auth_required": false}
    }, 
    {
        "id": "12", "name": "About Page", "source": "2", "target": "14", "properties": {"endpoint": "/about", "method": "GET", "auth_required": false}
    }, 
    {
        "id": "13", "name": "News Page", "source": "2", "target": "14", "properties": {"endpoint": "/news", "method": "GET", "auth_required": false}
    }, 
    {
        "id": "14", "name": "Blogs Page", "source": "2", "target": "15", "properties": {"endpoint": "/blogs", "method": "GET", "auth_required": false}
    }, 
    {
        "id": "15", "name": "Response Dispatcher", "source": ["10", "11", "12", "13", "14"], "target": "16", "properties": {"type": "dispatcher"}
    }, 
    {
        "id": "16", "name": "End", "source": "15", "target": null, "properties": {"type": "exit"}
    } 
  ]
   }
   ```
2. **Run the Server Generator:**
   ```sh
   node generateServer.js
   ```
3. **Start the Generated Server:**
   ```sh
   node server.js
   ```

## Middleware

- **Auth Middleware:** Ensures requests include a valid Bearer token.
- **Admin Middleware:** Restricts access to certain routes.
- **Logger Middleware:** Logs API requests.

## API Endpoints (Example)

| Method | Endpoint | Middleware   |
| ------ | -------- | ------------ |
| POST   | `/login` | None         |
| GET    | `/admin` | Auth & Admin |

## Error Handling

- If `config.json` is invalid, the script will show an error message.
- If an unknown route is requested, the server responds with `404 Not Found`.

## Notes

- Ensure `config.json` follows the correct structure.
- Modify middleware logic as needed in `generateServer.js`.

## License

This project is open-source and free to use.

                                                             Created by Chirag Tank

