import { atom, selector } from "recoil";

export const minuteState = atom({
  key: "minutes",
  default: 0,
});

export const secSelector = selector<number>({
  key: "seconds",
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes * 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) / 60;
    set(minuteState, minutes);
  },
});

export const hourSelector = selector<number>({
  key: "hours",
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minuteState, minutes);
  },
});
