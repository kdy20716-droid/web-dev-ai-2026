import { useState } from "react";
import { register } from "../api/users";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const inputClass =
  "px-[14px] py-[10px] border border-[#d9a8b5] rounded-lg text-sm w-full outline-none mb-2.5 bg-[#f7e8ec] focus:border-[#7b2d43]";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await register(form);
      toast.success("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("이미 사용 중인 이메일입니다!");
      } else {
        toast.error(error.response?.data?.message ?? "회원가입에 실패했습니다");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto my-20 p-10 border border-gray-200 rounded-lg">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={inputClass}
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <input
          className={inputClass}
          type="text"
          placeholder="이메일"
          value={form.email}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <input
          className={inputClass}
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
          }
        />
        <button
          className="p-3 bg-[#7b2d43] text-white border-none rounded-lg cursor-pointer text-[15px] w-full hover:bg-[#5f2233] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};
export default RegisterPage;
