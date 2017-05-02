class Text extends GameObject {
  constructor(props) {
    super(props);
  }

  onKeyDown(e, game) {
  }

  stateToProp(game) {
    this.props.text = game.state.score;
  }
}
