// This component is for a Pomodoro clock application that has a timer, buttons to start, pause and reset the timer,
// buttons to set the length of the break and the length of the session, and displays the countdown timer.

import "./styles.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownLong,
  faUpLong,
  faArrowsRotate,
  faPlay,
  faPause
} from "@fortawesome/free-solid-svg-icons";
import Timer from "easytimer.js";

// Constants used to identify the current countdown
const BREAK = "BREAK";
const SESSION = "SESSION";

// Constants used to increment or decrement the session and break times
const INCREMENT = 1;
const DECREMENT = -1;

class StudyClock extends React.Component {
  constructor(props) {
    super(props);

    // Set initial state of the component
    this.state = {
      session: 25, // Length of the study session in minutes
      break: 5, // Length of the break in minutes
      currentCountdown: SESSION, // Current countdown being displayed (either session or break)
      timeLeft: this.numToTime(25), // Time remaining in the current countdown
      isSession: true // Boolean variable to keep track of whether the current countdown is a session or break
    };

    // Create a new timer object from the easytimer.js library
    this.timer = new Timer();
    //this.isSession = true;
  }

  // Convert a number (in minutes) to a string formatted as a time
  numToTime = (num) => {
    let time = new Date(num * 60 * 1000).toISOString().slice(14, 19);
    return num === 60 ? "60:00" : time;
  };

  // Add an event listener to the timer that updates the time remaining every second
  componentDidMount() {
    this.timer.addEventListener("secondsUpdated", () => {
      const { minutes, seconds } = this.timer.getTimeValues();
      this.setState({
        timeLeft: `${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      });
    });
  }

  // Handle changes to the session or break length when the user clicks the increment or decrement buttons
  handleChange = (option, value) => {
    const optionKey = option.toLowerCase();
    this.setState((prevState) => {
      const currentValue = prevState[optionKey];

      // Check if the new value is within the valid range (1-60 minutes)
      if (
        (currentValue === 1 && value === -1) ||
        (currentValue === 60 && value === 1)
      ) {
        return prevState;
      }

      // Update the state with the new value
      return {
        [optionKey]: currentValue + value,
        // If the session length was changed, update the time remaining as well
        timeLeft:
          option === SESSION
            ? this.numToTime(currentValue + value)
            : prevState.timeLeft
      };
    });
  };

  // Handle when the user clicks the play button
  handlePlay = (e, state) => {
    // Start the timer with the given countdown time
    this.timer.start({
      countdown: true,
      startValues: {
        minutes: new Date(state * 60 * 1000).toISOString().slice(14, 16),
        seconds: new Date(state * 60 * 1000).toISOString().slice(17, 19)
      }
    });
    // Add an event listener to the timer that switches to the break or session countdown when the current one finishes
    this.timer.addEventListener("targetAchieved", (e) => {
      this.timer.stop();
      document.getElementById("beep").play();
      // Update the state based on the current countdown type
      this.setState((prevState) => {
        const nextState = prevState.isSession
          ? this.state.break
          : this.state.session;
        this.handlePlay(e, nextState);
        return {
          isSession: !prevState.isSession,
          currentCountdown: prevState.isSession ? BREAK : SESSION,
          timeLeft: this.numToTime(
            prevState.isSession ? prevState.break : prevState.session
          )
        };
      });
    });
  };

  // This function pauses the timer
  handlePause = (e, state) => {
    this.timer.pause();
  };

  // This function resets the timer to its initial state
  resetTimer = () => {
    this.timer.stop();
    this.setState({
      session: 25,
      break: 5,
      timeLeft: this.numToTime(25)
    });
  };
  render() {
    // The component's UI is rendered here
    return (
      <div id="container">
        <h1>25 + 5</h1>
        <div className="session-div">
          <p>Break Length</p>
          <div id="break-label">
            <div
              id="break-decrement"
              onClick={() => this.handleChange(BREAK, DECREMENT)}
            >
              <FontAwesomeIcon icon={faDownLong} />
            </div>
            <div id="break-length">{this.state.break}</div>
            <div
              id="break-increment"
              onClick={() => this.handleChange(BREAK, INCREMENT)}
            >
              <FontAwesomeIcon icon={faUpLong} />
            </div>
          </div>
        </div>
        <div className="session-div">
          <p>Session Length</p>
          <div id="session-label">
            <div
              id="session-decrement"
              onClick={() => this.handleChange(SESSION, DECREMENT)}
            >
              <FontAwesomeIcon icon={faDownLong} />
            </div>
            <div id="session-length">{this.state.session}</div>
            <div
              id="session-increment"
              onClick={() => this.handleChange(SESSION, INCREMENT)}
            >
              <FontAwesomeIcon icon={faUpLong} />
            </div>
          </div>
        </div>
        <div id="timer-label">
          {this.state.currentCountdown.toLocaleLowerCase()}
          <div id="time-left">{this.state.timeLeft}</div>
        </div>
        <div>
          <audio
            id="beep"
            preload="auto"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
          <div id="start_stop">
            <div
              id="start"
              onClick={(e) =>
                this.handlePlay(
                  e,
                  this.state.isSession ? this.state.session : this.state.break
                )
              }
            >
              <FontAwesomeIcon icon={faPlay} />
            </div>
            <div
              id="stop"
              onClick={(e) => this.handlePause(e, this.state.session)}
            >
              <FontAwesomeIcon icon={faPause} />
            </div>
          </div>
          <div id="reset" onClick={this.resetTimer}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </div>
        </div>
      </div>
    );
  }
}
export default StudyClock;
