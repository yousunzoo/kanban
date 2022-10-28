import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DragabbleCard from "./DragabbleCard";
import deleteI from "../x-symbol.svg";
import addI from "../add-symbol.svg";

const Wrapper = styled.div`
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const TitleArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const BtnArea = styled.div`
  button {
    border: none;
    background-color: transparent;
    width: 30px;
    height: 30px;
  }
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  min-width: 150px;
  text-transform: capitalize;
`;

interface IAreaProps {
  isDraggingOver?: boolean;
  isDraggingFromThis?: boolean;
  isDragging?: boolean;
}
const Area = styled.div<IAreaProps>`
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#ecf0f1"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
`;

const Form = styled.form`
  width: 100%;
  margin-bottom: 20px;
  input {
    width: 100%;
    height: 30px;
    border: none;
    border-radius: 15px;
    text-align: center;
    font-size: 16px;
    &::placeholder {
      text-align: center;
      font-size: 16px;
    }
  }
`;
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index }: IBoardProps) {
  const [on, setOn] = useState(false);
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newTodo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
    setOn(false);
  };
  const onClickD = () => {
    setToDos((prev) => {
      const newBoards = { ...prev };
      delete newBoards[boardId];
      return { ...newBoards };
    });
  };
  const onClickA = () => {
    setOn(true);
  };
  return (
    <Draggable draggableId={boardId} index={index} key={boardId}>
      {(magic, snapshot) => (
        <Wrapper ref={magic.innerRef} {...magic.draggableProps}>
          <TitleArea>
            <Title {...magic.dragHandleProps}>{boardId}</Title>
            <BtnArea>
              <button type="button" onClick={onClickA}>
                <img src={addI} alt="add" />
              </button>
              <button type="button" onClick={onClickD}>
                <img src={deleteI} alt="delete" />
              </button>
            </BtnArea>
          </TitleArea>
          <Form onSubmit={handleSubmit(onValid)}>
            {on && (
              <input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`Add task on ${boardId}`}
              />
            )}
          </Form>
          <Droppable droppableId={boardId}>
            {(magic, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default Board;
