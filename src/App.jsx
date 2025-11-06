import './App.css'
import {StreamerbotClient} from "@streamerbot/client";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import {useRef, useState} from "react";

function App() {
  const streamerbotClient = new StreamerbotClient();
  const [countdown, setCountdown] = useState(<div></div>);
  const [timerAmount, setTimerAmount] = useState(0);

  streamerbotClient.on('General.Custom', event => {
    if(event.data.event === 'timerEvent') {
      if(event.data.action === 'restart'){
        setCountdown(<CountdownCircleTimer
                        key={Math.random()}
                        isPlaying
                        duration={timerAmount}
                        colors={['#00ff00', '#ffe100', '#aa0000']}
                        colorsTime={[event.data.duration, event.data.duration / 2, 0]}
                        onComplete={() => {
                            setCountdown(<div></div>);
                          }
                        }
                      >
                        {countdownTimer}
                      </CountdownCircleTimer>
        );
      } else if(event.data.action === 'reset'){
        setCountdown(<div></div>);
      } else {
        setCountdown(<CountdownCircleTimer
                        key={Math.random()}
                        isPlaying
                        duration={event.data.duration}
                        colors={['#00ff00', '#ffe100', '#aa0000']}
                        colorsTime={[event.data.duration, event.data.duration / 2, 0]}
                        onComplete={() => {
                            setCountdown(<div></div>);
                          }
                        }
                      >
          {countdownTimer}
        </CountdownCircleTimer>);
        setTimerAmount(event.data.duration);
      }
    }
  });

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (minutes * 60);
    const hoursString = hours > 0 ? hours.toString().padStart(2, '0') + ":" : "";
    const minutesString = hours > 0 && minutes < 10 ? minutes.toString().padStart(2, '0') + ":" : minutes !== 0 ? minutes + ":" : "";
    const secondsString = hours > 0 || minutes > 0 ? seconds.toString().padStart(2, '0') : seconds;
    return hoursString +
    minutesString +
    secondsString;
  }

  const countdownTimer = ({remainingTime}) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);
    const [, setOneLastRerender] = useState(0);

    if (currentTime.current !== remainingTime) {
      isNewTimeFirstTick.current = true;
      prevTime.current = currentTime.current;
      currentTime.current = remainingTime;
    } else {
      isNewTimeFirstTick.current = false;
    }

    // force one last re-render when the time is over to trigger the last animation
    if (remainingTime === 0) {
      setTimeout(() => {
        setOneLastRerender((val) => val + 1);
      }, 20);
    }

    const isTimeUp = isNewTimeFirstTick.current;

    return (
      <div className="time-wrapper">
        <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
          {formatTime(remainingTime)}
        </div>
        {prevTime.current !== null && (
          <div
            key={prevTime.current}
            className={`time ${!isTimeUp ? "down" : ""}`}
          >
            {formatTime(prevTime.current)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="App">
        <div className="time-wrapper">
          {countdown}
        </div>
      </div>
    </>
  )
}

export default App
