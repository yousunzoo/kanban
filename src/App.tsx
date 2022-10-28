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
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  margin-top: 40px;
  padding: 30px 0;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
`;

const Title = styled.h1`
  margin-top: 50px;
  text-align: center;
  font-size: 40px;
  font-weight: 700;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type } = info;
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
    if (destination.droppableId === "trash") {
      // trash button으로 이동시켰을 때
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
      destination.droppableId !== "trash" &&
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
    if (destination.droppableId !== "trash" && type === "board") {
      setToDos((prev) => {
        // 객체 배열화
        const entries = Object.entries(prev);
        // 선택된 객체 삭제
        const [temp] = entries.splice(source.index, 1);
        console.log(temp);
        entries.splice(destination.index, 0, temp);
        console.log(entries);
        return entries.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      });
    }
  };

  return (
    <>
      <Title>Hello Kanban board</Title>
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
