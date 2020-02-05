import React, { Component } from 'react';
enum CellTypes { Boulder, Gravel, InWormhole, OutWormhole, Start, End, Clear }

interface ICellControlProps {
  class: string,
  type: CellTypes,
  img: string,
  text: string,
  isActive: boolean,
  onClick: Function,
}

class CellControl extends Component<ICellControlProps> {
  render() {
    return (
      <div className={this.props.class +' controller' + (this.props.isActive? ' active': '')}
        onClick={e => this.props.onClick(this.props.type)}
       >
        <img src={process.env.PUBLIC_URL + this.props.img} alt={this.props.text} />
        <div className="text">{this.props.text}</div>
      </div>
    )
  }
}

export default CellControl