import React, { useState, useEffect } from "react";
import TimerDisplay from '../TimerDisplay';
import SettingsBtn from '../SettingsBtn';
import Settings from '../SettingsModal';
import css from './Timer.module.css';
import bellSound from '../../audio/bell.flac';
import Swal from 'sweetalert2';
import InfoBtn from '../InfoBtn';
import Info from '../InfoModal';

function Timer() {
  // Here are time value hooks
  const [pomodoroInterval, setPomodoroInterval] = useState(25);
  const [shortBrake, setShortBrake] = useState(5);
  const [longBreak, setLongBreak] = useState(10);
  const [pomodoros, setPomodoros] = useState(4);

  // Hooks for sounds
  const [bell] = useState(new Audio(bellSound));

  // Other hooks
  const [time, setTime] = useState(pomodoroInterval * 60);
  const [pomodoro, setPomodoro] = useState(1);
  const [restFlag, setRestFlag] = useState(false);
  const [buttonText, setButtonText] = useState("Pause");
  const [startStatus, setStartStatus] = useState(false);

  // Hooks for Modals
  const [settings, setSettings] = useState(false);
  const [info, setInfo] = useState(false);

  // Here is a temporary value for progress bar
  const [temporary, setTemporary] = useState(pomodoroInterval)

  useEffect(() => {
    if (startStatus) {
      if (buttonText === 'Pause') {
        if (time !== 0) {
          setTimeout(() => {
            setTime(time - 1);
          }, 1000);
        } else {
          bell.play()
          pomodoroCount()
        }
      }
    }
  });

  const start = () => {
    console.log('test');
    setStartStatus(true);
  }

  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  function pomodoroCount() {
    let pomodoroCount = pomodoro
    let interval
    let flag
    if (pomodoro < pomodoros && !restFlag) {
      interval = shortBrake
      flag = true
      // setTimeout(function () {
      Swal.fire({
        title: "Time to have a rest",
        allowOutsideClick: false,
        onOpen: () => { setButtonText("Continue") },
        onClose: () => { setButtonText("Pause") },
        allowEnterKey: true,
        confirmButtonColor: "red"
      })
      // }, 1000)
      setTemporary(shortBrake)
    } else if (pomodoro < pomodoros && restFlag) {
      pomodoroCount = pomodoro + 1
      interval = pomodoroInterval
      flag = false
      Swal.fire({
        title: "Time to work",
        allowOutsideClick: false,
        onOpen: () => { setButtonText("Continue") },
        onClose: () => { setButtonText("Pause") },
        allowEnterKey: true,
        confirmButtonColor: "red"
      })
      setTemporary(pomodoroInterval)
    } else if (pomodoro >= pomodoros) {
      pomodoroCount = 1
      interval = longBreak
      flag = true
      Swal.fire({
        title: "Time to have the longest break",
        allowOutsideClick: false,
        onOpen: () => { setButtonText("Continue") },
        onClose: () => { setButtonText("Pause") },
        allowEnterKey: true,
        confirmButtonColor: "red"
      })
      setTemporary(longBreak)
    }
    setPomodoro(pomodoroCount)
    setTime(interval * 60)
    setRestFlag(flag)
  }

  function pauseAndResume() {
    let newText
    if (buttonText === 'Pause') {
      newText = 'Continue'
    } else {
      newText = 'Pause'
    }
    setButtonText(newText)
  }

  // Func for progress bar
  const getProgress = () => {
    const current = time;
    const total = temporary * 60;
    return ((total - current) / total) * 100;
  };

  const onModal = () => {
    return setSettings(true);
  }

  const onInfo = () => {
    return setInfo(true);
  }

  const reset = () => {
    if (buttonText === "Continue") {
      setStartStatus(false)
      setRestFlag(false)
      setTime((temporary) * 60)
      setButtonText('Pause')
    }
  }

  return (
    <div>
      <InfoBtn onclick={onInfo} />
      <SettingsBtn onclick={onModal} />

      <TimerDisplay time={pomodoroInterval} progress={getProgress()}>
        <h2 className={css.test}>{minutes < 10 ? `0${minutes}` : minutes} :  {seconds < 10 ? `0${seconds}` : seconds}</h2>
      </TimerDisplay>

      {
        startStatus
          ? <div>
            <button className={css.btn} onClick={pauseAndResume} >{buttonText}</button>
            <button className={css.reset} title="Click <Pause> to reset" onClick={reset}>Reset</button>
          </div>
          : <button className={css.btn} onClick={start}>Start</button>
      }

      <Settings active={settings} onChange={onModal}>
        <h3>Settings</h3>
        <div>Pomodoro</div>
        <input value={pomodoroInterval}
          onChange={(e) => {
            setPomodoroInterval(e.target.value)
            setTime(e.target.value * 60)
            setTemporary(e.target.value)
          }} />

        <div>Short Break</div>
        <input value={shortBrake}
          onChange={(e) => setShortBrake(e.target.value)} />

        <div>Long Break</div>
        <input value={longBreak}
          onChange={(e) => setLongBreak(e.target.value)} />

        <div>Pomodoro Count</div>
        <input value={pomodoros}
          onChange={(e) => setPomodoros(e.target.value)} /><br />

        <button className={css.closeSettings}
          onClick={() => setSettings(false)}>All ok</button>
      </Settings>

      <Info active={info} onChange={onInfo}>
        <h2>About Pomodoro Technique</h2>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
         Nihil labore sit quas nam repellat perspiciatis autem, distinctio
         suscipit ex, quae in fuga? 
        <h2>Use Experience</h2>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Reiciendis aliquid cupiditate fugiat velit? Quam explicabo consequuntur,
        odio non qui recusandae vitae dolore nam odit eius maxime maiores voluptate quaerat provident?
        <br/>
        <button className={css.closeSettings}
          onClick={() => setInfo(false)}>Close</button>
      </Info>
    </div>
  );
}

export default Timer;