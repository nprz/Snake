import React from "react";
import { Button } from "semantic-ui-react";

class Snake extends React.Component {
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
      score: 0,
      move: 5,
      gameOver: false
    };

    this.updateCanvas = this.updateCanvas.bind(this);
    this.gameOver = this.gameOver.bind(this);
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

  gameOver() {
    if (this.canvas) {
      const context = this.canvas.getContext("2d");
      context.fillStyle = "#000";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      context.fillStyle = "red";
      context.font = "15px Arial";
      context.fillText("THE SNAKE HAS DIED.", 0, 50);
    }
  }

  updateCanvas() {
    //  Write initial position in temp[0][0]
    //  update circles at [0][0] and [0][1]
    if (this.canvas) {
      const context = this.canvas.getContext("2d");

      this.state.gameOver ? this.setState({ move: 0 }) : null;

      if (this.state.lastKey === "w") {
        this.setState({
          temp: [
            [this.state.circles[0][0], this.state.circles[0][1]],
            ...this.state.temp.slice(1)
          ],
          circles: [
            [this.state.circles[0][0], this.state.circles[0][1] - 5],
            ...this.state.circles.slice(1)
          ]
        });
      } else if (this.state.lastKey === "s") {
        this.setState({
          temp: [
            [this.state.circles[0][0], this.state.circles[0][1]],
            ...this.state.temp.slice(1)
          ],
          circles: [
            [this.state.circles[0][0], this.state.circles[0][1] + 5],
            ...this.state.circles.slice(1)
          ]
        });
      } else if (this.state.lastKey === "a") {
        this.setState({
          temp: [
            [this.state.circles[0][0], this.state.circles[0][1]],
            ...this.state.temp.slice(1)
          ],
          circles: [
            [this.state.circles[0][0] - 5, this.state.circles[0][1]],
            ...this.state.circles.slice(1)
          ]
        });
      } else if (this.state.lastKey === "d") {
        this.setState({
          temp: [
            [this.state.circles[0][0], this.state.circles[0][1]],
            ...this.state.temp.slice(1)
          ],
          circles: [
            [this.state.circles[0][0] + 5, this.state.circles[0][1]],
            ...this.state.circles.slice(1)
          ]
        });
      }

      context.clearRect(0, 0, 400, 400);
      context.fillStyle = "#fff";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      context.fillStyle = "#000";
      context.beginPath();

      context.fillRect(
        this.state.circles[0][0],
        this.state.circles[0][1],
        5,
        5
      );
      for (let i = 1; i < this.state.circles.length; i++) {
        if (i % 2 !== 0 && this.state.lastKey !== null) {
          this.setState({
            temp: [
              ...this.state.temp.slice(0, 1),
              [this.state.circles[i][0], this.state.circles[i][1]]
            ]
          });
          this.setState({
            circles: [
              ...this.state.circles.slice(0, i),
              [this.state.temp[0][0], this.state.temp[0][1]],
              ...this.state.circles.slice(i + 1)
            ]
          });
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
            Math.floor(Math.random() * 390 + 5),
            Math.floor(Math.random() * 390 + 5)
          ],
          snackHasBeenEaten: false
        });
      }

      context.drawImage(
        image,
        this.state.snack[0] - 5,
        this.state.snack[1] - 5,
        30,
        30
      );
      context.beginPath();
      context.arc(this.state.snack[0], this.state.snack[1], 3, 0, 2 * Math.PI);
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
          circles: [...this.state.circles, ["x", "y"], ["x", "y"], ["x", "y"]],
          score: this.state.score + 100
        });
      }

      if (
        this.state.circles[0][0] < 0 ||
        this.state.circles[0][0] > 400 ||
        this.state.circles[0][1] < 0 ||
        this.state.circles[0][1] > 400
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
  }

  render() {
    let button = null;

    if (
      this.state.score >= this.props.scoreToBeat &&
      this.props.broken === false
    ) {
      button = (
        <Button onClick={this.props.setBrokenToTrue} color={"green"}>
          POST
        </Button>
      );
    }

    return (
      <div>
        <div className="scores">
          <div className="score"> SCORE: {this.state.score} </div>
          <div className="scoreToBeat">
            {" "}
            SCORE TO BEAT: {this.props.scoreToBeat}{" "}
          </div>
        </div>
        <canvas
          width="400"
          height="400"
          ref={canvas => (this.canvas = canvas)}
          className="canvas"
        />
        <br />
        <div className="buttonContainer">{button}</div>
      </div>
    );
  }
}

export default Snake;
