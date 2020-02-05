import React from 'react';
import './App.css';

enum CellTypes { Boulder, Gravel, InWormhole, OutWormhole, Start, End, Clear }

interface IState {
  size_x: number,
  size_y: number,
  selected: CellTypes,
  // boulder_cells: [number, number][],
  // gravel_cells: [number, number][],
  // in_wormhole_cells: [number, number][],
  // out_wormhole_cells: [number, number][],
  // start: [number, number],
  // end: [number, number],
  grid: CellTypes[][],
}

class App extends React.Component {

  state: IState = {
    size_x: 5,
    size_y: 5,
    selected: CellTypes.Clear,
    grid: this.generateGrid(5, 5),
  }

  constructor(props: object) {
    super(props)
  }

  generateGrid(x: number, y: number) {
    return [...Array(x).keys()].map(x =>
      [...Array(y).keys()].map(y => CellTypes.Clear)
    )
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <div className="controllerContainer">
          <div className="start controller">
            <img src={process.env.PUBLIC_URL + "/icons/start.svg"} alt="Start" />
            <div className="text">Start Point</div>
          </div>
          <div className="end controller">
            <img src={process.env.PUBLIC_URL + "/icons/end.svg"} alt="End" />
            <div className="text">End Point</div>
          </div>
          <div className="boulder controller">
            <img src={process.env.PUBLIC_URL + "/icons/boulder-3.png"} alt="" />
            <div className="text">Boulder</div>
          </div>
          <div className="gravel controller">
            <img src={process.env.PUBLIC_URL + "/icons/gravel-2.svg"} alt="Gravel" />
            <div className="text">Gravel</div>
          </div>
          <div className="inWormhole controller">
            <img src={process.env.PUBLIC_URL + "/icons/portal-in.svg"} alt="Wormhole In" />
            <div className="text">Wormhole Entry</div>
          </div>
          <div className="outWormhole controller">
            <img src={process.env.PUBLIC_URL + "/icons/portal-out.svg"} alt="Wormhole Out" />
            <div className="text">Wormhole Exit</div>
          </div>
          <div className="clear controller">
            <img src={process.env.PUBLIC_URL + "/icons/shovel-2.svg"} alt="Clear" />
            <div className="text">Clear Point</div>
          </div>
        </div>
        <div className="gridContainer">
          <div className="grid">
          {
            this.state.grid.map((row, x) =>
              <div className="row" data-x={x} key={x}>
              {
                row.map((cell, y) =>
                  <div className="cell" data-x={x} data-y={y} key={y}>{x}, {y}, {CellTypes[cell]}</div>
                )
              }
              </div>
            )
          }
          </div>
        </div>
        <div className="resetContainer">
          <div className="solve btn">Solve</div>
          <div className="reset btn">Resize / Reset</div>
        </div>
      </div>
    )
  }
}

export default App;
