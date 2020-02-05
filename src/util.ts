export type Index = [number, number]
export enum CellTypes { Boulder, Gravel, InWormhole, OutWormhole, Start, End, Clear }
export type ReturnPath = { index: Index, distance: number, cell: CellTypes }[]

export interface IAppState {
  size_x: number,
  size_y: number,
  selected: CellTypes,
  // boulder_cells: Index[],
  // gravel_cells: Index[],
  // in_wormhole_cells: Index[],
  // out_wormhole_cells: Index[],
  grid: CellTypes[][],
  solution: string[],
  alertNoSolution: boolean,
  start?: Index,
  end?: Index,
}

export interface ICellControlProps {
  class: string,
  type: CellTypes,
  img: string,
  text: string,
  isActive: boolean,
  onClick: Function,
}

export const CELL_TYPES = [
  { class: 'start', type: CellTypes.Start, img: '/icons/start.svg', text: 'Start Point' },
  { class: 'end', type: CellTypes.End, img:'/icons/end.svg', text: 'End Point' },
  { class: 'boulder', type: CellTypes.Boulder, img:'/icons/boulder-3.png', text: 'Boulder' },
  { class: 'gravel', type: CellTypes.Gravel, img:'/icons/gravel-2.svg', text: 'Gravel' },
  { class: 'inWormhole', type: CellTypes.InWormhole, img:'/icons/portal-in.svg', text: 'Wormhole Entry' },
  { class: 'outWormhole', type: CellTypes.OutWormhole, img:'/icons/portal-out.svg', text: 'Wormhole Exit' },
  { class: 'clear', type: CellTypes.Clear, img:'/icons/shovel-2.svg', text: 'Clear Point' },
]
