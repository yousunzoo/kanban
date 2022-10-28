import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";

interface IForm {
  category: string;
}

function AddCategory() {
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("category", { required: true })}
        placeholder="새 보드의 이름을 입력하세요"
      />
    </form>
  );
}

export default AddCategory;
