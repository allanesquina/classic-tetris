class GameObject {
  constructor(props = {}) {
    this.props = props;
    this.lastProps = Object.assign({}, props);
    this.lastTime = Date.now() / 1000;

    if (props.sprite) {
      this.sprite =  new Image();
      this.sprite.src = props.sprite;
    }
  }

  setDisconnectFn(fn) {
    // ctx.clearRect(this.lastProps.x, this.lastProps.y, this.lastProps.w+10, this.lastProps.h+10);
    // window.context.clearRect(this.props.x-10, this.props.y-10, this.props.w, this.props.h);
    this.disconnect = fn;
  }

  render(ctx, state) {
    switch (this.props.type) {
      case 'rect':
        // ctx.clearRect(this.lastProps.x, this.lastProps.y, this.lastProps.w, this.lastProps.h);
        ctx.fillStyle = this.props.color || '#fff';
        ctx.fillRect(this.props.x, this.props.y, this.props.w, this.props.h);
        break;
      case 'text':
        // ctx.clearRect(this.lastProps.x, this.lastProps.y, 200, 200);
        ctx.fillStyle = this.props.color || '#fff';
        ctx.font = this.props.font;
        ctx.fillText(this.props.text, this.props.x, this.props.y);
        break;
      case 'sprite':
        const { w, h, x, y, sw, sh } = this.props;
        ctx.drawImage(
          this.sprite,
          this.props.sx, 0, sw, sh,
          x, y, w, h
        );
        this.props.sx = this.props.sx > w ? 0 : this.props.sx + w;
        break;
      default:

    }
    this.lastProps = Object.assign({}, this.props);
  }
}
