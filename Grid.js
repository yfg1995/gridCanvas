import gsap from "gsap";

export class Grid {
  mouse = {
    x: 0,
    y: 0,
  };

  mouseClamped = {
    col: null,
    row: null,
  };

  clickedIndex = null;
  prevIndex = null;
  cells = [];

  debug = false;

  constructor({ wrap }) {
    this.wrap = document.querySelector(wrap);
    this.rows = 10;
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

  getX(col) {
    return col * this.cellSize.width;
  }

  getY(row) {
    return row * this.cellSize.height;
  }

  createGrid() {
    this.cells = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = this.getX(col);
        const y = this.getY(row);

        this.cells.push({
          x,
          y,
          col,
          row,
          scale: 1,
          fill: "transparent",
          i: this.getIndex(row, col),
        });
      }
    }
  }

  drawGrid() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";

    this.cells.forEach((cell) => {
      const { x, y, i, row, col, scale, fill } = cell;

      const isActive =
        this.mouseClamped.col === col && this.mouseClamped.row === row;

      this.ctx.beginPath();

      this.ctx.fillStyle =
        isActive && this.clickedIndex !== i
          ? "red"
          : this.clickedIndex === i
          ? "blue"
          : "transparent";

      this.ctx.fillStyle = this.clickedIndex === i ? "blue" : fill;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.scale(scale, scale);
      this.ctx.strokeStyle = "white";
      this.ctx.roundRect(
        0,
        0,
        this.cellSize.width,
        this.cellSize.height,
        15 / scale
      );
      this.ctx.stroke();
      this.ctx.fill();

      if (this.debug) {
        this.ctx.beginPath();

        this.ctx.font = "16px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(
          `row: ${row} / col: ${col} / i: ${i}`,
          this.cellSize.width * 0.5,
          this.cellSize.height * 0.5
        );
      }

      this.ctx.restore();
    });

    requestAnimationFrame(this.drawGrid.bind(this));
  }

  listeners() {
    window.addEventListener("resize", () => {
      this.setup();
      this.createGrid();
    });

    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      this.mouseClamped = {
        col: Math.floor(this.mouse.x / this.cellSize.width),
        row: Math.floor(this.mouse.y / this.cellSize.height),
      };

      const index = this.getIndex(this.mouseClamped.row, this.mouseClamped.col);

      if (this.prevIndex !== index) {
        this.prevIndex = index;

        gsap.to(
          this.cells.filter((c) => c.i !== this.clickedIndex),
          {
            fill: "transparent",
            duration: 0.1,
          }
        );

        gsap.to(this.cells[index], {
          fill: "red",
          duration: 0.1,
        });
      }
    });

    document.addEventListener("mouseleave", () => {
      this.mouseClamped = {
        col: null,
        row: null,
      };
    });

    document.addEventListener("click", () => {
      if (this.clickedIndex !== null) {
        const prevCell = this.cells[this.clickedIndex];

        gsap.to(prevCell, {
          x: this.getX(prevCell.col),
          y: this.getY(prevCell.row),
          scale: 1,
        });
      }

      const cell =
        this.cells[this.getIndex(this.mouseClamped.row, this.mouseClamped.col)];

      this.clickedIndex = cell.i;

      gsap.to(cell, {
        x: this.canvas.width * 0.5 - this.cellSize.width * (cell.scale - 1),
        y: this.canvas.height * 0.5 - this.cellSize.height * (cell.scale - 1),
        scale: 3,
      });

      //   gsap.to(this.cells, {
      //     keyframes: {
      //       scale: [1, 1.5, 1],
      //     },
      //     stagger: {
      //       each: 0.1,
      //       from: this.clickedIndex,
      //       grid: [this.cols, this.rows],
      //         ease: "power2.inOut",
      //     },
      //   });
    });
  }

  init() {
    this.createCanvas();
    this.setup();
    this.createGrid();
    this.drawGrid();
    this.listeners();
  }
}
