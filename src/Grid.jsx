import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid({ width = 16, height = 16 }) {
  const [title, setTitle] = useState('Select BFS/DFS');
  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  useEffect(() => {
    generateMaze(width, height);
  }, []);

  // [1, 0] --- '1,0'
  function bfs(startNode) {
    setTitle('BFS Ongoing!');
    setIsBtnDisabled(true);
    let queue = [startNode];
    let visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]) {
      console.log(x, y);

      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          }),
        ),
      );
      if (maze[y][x] === "end") {
        console.log("Path Found!");
        setTitle("Path Found!");
        return true;
      } 
      return false;
    }

    function step() {
      if (queue.length === 0) {
        return;
      }
      const [x, y] = queue.shift();
      console.log("new step");
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            queue.push([nx, ny]);
          }
        } // '2, 3'
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId]);
    }

    step();
    return false;

    // return true/false
  }

  function dfs(startNode) {
    setTitle('DFS Ongoing!');
    setIsBtnDisabled(true);
    let stack = [startNode];
    let visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]) {
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          }),
        ),
      );

      if (maze[y][x] === "end") {
        console.log("Path Found!");
        setTitle("Path Found!");
        return true;
      }
      return false;
    }

    function step() {
      if (stack.length === 0) {
        return;
      }
      const [x, y] = stack.pop();
      console.log("new step");
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            stack.push([nx, ny]);
          }
        } // '2, 3'
      }
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId]);
    }

    step();
    return false;

    // return true/false
  }

  function generateMaze(height, width) {
    let matrix = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }
    console.log(matrix);

    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    function isCellValid(x, y) {
      return (
        y >= 0 && x >= 0 && x < width && y < height && matrix[y][x] === "wall"
      );
    }

    function carvePath(x, y) {
      matrix[y][x] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carvePath(nx, ny);
        }
      }
    }

    carvePath(1, 1);

    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";
    setMaze(matrix);
  }

  function refreshMaze() {
    setTitle('Select BFS/DFS')
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    generateMaze(16, 16);
    setIsBtnDisabled(false);
  }

  return (
    <div className="maze-grid">
      <h1>{title}</h1>
      <div className="controls">
        <button className={"maze-button"} onClick={() => refreshMaze()}>
          Refresh Maze
        </button>
        <button className={"maze-button"} disabled={isBtnDisabled} onClick={() => bfs([1, 0])}>
          Breadth-First Search
        </button>
        <button className={"maze-button"} disabled={isBtnDisabled} onClick={() => dfs([1, 0])}>
          Depth-First Search
        </button>
      </div>
      <div className={"maze"}>
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div className={`cell ${cell}`} key={cellIndex}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}