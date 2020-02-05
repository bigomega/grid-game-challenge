import React, { Component } from 'react'
import update from 'react-addons-update'
import CellControl from './CellControl'
import './App.css'

enum CellTypes { Boulder, Gravel, InWormhole, OutWormhole, Start, End, Clear }

interface IAppState {
  size_x: number,
  size_y: number,
  selected: CellTypes,
  // boulder_cells: [number, number][],
  // gravel_cells: [number, number][],
  // in_wormhole_cells: [number, number][],
  // out_wormhole_cells: [number, number][],
  start?: [number, number],
  end?: [number, number],
  grid: CellTypes[][],
}

class App extends Component<{}, IAppState> {

  state: IAppState = {
    size_x: 5,
    size_y: 10,
    selected: CellTypes.Start,
    grid: this.generateGrid(5, 10),
  }

  constructor(props: object) {
    super(props)
  }

  generateGrid(x: number = this.state.size_x, y: number = this.state.size_y) {
    return [...Array(x).keys()].map(x =>
      [...Array(y).keys()].map(y => CellTypes.Clear)
    )
  }

  setCell(x:number, y:number, cell:CellTypes) {
    // debugger
    const grid_updates: any = { [x]: { [y]: { $set: this.state.selected } } }
    if (this.state.selected === CellTypes.Start) {
      this.setState({ start: [x, y] })
      if(this.state.start && cell !== CellTypes.Start) {
        grid_updates[this.state.start[0]] = { [this.state.start[1]]: { $set: CellTypes.Clear } }
      }
    } else if (cell === CellTypes.Start) {
      this.setState({ start: undefined })
    }
    if (this.state.selected === CellTypes.End) {
      this.setState({ end: [x, y] })
      if (this.state.end && cell !== CellTypes.End) {
        grid_updates[this.state.end[0]] = { [this.state.end[1]]: { $set: CellTypes.Clear } }
      }
    } else if (cell === CellTypes.End) {
      this.setState({ end: undefined })
    }
    this.setState({ grid: update(this.state.grid, grid_updates) })
  }

  render() {
    console.log(this.state.start)
    console.log(this.state.grid)
    const cell_types = [
      { class: 'start', type: CellTypes.Start, img: '/icons/start.svg', text: 'Start Point' },
      { class: 'end', type: CellTypes.End, img:'/icons/end.svg', text: 'End Point' },
      { class: 'boulder', type: CellTypes.Boulder, img:'/icons/boulder-3.png', text: 'Boulder' },
      { class: 'gravel', type: CellTypes.Gravel, img:'/icons/gravel-2.svg', text: 'Gravel' },
      { class: 'inWormhole', type: CellTypes.InWormhole, img:'/icons/portal-in.svg', text: 'Wormhole Entry' },
      { class: 'outWormhole', type: CellTypes.OutWormhole, img:'/icons/portal-out.svg', text: 'Wormhole Exit' },
      { class: 'clear', type: CellTypes.Clear, img:'/icons/shovel-2.svg', text: 'Clear Point' },
    ]
    const cell_images = cell_types.reduce((mem: any, obj) => (mem[obj.type] = obj.img, mem), {})
    return (
      <div className="App">
        <div className="controllerContainer">
          {
            cell_types.map(obj =>
              <CellControl
                {...obj}
                onClick={(type:CellTypes) => this.setState({ selected: type })}
                isActive={obj.type === this.state.selected}
                key={obj.class}
              />
            )
          }
        </div>
        <div className="gridContainer">
          <div className="grid">
          {
            this.state.grid.map((row: CellTypes[], x: number) =>
              <div className="row" data-x={x} key={x}>
              {
                row.map((cell: CellTypes, y:number) =>
                  <div className="cell" data-x={x} data-y={y} key={y} onClick={e => this.setCell(x, y, cell)}>
                    { cell !== CellTypes.Clear && <img src={process.env.PUBLIC_URL + cell_images[cell]} alt={CellTypes[cell]} />}
                  </div>
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
