## Block path finding game

```
npm install
npm start
```
A browser window will open [http://localhost:3000](http://localhost:3000) [^1].

#### Code structure
```
/
├──README.md
└── src/
    ├── App.tsx             // React app for the game UI
    ├── util.ts             // Shared typing, interfaces and constants
    └── models/
        ├── Grid.ts         // The main game engine
        └── Grid.test.ts    // And some tests for the engine

```

#### Running tests
```
npm test
```

[^1]: bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
