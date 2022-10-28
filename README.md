# 칸반 보드

: 단계별 작업 현황을 열(column) 형식의 보드 형태로 시각화

- 드래그 앤 드롭 기능 구현

## recoil

### selector

- selector는 쓰기 가능한 상태를 반환한다.
  `const hourSelector = selector({key:"hours", get : ({get})=>{return ~}, set : ({set}) => {return ~}})`

- input의 value는 타입과 관계없이 문자열을 반환한다.
- string 형식으로 된 숫자를 number로 바꿔주는 방법 -> 앞에 +를 붙여준다.
- +"1" => 1

* 연습하기) 시간 <-> 분 단위 변환기 만들기

- minutes input 과 hours input 어느 쪽에서 입력하던지 그 값을 변환해주는 변환기.
- recoil selector를 이용해서 만들기

- get : 다른 atom이나 selector로부터 값을 찾는데 사용되는 함수.
- set : 원하는 state가 어떤 것이던지 그걸로 수정하게끔 해준다.

- set의 첫 번째 매개변수는 Recoil state, 두번째 매개변수는 새로운 값이다. 새로운 값은 업데이트 합수나 재설정 액션을 전파하는 DefaultValue 객체일 수 있다.
  `set : ({set}, newValue) => set(myAtom, newValue)`

## drag and drop

- react-beautiful-dnd : React로 list를 만들기 위한 아름답고 접근 가능한 드래그 앤 드롭 라이브러리

- `<DragDropContext>`, `<Droppable>`, `<Draggable>`로 구성되어 짐.
- DragDropContext는 드래그 앤 드롭을 가능하게 하고자 하는 영역을 감싸는 컴포넌트이다.
- Droppable : 무언가를 드래그 앤 드롭할 수 있는 영역
- Draggable : droppable 영역 안에서 드래그 하는 영역 -- 고유한 key를 추가해야 한다!
- droppable과 draggable의 children에는 함수만 넣을 수 있다.

- dragHandleProps : 특정 영역을 통해서만 드래그를 가능하도록 하고 싶을 때 사용한다.
- droppable과 draggable은 provided라는 객체를 제공한다. provided 안에서 dragHandleProps, draggableProps, droppableProps, innerRef 등을 꺼내 쓸 수 있다.

- dragHandleProps : 특정 영역을 통해서만 드래그를 가능하도록 하고싶을 때 사용한다.
- provided.placeholder : draggable 엘리먼트를 드래그하는 동안 보드 영역을 position:fixed 적용한다. draggable을 드래그할 때 Droppable 리스트가 작아지는 것을 방지하기 위해 필요하다. </Draggable> 뒤에 {provided.placeholder}를 입력해준다.

### onDragEnd

- result : DropResult
- result.draggableId : 드래그되었던 Draggable의 id
- result.type : 드래그되었던 draggable의 type
- result.source : draggable이 시작된 위치(location)
- result.destination : draggable이 끝난 위치(location). 시작한 위치와 같은 위치로 돌아오면 destination 값은 null이 된다.

### Array.prototype.splice()

: 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경한다. -> 깊은 복사

- 드래그 앤 드롭시 list 배열 다시 설정하기

1. .splice(index,1)로 해당 값 삭제하기
2. .splice(index, 0, "해당 값") => 원하는 자리에, 아무것도 삭제하지 않고 해당 값을 집어 넣는다.

문제점) 배열을 재조정하는데 시간을 거친다. -- 모든 card를 다시 렌더링하고있기 때문.

- todo를 잡는 즉시 모든 todo가 다시 렌더링된다. => react의 memo 기능을 사용함

### React.memo(Component)

: prop이 바뀌지 않는다면 컴포넌트를 렌더링하지 않도록 한다.
=> React.memo(DraggableCard)를 하면 순서가 바뀌지 않는 toDo는 리렌더링하지 않는다.

### Object.keys(objectname)

: object가 가진 key만 array로 반환한다. -> boardID로 활용
`Object.keys(toDos).map(boardId => toDos[boardId]`

### Object.values(objectname)

:object의 각 배열을 반환한다.

## 구현해야 할 기능

### 보드 내에서의 이동

- to do li의 이름은 draggableId와 동일
- board의 이름은 drpppableId와 동일
- source와 destination의 dropppableId 가 같은지 확인 : 한개의 보드 안에서 움직임을 확인
- 수정이 일어난 보드의 배열만 복사 후 그 복사본을 기존 배열에 붙여넣기 한다.

### 보드 밖으로의 이동

- source board와 destination board 두 개 복사
- source board의 item을 제거하고 target board에 item 추가

### 보드를 떠날 때와 도착했을 때 색상을 바꿔야 할 타이밍

- droppable과 draggable은 provided 뿐만 아니라 snapshot도 제공한다.
- snapshot : isDraggingOver, draggingOverWith, draggingFromThisWith, isUsingPlaceholder에 대한 boolean 값을 받는다.
