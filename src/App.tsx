import React, { Component } from 'react'
import update from 'react-addons-update'
import CellControl from './CellControl'
import Grid from './models/Grid'
import { CellTypes, ReturnPath, IAppState, CELL_TYPES } from './util'
import './App.css'

class App extends Component<{}, IAppState> {

  state: IAppState = {
    size_x: 5,
    size_y: 10,
    selected: CellTypes.Start,
    grid: this.generateGrid(5, 10),
    solution: [],
    alertNoSolution: false,
  }

  private size_x_ref = React.createRef<HTMLInputElement>()
  private size_y_ref = React.createRef<HTMLInputElement>()

  generateGrid(x: number = this.state.size_x, y: number = this.state.size_y) {
    return [...Array(x).keys()].map(x =>
      [...Array(y).keys()].map(y => CellTypes.Clear)
    )
  }

  setCell(x:number, y:number, cell:CellTypes) {
    const grid_updates: any = { [x]: { [y]: { $set: this.state.selected } } }
    // refactor
    if (this.state.selected === CellTypes.Start) {
      this.setState({ start: [x, y] })
      if(this.state.start && cell !== CellTypes.Start) {
        const s_x = this.state.start[0]
        const s_y = this.state.start[1]
        grid_updates[s_x] = Object.assign(grid_updates[s_x] || {}, { [s_y]: { $set: CellTypes.Clear } })
      }
    } else if (cell === CellTypes.Start) {
      this.setState({ start: undefined })
    }
    if (this.state.selected === CellTypes.End) {
      this.setState({ end: [x, y] })
      if (this.state.end && cell !== CellTypes.End) {
        const e_x = this.state.end[0]
        const e_y = this.state.end[1]
        grid_updates[e_x] = Object.assign(grid_updates[e_x] || {}, { [e_y]: { $set: CellTypes.Clear } })
      }
    } else if (cell === CellTypes.End) {
      this.setState({ end: undefined })
    }
    this.setState({ grid: update(this.state.grid, grid_updates) })
  }

  solve() {
    let grid = new Grid(this.state.grid, [this.state.size_x, this.state.size_y])
    let solution = grid.findPath()
    let path:ReturnPath = solution.path
    this.setState({ solution: path.map(o => o.index.join()), alertNoSolution: !path.length })
    // console.log(solution.distance)
  }

  reset() {
    let size_x:number = +((this.size_x_ref.current && this.size_x_ref.current.value) || 5)
    let size_y:number = +((this.size_y_ref.current && this.size_y_ref.current.value) || 10)
    this.setState({ size_x, size_y, grid: this.generateGrid(size_x, size_y) })
  }

  render() {
    // console.log(this.state.start, this.state.end)
    // console.log(this.state.solution)
    const cell_images = CELL_TYPES.reduce((mem: any, obj) => (mem[obj.type] = obj.img, mem), {})
    return (
      <div className={'App' + (this.state.alertNoSolution?' noPath':'')}>
        <div className="alert">No path could be found.</div>
        <div className="controllerContainer">
          {
            CELL_TYPES.map(obj =>
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
                  <div
                    className={'cell' + (this.state.solution.includes([x, y].join())?' path': '')}
                    data-x={x} data-y={y} key={y} onClick={e => this.setCell(x, y, cell)}
                  >
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
          <div className="solve btn" onClick={this.solve.bind(this)}>SOLVE</div>
          <input type="number" ref={this.size_x_ref} defaultValue="5"/>
          x
          <input type="number" ref={this.size_y_ref} defaultValue="10"/>
          <div className="reset btn" onClick={this.reset.bind(this)}>Resize / Reset</div>
        </div>
      </div>
    )
  }
}

export default App;
