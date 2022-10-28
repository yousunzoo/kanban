import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import trashCan from "../trash-can.svg";

interface IDelete {
  isDraggingOver: boolean;
}

const Delete = styled.div<IDelete>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${(props) =>
    props.isDraggingOver ? "#e74c3c" : "#34495e"};
  width: 150px;
  height: 75px;
  border-radius: 75px 75px 0 0;
  img {
    width: 40px;
    height: auto;
    filter: brightness(0) invert(1);
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    bottom: 15px;
  }
`;

function TrashCan() {
  return (
    <Droppable droppableId="delete">
      {(magic, snapshot) => {
        return (
          <Delete ref={magic.innerRef} isDraggingOver={snapshot.isDraggingOver}>
            <img src={trashCan} alt="delete button" />
          </Delete>
        );
      }}
    </Droppable>
  );
}
export default TrashCan;
