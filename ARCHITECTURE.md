Coloque o `ARCHITECTURE.md` na **raiz do projeto**, no mesmo nível do `README.md` e do `package.json`.

Fica assim:

```text
pirate-battle/
├── README.md
├── ARCHITECTURE.md
├── package.json
├── playwright.config.ts
├── vite.config.ts
├── tsconfig.json
├── src/
├── public/
└── tests/
```

Isso é melhor porque o avaliador abre o repositório e já encontra os dois documentos principais logo de cara.

No `README.md`, você já pode deixar uma referência para ele, por exemplo:

```md
For a more detailed explanation of the project structure and architectural decisions, see:

[ARCHITECTURE.md](./ARCHITECTURE.md)
```

E agora podemos criar o conteúdo dele.

Use este `ARCHITECTURE.md`:

```md
# Pirate Battle Architecture

This document describes the main architectural decisions used in Pirate Battle.

The project was developed with a clear separation between:

- React application flow
- PixiJS game rendering
- Game entities
- Game systems
- Data fetching
- Mock API
- Persistence
- Automated testing

---

## 1. High-Level Architecture

The project is divided into two main layers:

```text
React Application Layer
        ↓
Game Integration Layer
        ↓
PixiJS Game Layer
```

React is responsible for application screens, navigation, options, ranking, match history and result screens.

PixiJS is responsible for rendering and updating the actual game simulation.

---

## 2. Application Flow

The main application flow is controlled by `App.tsx`.

```text
App.tsx
│
├── MainMenu
│
├── Game
│   ├── GameCanvas
│   └── TouchControls
│
├── Result
├── Options
├── Ranking
└── MatchHistory
```

Instead of placing all application logic inside the game canvas, React controls which screen is currently visible.

This keeps UI navigation separated from game simulation.

---

## 3. React and PixiJS Integration

The `GameCanvas.tsx` component is responsible for creating and managing the PixiJS `Application`.

It acts as the bridge between React and the game engine.

The communication works through props and callbacks.

Example:

```text
React
  ↓
GameCanvas
  ↓
PixiJS Simulation
```

When the game ends:

```text
PixiJS
  ↓
GameCanvas
  ↓
onGameEnd(result)
  ↓
React
  ↓
Result Screen
```

This avoids coupling the PixiJS game loop directly to React screen navigation.

---

## 4. Game Loop

PixiJS provides the main ticker used by the game.

The game loop updates:

- Timer
- Enemy spawning
- Player movement
- Enemy movement
- Weapon cooldowns
- Projectiles
- Collisions
- Combat
- Game-over conditions

Simplified flow:

```text
Ticker
  ↓
Check pause
  ↓
Update timer
  ↓
Update spawn system
  ↓
Update player
  ↓
Update enemies
  ↓
Update projectiles
  ↓
Check collisions
  ↓
Check game-over conditions
```

When the game is paused, the simulation returns early and does not continue updating gameplay systems.

---

## 5. Entities

Game entities are located in:

```text
src/game/entities/
```

### Player

Responsible for:

- Player ship sprite
- Health
- Collision radius
- Health bar
- Damage visual feedback

### Enemy

Represents both enemy types:

- Chaser
- Shooter

Each enemy contains:

- Health
- Speed
- Collision radius
- Type
- Health bar

### Projectile

Represents cannon projectiles.

A projectile contains:

- Speed
- Damage
- Lifetime
- Collision radius
- Owner

Projectile owners can be:

```text
player
enemy
```

This allows the collision system to determine who can be damaged by each projectile.

### Island

Represents a static arena obstacle.

The player, enemies and projectiles respect island collision.

---

## 6. Enemy AI

Two enemy behaviors are implemented.

### Chaser

The Chaser calculates the direction between itself and the player and continuously moves toward the player.

```text
Chaser
   ↓
Calculate player direction
   ↓
Rotate toward player
   ↓
Move toward player
   ↓
Check collision
```

When the Chaser collides with the player:

- The player receives damage
- The Chaser is destroyed
- An explosion is created

### Shooter

The Shooter also calculates the direction toward the player.

However, it only approaches while outside its configured attack range.

```text
Shooter
   ↓
Player outside attack range?
   │
   ├── Yes → move toward player
   │
   └── No → stop and fire
```

The Shooter uses a cooldown to control firing frequency.

---

## 7. Spawn System

Enemy creation is handled through `SpawnSystem`.

Location:

```text
src/game/systems/SpawnSystem.ts
```

The system controls the interval between enemy spawns.

Spawn positions are validated before creating an enemy.

The system avoids spawning:

- Too close to the player
- Inside the island

The first enemies are deterministic for easier gameplay validation:

```text
1st enemy → Chaser
2nd enemy → Shooter
Next enemies → Random
```

---

## 8. Input System

Keyboard input is centralized through:

```text
src/game/systems/InputSystems.ts
```

The system maintains currently pressed keys.

Examples:

```text
W → Move forward
S → Move backward
A → Rotate left
D → Rotate right
Space → Front cannon
Q → Left broadside
E → Right broadside
ESC → Pause
```

The game checks input state during each frame instead of depending directly on individual key events for gameplay movement.

---

## 9. Touch Controls

Touch controls are implemented as a React component:

```text
src/components/TouchControls.tsx
```

The component sends a control state to `GameCanvas`.

Example:

```text
TouchControls
      ↓
TouchControlsState
      ↓
GameCanvas
      ↓
Same movement/shooting logic
```

Keyboard and touch therefore share the same game actions.

This avoids duplicating movement and combat logic.

---

## 10. Combat System

The main combat flow includes:

```text
Player fires
   ↓
Projectile created
   ↓
Projectile updated every frame
   ↓
