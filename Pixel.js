class Pixel extends GameObject {
  constructor(props) {
    super(props);
    this.props = props;
    console.log('pixel', this.props)
  }

  onKeyDown(e, game) {
    if (game.state.matrix && game.state.matrix[this.props.refY] && game.state.matrix[this.props.refY][this.props.refX]) {
      // console.log(this.props.name, game.state.matrix[this.props.refY][this.props.refX].filled);
    }
  }

  onEnterFrame(game) {
    if (game.state.matrix && game.state.matrix[this.props.refY] && game.state.matrix[this.props.refY][this.props.refX]) {
      this.props.color = game.state.matrix[this.props.refY][this.props.refX].filled > 0 ? '#fff' : '#333';
    }
    // console.log(game.state.matrix[this.props.x][this.props.y], this.props.name)
  }
}
