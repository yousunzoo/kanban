import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "toDo",
});
export interface ITodo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },

  effects_UNSTABLE: [persistAtom],
});

export const boardState = atom<string[]>({
  key: "boards",
  default: ["To Do", "Doing", "Done"],
  effects_UNSTABLE: [persistAtom],
});
