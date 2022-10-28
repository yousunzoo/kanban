import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { boardState, toDoState } from "./atoms";
import Board from "./Components/Board";
import TrashCan from "./Components/TrashCan";
import AddCategory from "./Components/AddCategory";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 0;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.index === source?.index) {
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
    if (destination?.index !== source?.index) {
      // 보드 자체를 이동
    }
    if (destination.droppableId === "delete") {
      // delete button으로 이동시켰을 때
      setToDos((allBoards) => {
        // 변화가 일어난 배열만 복사
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (
      destination.droppableId !== "delete" &&
      destination.droppableId !== source.droppableId
    ) {
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
    <>
      <AddCategory />
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Droppable droppableId="boards" direction="horizontal" type="board">
            {(magic) => (
              <Boards ref={magic.innerRef} {...magic.droppableProps}>
                {Object.keys(toDos).map((boardId, index) => (
                  <Board
                    boardId={boardId}
                    key={boardId}
                    index={index}
                    toDos={toDos[boardId]}
                  />
                ))}
                {magic.placeholder}
              </Boards>
            )}
          </Droppable>
        </Wrapper>
        <TrashCan />
      </DragDropContext>
    </>
  );
}

export default App;
