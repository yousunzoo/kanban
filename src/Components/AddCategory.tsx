import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

interface IForm {
  category: string;
}

const Form = styled.form`
  width: 400px;
  margin: auto;
  margin-top: 30px;
  input {
    width: 100%;
    height: 50px;
    border: 1px solid #000;
    border-radius: 25px;
    background-color: white;
    text-align: center;
    font-size: 20px;
    &::placeholder {
      text-align: center;
    }
  }
  button {
    width: 100%;
    height: 50px;
    border: none;
    background-color: #273c75;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    border-radius: 25px;
    color: #fff;
    cursor: pointer;
  }
`;
function AddCategory() {
  const [open, setOpen] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ category }: IForm) => {
    if (category !== "") {
      if (
        Object.keys(toDos).some(
          (v) => v.toLowerCase() === category.toLowerCase()
        )
      )
        return;
      setToDos({ ...toDos, [category]: [] });
      setValue("category", "");
      setOpen(false);
    }
  };
  const onClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <Form onSubmit={handleSubmit(onValid)}>
      {open && (
        <input
          {...register("category", { required: true })}
          placeholder="새 보드의 이름을 입력하세요"
        />
      )}
      {!open && <button onClick={onClick}>카테고리 추가</button>}
    </Form>
  );
}

export default AddCategory;
