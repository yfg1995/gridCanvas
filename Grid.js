export class Grid {
  mouse = {
    x: 0,
    y: 0,
  };

  mouseClamped = {
    x: null,
    y: null,
  };

  constructor({ wrap }) {
    this.wrap = document.querySelector(wrap);
    this.rows = 12;
    this.cols = 10;
    this.init();
  }

  setup() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.cellSize = {
      width: this.canvas.width / this.cols,
      height: this.canvas.height / this.rows,
    };
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.wrap.appendChild(this.canvas);
  }

  getIndex(row, col) {
    return this.cols * row + col;
  }

  drawGrid() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * this.cellSize.width;
        const y = row * this.cellSize.height;

        const isActive =
          this.mouseClamped.x === col && this.mouseClamped.y === row;
        this.ctx.fillStyle = isActive ? "red" : "transparent";
        this.ctx.strokeStyle = "white";
        this.ctx.rect(x, y, this.cellSize.width, this.cellSize.height);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.font = "16px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(
          `row: ${row} / col: ${col} / i: ${this.getIndex(row, col)}`,
          this.cellSize.width * 0.5 + x,
          this.cellSize.height * 0.5 + y
        );
      }
    }

    requestAnimationFrame(this.drawGrid.bind(this));
  }

  listeners() {
    window.addEventListener("resize", () => {
      this.setup();
    });

    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      this.mouseClamped = {
        x: Math.floor(this.mouse.x / this.cellSize.width),
        y: Math.floor(this.mouse.y / this.cellSize.height),
      };
    });

    document.addEventListener("mouseleave", () => {
      this.mouseClamped = {
        x: null,
        y: null,
      };
    });

    document.addEventListener("click", () => {});
  }

  init() {
    this.createCanvas();
    this.setup();
    this.drawGrid();
    this.listeners();
  }
}
