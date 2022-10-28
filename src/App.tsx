import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import trashCan from "./trash-can.svg";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

const Delete = styled.div<IDelete>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${(props) =>
    props.isDraggingOver ? "#e74c3c" : "#34495e"};
  width: 200px;
  height: 100px;
  border-radius: 100px 100px 0 0;
  img {
    width: 50px;
    height: auto;
    filter: brightness(0) invert(1);
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    bottom: 20px;
  }
`;

interface IDelete {
  isDraggingOver: boolean;
}
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source?.droppableId) {
      // 보드 내에서의 이동
      setToDos((allBoards) => {
        // 변화가 일어난 배열만 복사
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        // boardCopy와 이전의 state와 다른 boards를 모두 return 해야 함
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // 보드 간의 이동
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
      <Droppable droppableId="delete">
        {(magic, snapshot) => {
          return (
            <Delete
              ref={magic.innerRef}
              isDraggingOver={snapshot.isDraggingOver}>
              <img src={trashCan} alt="delete button" />
            </Delete>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
