import { useRef } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

const Wrapper = styled.div`
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
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
  button {
    border: none;
    background-color: #fff;
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
`;
const Title = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

interface IAreaProps {
  isDraggingOver?: boolean;
  isDraggingFromThis?: boolean;
  isDragging?: boolean;
}
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#ecf0f1"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 10px;
`;

const Form = styled.form`
  width: 100%;
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
  };
  const onClick = () => {
    setToDos((prev) => {
      const newBoards = { ...prev };
      delete newBoards[boardId];
      return { ...newBoards };
    });
  };
  return (
    <Draggable draggableId={boardId} index={index} key={boardId}>
      {(magic, snapshot) => (
        <Wrapper ref={magic.innerRef} {...magic.draggableProps}>
          <TitleArea>
            <Title {...magic.dragHandleProps}>{boardId}</Title>
            <button type="button" onClick={onClick}>
              X
            </button>
          </TitleArea>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}`}
            />
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
