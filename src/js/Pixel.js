import GameObject from './engine/GameObject';
import {
  PIECES_SPRITE_COLORS,
 } from './enum';
import { config } from './gameConfig';

export default class Pixel extends GameObject {
  constructor(props) {
    super(props);
    this.props = props;
    this.firstRender = true;
    this.isAnimating = false;
  }

  onEnterFrame(game) {
    const matrix = game.state[this.props.matrix];
    this.props.type = config.theme.sprite.type;

    if(!matrix) { return }
    if (matrix[this.props.refY] && matrix[this.props.refY][this.props.refX]) {
      const pos = matrix[this.props.refY][this.props.refX];
      if(config.theme.sprite.type === 'rect') {
        this.props.color = pos.filled > 0 ? config.theme.color.filled : config.theme.color.empty;
      }
      if(config.theme.sprite.type === 'sprite') {
        this.props.sx = pos.filled > 0 ? config.theme.sprite.colors[pos.type] : config.theme.sprite.colors['black'];
      }
      
    }
  }

  shouldRender(game) {
    if(this.firstRender) {
      return true;
    }

    return this.lastProps.sx != this.props.sx || 
      this.props.color != this.lastProps.color || 
      this.props.y != this.lastProps.y ||
      this.props.type != this.lastProps.type;
  }
}
