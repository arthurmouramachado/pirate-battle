# Pirate Battle

Pirate Battle is a 2D naval shooter game developed as a technical challenge for the **Junior Frontend Game Developer** position at Jungle Gaming.

The project was built with **React, TypeScript and PixiJS**, combining UI, game logic, mock APIs, persistence, responsive controls and end-to-end testing.

---

## About the Project

The main goal of Pirate Battle is to survive a naval battle for a limited amount of time while destroying enemy ships and increasing the player's score.

The game includes different enemy behaviors, shooting mechanics, collisions, health management, pause systems, mobile controls, match history and ranking.

### Main gameplay features

- Player movement and rotation
- Front cannon shooting
- Left and right broadside attacks
- Chaser enemy behavior
- Shooter enemy behavior
- Enemy spawning system
- Player and enemy health
- Collision with islands
- Projectile collisions
- Score system
- Match timer
- Game over conditions
- Pause and automatic pause
- Explosion effects
- Damage visual feedback
- Sound effects and ambience
- Touch controls for mobile devices

---

## Controls

### Keyboard

| Key | Action |
|---|---|
| `W` | Move forward |
| `S` | Move backward |
| `A` | Rotate left |
| `D` | Rotate right |
| `Space` | Fire front cannon |
| `Q` | Fire left broadside |
| `E` | Fire right broadside |
| `ESC` | Pause / Resume |
| `M` | Return to Main Menu while paused |

### Mobile

Touch controls are automatically displayed on mobile devices or smaller screens.

They include:

- Forward movement
- Backward movement
- Left rotation
- Right rotation
- Front cannon
- Left broadside
- Right broadside
- Pause

---

## Features

### Gameplay

The player controls a pirate ship inside a fixed arena.

Two enemy types are currently implemented:

### Chaser

The Chaser continuously moves toward the player.

When it collides with the player's ship:

- The player takes damage
- The enemy is destroyed
- An explosion effect is displayed

### Shooter

The Shooter approaches the player until reaching its attack range.

Once in range, it stops approaching and periodically fires projectiles toward the player.

Both enemies:

- Have health
- Rotate according to their movement or target
- Can be destroyed by player projectiles
- Respect island collision
- Spawn dynamically during the match

---

## Health System

The player has a limited amount of health.

The health bar changes depending on the current health level:

- Green: healthy
- Amber: damaged
- Red: critical

When the player's health becomes critical, visual damage feedback and a low-health sound are triggered.

Enemies also have individual health bars.

---

## Match System

Each match has a configurable duration.

Available durations:

- 1 minute
- 2 minutes
- 3 minutes

The match ends when:

- The timer reaches zero
- The player's health reaches zero

At the end of the match, the player is redirected to the Result screen.

The result contains:

- Final score
- Match duration
- Remaining time
- End reason

---

## Pause System

The game can be manually paused using:

