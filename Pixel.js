class Pixel extends GameObject {
  constructor(props) {
    super(props);
    this.props = props;
    let colors = [];
    // colors['black'] = 107;
    colors['black'] = 210;
    colors['T'] = 0;
    colors['O'] = 7;
    colors['I'] = 14;
    colors['S'] = 21;
    colors['Z'] = 28;
    colors['L'] = 35;
    colors['J'] = 42;
    this.colors = colors;
  }

  onEnterFrame(game) {
    if (this.props.matrix && this.props.matrix[this.props.refY] && this.props.matrix[this.props.refY][this.props.refX]) {
      const pos = this.props.matrix[this.props.refY][this.props.refX];
      this.props.sx = pos.filled > 0 ? this.colors[pos.type] : this.colors['black'];
    }
  }
}
