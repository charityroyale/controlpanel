# Charity Royale: Control Panel

An HTML5 stream overlay.

# Requirments

See `.nvmrc` for node version. (usually Node LTS)

Recommenend way: [nvm](https://github.com/nvm-sh/nvm)

# Setup

This monorepo consists of `backend`, `frontend` and `common` which shares sourcecode imported by `backend` and `frontend` located under `applications/`.  
Never import `backend` modules from `frontend` and vice versa to avoid cicular dependencies. Never import modules from `backend` and `frontend` in `common` package.

Run `npm install` from the root directory to install dependencies for each application.  
Run `npm run build:all` from the root directory to build each application at once.

Add and configure multiple `.env` files accordingly using `.env.example` templates .

# Environment variables

Create .env files in backend and frontend application directory (next to .env.example)

### Backend

see [.env.example](applications/backend/.env.example)

| variable             | description                                                                                           | example   |
| -------------------- | ----------------------------------------------------------------------------------------------------- | --------- |
| CLIENT_ID_SECRET     | a controlpanel related secret to generate a jwt token to create an access token for the rest services | secret123 |
| ACCESS_TOKEN_SECRET  | used to sign a jwt token for the rest api                                                             | secret456 |
| LOG_LEVEL            | used to specifcy backend logging debug level (not in use)                                             | info      |
| SOCKETIO_AUTH_SECRET | used to sign a jwt token for the socket connection (same as frontend)                                 | 123       |

### Frontend

see [.env.example](applications/frontend/.env.example)

| variable                           | description                                   | example                                              |
| ---------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| NEXT_PUBLIC_BACKEND_URL            | an absolute url to the backend rest api       | http://localhost:5200                                |
| MAIN_APPLICATION_PASSWORD          | the main password for main streamers          | password123                                          |
| COMMUNITY_APPLICATION_PASSWORD     | the community password for main streamers     | password456                                          |
| APPLICATION_SECRET                 | encryption key for passwords                  | someverylongsecretthatislongerthan32charactersplease |
| SOCKETIO_AUTH_SECRET               | used to sign socket payload (same as backend) | 123                                                  |
| NEXT_PUBLIC_MAW_DASHBOARD_BASE_URL | an absolute url to the current maw dashboard  | https://charityroyale.at                             |

# Local development

To run backend typescript compilation in watch mode use `npm run tsc:watch`
To run frontend with hot reloading use `npm run dev:frontend`

You can start each application from the root directory seperately by running `npm run start:frontend` and `npm run start:backend`.
The frontend is available at port `4200` and backend at `5200`,

# Docker

`docker-compose up --build`
`docker-compose up -d`

# Add new dependency

This repository uses `npm workspaces`. Npm workpaces allows developers to manage multiple packages to be managed from the root directory (e.g. local `@cp` namespace).
Therefore it is an absolute requirement to only install dependencies from the root directory.

Use `npm install <packagename> -w <workspace-name>` to install dependencies to one application located in `applications`.

# Docs

Tech Stack, Flow Chart and Presentation are located in [docs](docs).

# Charity Royale

https://charityroyale.at

# Primary contributer

https://hammertime.studio
