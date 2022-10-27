import { eventNames } from "process";
import { useRecoilState, useRecoilValue } from "recoil";
import { hourSelector, minuteState, secSelector } from "./atoms";

function App() {
  const [minutes, setMinutes] = useRecoilState(minuteState);
  const [hours, setHours] = useRecoilState(hourSelector);
  const [seconds, setSeconds] = useRecoilState(secSelector);
  const onMinutesChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+event.currentTarget.value);
  };

  const onHoursChange = (event: React.FormEvent<HTMLInputElement>) => {
    setHours(+event.currentTarget.value);
  };
  const onSecondsChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSeconds(+event.currentTarget.value);
  };
  return (
    <div>
      <input
        value={seconds}
        onChange={onSecondsChange}
        type="number"
        placeholder="Seconds"
      />
      <input
        value={minutes}
        onChange={onMinutesChange}
        type="number"
        placeholder="Minutes"
      />
      <input
        value={hours}
        onChange={onHoursChange}
        type="number"
        placeholder="Hours"
      />
    </div>
  );
}

export default App;