Collision detected
   ↓
Enemy takes damage
   ↓
Enemy health <= 0?
   ↓
Explosion + score
```

Enemy projectiles follow a similar flow:

```text
Shooter fires
   ↓
Enemy projectile
   ↓
Player collision
   ↓
Player takes damage
```

---

## 11. Health and Damage Feedback

The player and enemies have health bars.

The player's health bar changes according to health percentage:

```text
Healthy  → Green
Damaged  → Amber
Critical → Red
```

When the player reaches critical health, additional visual and audio feedback is triggered.

This helps communicate game state without requiring text messages.

---

## 12. Pause System

The game supports manual and automatic pause.

### Manual pause

```text
ESC
```

### Automatic pause

Triggered when:

- Browser tab becomes hidden
- Browser window loses focus
- User switches applications

The game does not automatically resume when focus returns.

The player must explicitly resume the game.

While paused:

- Timer stops
- Enemy movement stops
- Projectile movement stops
- Weapon cooldowns stop
- Spawning stops

---

## 13. Audio Architecture

Audio is centralized through:

```text
src/game/audio/AudioManager.ts
```

The `AudioManager` is responsible for:

- Playing sound effects
- Playing looping sounds
- Managing volume
- Stopping loops
- Cleaning up audio resources

Example:

```text
Game Event
   ↓
AudioManager
   ↓
Audio Asset
```

This avoids creating unrelated audio logic across multiple gameplay systems.

---

## 14. Settings Persistence

Game settings are stored using browser Local Storage.

Storage key:

```text
pirate-battle-settings
```

Stored settings include:

- Match duration
- Volume
- Difficulty preset

The game reads these settings when a new match starts.

---

## 15. Match Results

When the match ends, `GameCanvas` generates a typed `GameResult`.

Example structure:

```ts
{
  score,
  reason,
  duration,
  remainingTime,
  endedAt
}
```

The result is passed back to React using:

```text
onGameEnd(result)
```

React then changes the application screen to the Result page.

This keeps game simulation and UI navigation separate.

---

## 16. Data Layer

The project uses:

- Axios
- TanStack Query
- MSW

The data flow is:

```text
React Page
   ↓
TanStack Query
   ↓
API Function
   ↓
Axios
   ↓
MSW
```

---

## 17. Axios

Axios is configured in:

```text
src/api/api.ts
```

It provides a centralized HTTP client for the application.

API functions are separated by responsibility.

Example:

```text
matchApi.ts
rankingApi.ts
```

---

## 18. TanStack Query

TanStack Query manages asynchronous server state.

It is responsible for:

- Loading states
- Error states
- Cache
- Refetching
- Query invalidation

Example:

```text
Match completed
   ↓
POST /api/matches
   ↓
Mutation success
   ↓
Invalidate ranking
   ↓
Invalidate match history
```

This ensures that Ranking and Match History are updated after a match finishes.

---

## 19. MSW Mock API

The project uses Mock Service Worker to simulate a backend API.

Handlers are located in:

```text
src/mocks/handlers.ts
```

Available endpoints include:

```text
GET /api/matches
POST /api/matches
GET /api/ranking
```

MSW allows the frontend architecture to behave as if it were communicating with a real backend.

---

## 20. Network States

The mock API supports scenarios such as:

- Loading
- Success
- Empty data
- Server error
- Slow network

This allows Ranking and Match History pages to display proper UI states.

---

## 21. Match Persistence

Mock match data is stored locally in the browser.

This allows the Ranking and Match History screens to retain information during local usage.

Duplicate match protection is based on the unique match completion timestamp.

---

## 22. Testing Architecture

End-to-end testing is implemented with Playwright.

Tests are stored in:

```text
tests/
```

Current E2E coverage includes:

```text
Main Menu
Options
Ranking
Match History
Game completion
```

The current test suite contains:

```text
5 tests
```

All tests currently pass.

---

## 23. Build

The application uses Vite for development and production builds.

Production build:

```bash
npm run build
```

The build process performs:

```text
TypeScript compilation
        ↓
Vite production build
        ↓
dist/
```

The project currently builds successfully.

---

## 24. Folder Structure

```text
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
```

---

## 25. Design Decisions

### Why React?

React is used for:

- Application navigation
- Menus
- Options
- Ranking
- Match History
- Result UI
- Touch controls

These elements are more naturally implemented as regular UI components.

### Why PixiJS?

PixiJS is used for:

- Game rendering
- Sprites
- Animated effects
- Real-time movement
- Game loop
- Collision-based gameplay

This keeps high-frequency rendering outside the normal React rendering lifecycle.

### Why separate React and PixiJS?

React and PixiJS solve different problems.

The architecture allows:

```text
React → Application state

PixiJS → Real-time game simulation
```

The `GameCanvas` component works as the integration boundary between both systems.

---

## 26. Known Limitations

The project was developed under a technical challenge deadline.

Some systems were intentionally simplified.

### Enemy navigation

Enemy navigation uses simple collision prevention.

Advanced pathfinding such as A* or navigation meshes was not implemented.

### Mock backend

Ranking and Match History currently use MSW and Local Storage instead of a real backend.

The API layer was designed so that the mock implementation could later be replaced by a real HTTP service.

### Performance

The current production build generates a bundle-size warning for one of the JavaScript chunks.

The application still builds successfully, but future improvements could include route-level code splitting and additional asset optimization.

---

## 27. Future Improvements

Possible future improvements include:

- Advanced pathfinding
- Additional enemy types
- Multiple maps
- Additional islands
- Ship selection
- Power-ups
- More animations
- Online leaderboard
- Real backend
- User authentication
- Additional audio variations
- More automated tests
- Additional performance optimizations