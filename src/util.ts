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
  { class: 'start', type: CellTypes.Start, img: '/icons/start.svg', text: '(S)tart Point' },
  { class: 'end', type: CellTypes.End, img:'/icons/end.svg', text: '(E)nd Point' },
  { class: 'boulder', type: CellTypes.Boulder, img:'/icons/boulder-3.png', text: '(B)oulder' },
  { class: 'gravel', type: CellTypes.Gravel, img:'/icons/gravel-2.svg', text: '(G)ravel' },
  { class: 'inWormhole', type: CellTypes.InWormhole, img:'/icons/portal-in.png', text: 'Wormhole (I)n' },
  { class: 'outWormhole', type: CellTypes.OutWormhole, img:'/icons/portal-out.png', text: 'Wormhole (O)ut' },
  { class: 'clear', type: CellTypes.Clear, img:'/icons/shovel-2.svg', text: '(C)lear Point' },
]

export const CELL_IMAGES = CELL_TYPES.reduce((mem: any, obj) => (mem[obj.type] = obj.img, mem), {})
