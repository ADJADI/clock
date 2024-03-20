import React from "react";
import ButtonDown from "./button-down";
import ButtonUp from "./button-up";
import Start from "./react-component/start";
import Stop from "./react-component/stop";
import Reset from "./react-component/reset";
import { useState } from "react";
import audioFile from "./Alarm-Fast-High-Pitch-B1-www.fesliyanstudios.com-www.fesliyanstudios.com.mp3";

export default function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(audioFile));

  const playBreakSong = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();

        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSong();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSong();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);

      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    setTimerOn(true);
  };

  const pauseTime = () => {
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    setTimerOn(false);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="flex flex-col gap-20 items-center h-screen bg-blue-900 text-white sm:text-4xl p-20">
      <div className="flex flex-col justify-center items-center gap-20">
        <h1 className="text-6xl">25 + 5 Clock</h1>

        <div className="flex gap-20">
          <Length
            title={"break length"}
            changeTime={changeTime}
            type={"break"}
            time={breakTime}
            formatTime={formatTime}
          />
          <Length
            title={"session length"}
            changeTime={changeTime}
            type={"session"}
            time={sessionTime}
            formatTime={formatTime}
          />
        </div>
      </div>

      <div className="flex flex-col items-center border-8 rounded-xl">
        <h3 className="">{onBreak ? "break" : "session"}</h3>

        <h2 className="sm:p-52 p-20" id="time-left">
          {formatTime(displayTime)}
        </h2>

        <div className="flex justify-center items-center">
          <button onClick={controlTime}>
            <Start />
          </button>
          <button onClick={pauseTime}>
            <Stop />
          </button>
          <button onClick={resetTime}>
            <Reset />
          </button>
        </div>
      </div>
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <div className="flex gap-20">
        <div className="flex flex-col flex-shrink-0 items-center">
          <h2 id="break-label">{title}</h2>

          <div className="flex justify-center items-center">
            <button onClick={() => changeTime(-60, type)}>
              <ButtonDown />
            </button>
            <span id="break-length">{formatTime(time)}</span>
            <button onClick={() => changeTime(+60, type)}>
              <ButtonUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
