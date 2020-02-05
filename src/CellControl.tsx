import React, { Component } from 'react';
import { ICellControlProps } from './util'

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