```text
ESC

The game also automatically pauses when:
- The browser tab becomes hidden
- The browser window loses focus
- The player changes applications
Returning to the game does not automatically resume the simulation.
The player must explicitly resume the game.
While paused:
- Timer stops
- Enemy movement stops
- Projectiles stop
- Spawn timer stops
- Weapon cooldowns stop

````

 # Audio
The game includes an audio system centralized through an AudioManager.
Sound effects include:
- Cannon fire
- Broadside attacks
- Ship explosions
- Ship collisions
- Score feedback
- Pause
- Resume
- Game over
- Match completion
- Low health warning
- Ocean ambience
The game volume can be configured through the Options screen.

 Application Screens
The application contains the following screens:
- Main Menu
- Game
- Result
- Options
- Ranking
- Match History
The App.tsx component controls the current application screen.

 Options
The Options screen allows the player to configure:
- Match duration
- Volume
- Difficulty preset
Settings are persisted using:
localStorage

Storage key:
pirate-battle-settings

This means the selected settings remain available after refreshing or reopening the application.

 # Ranking
The Ranking screen displays the highest scores achieved by the player.
The ranking data flow is:
Ranking
   ↓
TanStack Query
   ↓
Axios
   ↓
Mock API
   ↓
MSW

The ranking displays up to the top 10 results.

# Match History
Every completed match is stored and can be viewed through the Match History screen.
Stored information includes:
- Score
- Match result
- Match duration
- Remaining time
- Completion date
Match history is ordered from the most recent match to the oldest one.

 Mock API
The project uses MSW — Mock Service Worker to simulate a backend API.
This allows the frontend to use realistic HTTP requests without requiring an external backend server.
Endpoints implemented:
GET /api/matches
POST /api/matches
GET /api/ranking

Axios is responsible for HTTP communication.
TanStack Query handles:
- Fetching
- Cache
- Loading states
- Error states
- Query invalidation
Network Scenarios
The MSW implementation supports different network scenarios such as:
- Success
- Empty response
- Server error
- Slow response
This makes it possible to test different UI states without changing the application architecture.

 ## Tech Stack
Frontend
- React
- TypeScript
- Vite
Game Rendering
- PixiJS
Data Fetching
- Axios
- TanStack Query
API Mocking
- MSW — Mock Service Worker
Testing
- Playwright
Persistence
- Browser Local Storage

 Architecture
The project separates React application responsibilities from game logic.
A simplified structure:
````
src/
│
├── api/
│   ├── api.ts
│   ├── matchApi.ts
│   ├── rankingApi.ts
│   └── types.ts
│
├── components/
│   ├── GameCanvas.tsx
│   ├── HUD.tsx
│   └── TouchControls.tsx
│
├── game/
│   │
│   ├── audio/
│   │   └── AudioManager.ts
│   │
│   ├── config/
│   │   └── gameConfig.ts
│   │
│   ├── entities/
│   │   ├── Player.ts
│   │   ├── Enemy.ts
│   │   ├── Projectile.ts
│   │   └── Island.ts
│   │
│   └── systems/
│       ├── InputSystems.ts
│       ├── SpawnSystem.ts
│       ├── CollisionSystem.ts
│       └── CombatSystem.ts
│
├── mocks/
│   ├── browser.ts
│   └── handlers.ts
│
├── pages/
│   ├── MainMenu.tsx
│   ├── Options.tsx
│   ├── Result.tsx
│   ├── Ranking.tsx
│   └── MatchHistory.tsx
│
├── App.tsx
└── main.tsx
````

For a more detailed explanation of the project structure and architectural decisions, see:
ARCHITECTURE.md

 # Running the Project
Requirements
Before running the project, make sure you have installed:
- Node.js
- npm
Clone the repository:
git clone https://github.com/arthurmouramachado/pirate-battle.git

Enter the project folder:
cd pirate-battle

Install dependencies:
npm install

Start the development server:
npm run dev

Open the URL shown by Vite in your browser.

 # Production Build
To generate a production build:
npm run build

The production files will be generated inside:
dist/

To locally preview the production build:
npm run preview

 ## Tests
The project includes end-to-end tests using Playwright.
Run the tests with:
npm run test:e2e

Run Playwright using the interactive UI:
npm run test:e2e:ui

Current test coverage includes:
- Main Menu
- Options
- Ranking
- Match History
- Game completion
Current result:
5 tests passed

 # Build Status
The production build was successfully generated using:
npm run build

Playwright E2E tests:
5 passed

 # Sobre o desenvolvimento
Este projeto foi desenvolvido como parte do processo seletivo para a vaga de Junior Frontend Game Developer da Jungle Gaming.
Durante o desenvolvimento, procurei separar as responsabilidades entre a interface React e a lógica do jogo em PixiJS.
Algumas decisões importantes foram:
- Separar entidades como Player, Enemy, Projectile e Island
- Criar sistemas específicos para input e spawn
- Centralizar sons através do AudioManager
- Utilizar callbacks entre React e PixiJS para controlar o fluxo de telas
- Utilizar MSW para simular uma API real
- Utilizar TanStack Query para controlar estados assíncronos
- Criar testes E2E utilizando Playwright
O objetivo foi manter o projeto organizado e ao mesmo tempo desenvolver uma experiência jogável dentro do prazo do desafio técnico.

 # Known Limitations
Some parts of the project were intentionally kept simple because this project was developed under a technical challenge deadline.
Examples:
- Enemy navigation uses simple collision prevention instead of advanced pathfinding
- Data is stored locally instead of using a real backend
- The ranking is based on local match data
- Advanced graphical optimization and code splitting could be improved further
These decisions were made to prioritize gameplay stability, architecture and completion of the required features.

# Possible Improvements
Future improvements could include:
- Advanced enemy pathfinding
- Additional enemy types
- More maps and islands
- Power-ups
- Multiple ships
- Online leaderboard
- Real backend integration
- Authentication
- Advanced animations
- More audio variations
- Improved mobile interface
- Additional automated tests
  
 # Author
Developed by Arthur Moura Machado
GitHub:
https://github.com/arthurmouramachado

 # Technical Challenge
This project was created for a technical evaluation process.
The main focus of the implementation was:
- Gameplay
- PixiJS integration
- React architecture
- TypeScript
- Data fetching
- Mock API
- Responsive interaction
- Testing
- Code organization

For a more detailed explanation of the project structure and architectural decisions, see:

[ARCHITECTURE.md](./ARCHITECTURE.md)
