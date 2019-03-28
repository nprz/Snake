import React, { Component } from "react";
import PropTypes from "prop-types";

class Snake extends Component {
  static propTypes = {
    classes: PropTypes.object,
    leftWidth: PropTypes.number,
    score: PropTypes.number.isRequired,
    updateScore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      lastKey: null,
      circles: [
        [150, 150],
        [150, 155],
        [150, 160],
        [150, 165],
        [150, 170],
        [150, 175],
        [150, 180],
        [150, 185],
        [150, 190],
        [150, 195]
      ],
      temp: [["x", "y"], ["x", "y"]],
      snack: ["x", "y"],
      snackHasBeenEaten: true,
      move: 5,
      gameOver: false
    };
  }

  componentDidMount() {
    setInterval(
      () =>
        requestAnimationFrame(
          this.state.gameOver ? this.gameOver : this.updateCanvas
        ),
      1000 / 30
    );

    document.addEventListener("keydown", e => {
      if (e.key === "w" && this.state.lastKey !== "s") {
        this.setState({
          lastKey: "w"
        });
      }
    });

    document.addEventListener("keydown", e => {
      if (
        e.key === "s" &&
        this.state.lastKey !== "w" &&
        this.state.lastKey !== null
      ) {
        this.setState({
          lastKey: "s"
        });
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "a" && this.state.lastKey !== "d") {
        this.setState({
          lastKey: "a"
        });
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "d" && this.state.lastKey !== "a") {
        this.setState({
          lastKey: "d"
        });
      }
    });
  }

  gameOver = () => {
    if (this.canvas) {
      const context = this.canvas.getContext("2d");
      context.fillStyle = "#000";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      context.fillStyle = "red";
      context.font = "15px Arial";
      context.fillText("THE SNAKE HAS DIED.", 0, 50);
    }
  };

  updateCanvas = () => {
    //  Write initial position in temp[0][0]
    //  update circles at [0][0] and [0][1]

    // TODO: the destructured value stays static after updating state,
    // can't trust destructed value is most up to date.
    const { circles, temp } = this.state;

    if (this.canvas) {
      const context = this.canvas.getContext("2d");

      this.state.gameOver ? this.setState({ move: 0 }) : null;

      if (this.state.lastKey === "w") {
        this.setState({
          temp: [[circles[0][0], circles[0][1]], ...this.state.temp.slice(1)],
          circles: [[circles[0][0], circles[0][1] - 5], ...circles.slice(1)]
        });
      } else if (this.state.lastKey === "s") {
        this.setState({
          temp: [[circles[0][0], circles[0][1]], ...this.state.temp.slice(1)],
          circles: [[circles[0][0], circles[0][1] + 5], ...circles.slice(1)]
        });
      } else if (this.state.lastKey === "a") {
        this.setState({
          temp: [[circles[0][0], circles[0][1]], ...this.state.temp.slice(1)],
          circles: [[circles[0][0] - 5, circles[0][1]], ...circles.slice(1)]
        });
      } else if (this.state.lastKey === "d") {
        this.setState({
          temp: [[circles[0][0], circles[0][1]], ...this.state.temp.slice(1)],
          circles: [[circles[0][0] + 5, circles[0][1]], ...circles.slice(1)]
        });
      }

      context.clearRect(0, 0, 400, 400);
      context.fillStyle = "#fff";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      context.fillStyle = this.state.snackHasBeenEaten ? "#FF0000" : "#000";
      context.beginPath();

      context.fillRect(circles[0][0], circles[0][1], 5, 5);
      // TODO: A better pattern would be
      // getting the state of the snake position --> draw snake
      // right now we are calculating the snakes state as we draw the
      // snake === confusing and more room for error
      for (let i = 1; i < circles.length; i++) {
        if (i % 2 !== 0 && this.state.lastKey !== null) {
          this.setState((prevState, props) => ({
            temp: [
              ...prevState.temp.slice(0, 1),
              [prevState.circles[i][0], prevState.circles[i][1]]
            ]
          }));

          this.setState((prevState, props) => ({
            circles: [
              ...prevState.circles.slice(0, i),
              [prevState.temp[0][0], prevState.temp[0][1]],
              ...prevState.circles.slice(i + 1)
            ]
          }));
        } else if (i % 2 === 0 && this.state.lastKey !== null) {
          this.setState({
            temp: [
              [this.state.circles[i][0], this.state.circles[i][1]],
              ...this.state.temp.slice(1)
            ]
          });
          this.setState({
            circles: [
              ...this.state.circles.slice(0, i),
              [this.state.temp[1][0], this.state.temp[1][1]],
              ...this.state.circles.slice(i + 1)
            ]
          });
        }
        context.fillRect(
          this.state.circles[i][0],
          this.state.circles[i][1],
          5,
          5
        );
      }

      //spawn snack
      if (this.state.snackHasBeenEaten === true) {
        this.setState({
          snack: [
            Math.floor(Math.random() * this.canvas.width + 5),
            Math.floor(Math.random() * this.canvas.height + 5)
          ],
          snackHasBeenEaten: false
        });
      }

      context.beginPath();
      context.fillStyle = "#FF0000";
      context.fillRect(this.state.snack[0], this.state.snack[1], 5, 5);
      context.stroke();

      //did snek eat snack?
      if (
        this.state.snack[0] - 4 <= this.state.circles[0][0] &&
        this.state.snack[0] + 4 >= this.state.circles[0][0] &&
        this.state.snack[1] - 4 <= this.state.circles[0][1] &&
        this.state.snack[1] + 4 >= this.state.circles[0][1]
      ) {
        this.setState({
          snackHasBeenEaten: true,
          circles: [...this.state.circles, ["x", "y"], ["x", "y"], ["x", "y"]]
        });
      }

      if (
        this.state.circles[0][0] < 0 ||
        this.state.circles[0][0] > this.canvas.width ||
        this.state.circles[0][1] < 0 ||
        this.state.circles[0][1] > this.canvas.height
      ) {
        this.setState({
          gameOver: true
        });
      }

      for (let j = 1; j < this.state.circles.length; j++) {
        if (
          this.state.circles[0][0] === this.state.circles[j][0] &&
          this.state.circles[0][1] === this.state.circles[j][1]
        ) {
          this.setState({
            gameOver: true
          });
        }
      }
    }
  };

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        width={width}
        height={height}
        ref={canvas => (this.canvas = canvas)}
      />
    );
  }
}

export default Snake;
