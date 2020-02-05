## Block path finding game
.
<img src="/public/icons/start.svg" width="70px" style="margin-right: 50px;" />
.....
<img src="/public/icons/portal-in.png" width="30px"/>
<img src="/public/icons/boulder-3.png" width="80px"/>
<img src="/public/icons/portal-out.png" width="30px"/>
.....
<img src="/public/icons/end.svg" width="70px"/>
.

```
npm install
npm start
```
A browser window will open [http://localhost:3000](http://localhost:3000).

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

#### Screenshot
![screenshot](/public/bigomega-grid.gif)

***

bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

[boulder]: /public/icons/boulder-3.svg