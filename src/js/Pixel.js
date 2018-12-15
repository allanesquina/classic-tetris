import GameObject from './engine/GameObject';
import {
  PIECES_SPRITE_COLORS,
 } from './enum';

export default class Pixel extends GameObject {
  constructor(props) {
    super(props);
    this.props = props;
  }

  onEnterFrame(game) {
    const matrix = game.state[this.props.matrix];
    if(!matrix) { return }
    if (matrix[this.props.refY] && matrix[this.props.refY][this.props.refX]) {
      const pos = matrix[this.props.refY][this.props.refX];
      this.props.sx = pos.filled > 0 ? PIECES_SPRITE_COLORS[pos.type] : PIECES_SPRITE_COLORS['black'];
    }
  }
}
