class Pixel extends GameObject {
  constructor(props) {
    super(props);
    this.props = props;
    let colors = [];
    colors['black'] = 107;
    colors['T'] = 0;
    colors['O'] = 7;
    colors['I'] = 14;
    colors['S'] = 21;
    colors['Z'] = 28;
    colors['L'] = 35;
    colors['J'] = 42;
    this.colors = colors;
  }

  onKeyDown(e, game) {
    if (game.state.matrix && game.state.matrix[this.props.refY] && game.state.matrix[this.props.refY][this.props.refX]) {
      // console.log(this.props.name, game.state.matrix[this.props.refY][this.props.refX].filled);
    }
  }

  onEnterFrame(game) {
    if (game.state.matrix && game.state.matrix[this.props.refY] && game.state.matrix[this.props.refY][this.props.refX]) {
      const pos = game.state.matrix[this.props.refY][this.props.refX];
      this.props.sx = pos.filled > 0 ? this.colors[pos.type] : this.colors['black'];
    }
  }
}
