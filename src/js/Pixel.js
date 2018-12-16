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
  }

  onInit(game) {
    this.themeEventOff = game.event.on('theme', () => {
      this.disconnect();
    });
  }

  onDestroy() {
    this.themeEventOff();
  }


  onEnterFrame(game) {
    const matrix = game.state[this.props.matrix];
    if(!matrix) { return }
    if (matrix[this.props.refY] && matrix[this.props.refY][this.props.refX]) {
      const pos = matrix[this.props.refY][this.props.refX];
      if(config.theme.sprite.type === 'rect') {
        this.props.color = pos.filled > 0 ? config.theme.color.filled : config.theme.color.empty;
      }
      if(config.theme.sprite.type === 'sprite') {
        this.props.sx = pos.filled > 0 ? PIECES_SPRITE_COLORS[pos.type] : PIECES_SPRITE_COLORS['black'];
      }
      
    }
  }

  shouldRender(game) {
    if(this.firstRender) {
      this.firstRender = false;
      return true;
    }
    return this.lastProps.sx != this.props.sx || this.props.color != this.lastProps.color;
  }
}
