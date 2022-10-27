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
