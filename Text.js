class Score extends GameObject {
  constructor(props) {
    super(props);
  }

  onKeyDown(e, game) {
  }

  stateToProp(game) {
    this.props.text = game.state.score;
  }
}

class Lines extends GameObject {
  constructor(props) {
    super(props);
  }

  onKeyDown(e, game) {
  }

  stateToProp(game) {
    this.props.text = game.state.lines;
  }
}

class Level extends GameObject {
  constructor(props) {
    super(props);
  }

  onKeyDown(e, game) {
  }

  stateToProp(game) {
    this.props.text = game.state.level;
  }
}