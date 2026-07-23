import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api/users";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await loginAPI(form);
      login(data);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "로그인에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-10 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] w-full max-w-[400px]">
        <h1 className="text-center mb-8 text-[28px] font-bold text-[#1a1a2e]">로그인</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              이메일
            </label>
            <input
              className="px-[14px] py-[10px] border border-gray-300 rounded-lg text-[15px] outline-none transition-colors focus:border-[#7b2d43]"
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              비밀번호
            </label>
            <input
              className="px-[14px] py-[10px] border border-gray-300 rounded-lg text-[15px] outline-none transition-colors focus:border-[#7b2d43]"
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
          </div>
          <button
            className="mt-2 p-3 bg-[#7b2d43] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-[#5f2233] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          아직 계정이 없으신가요?{" "}
          <Link className="text-[#7b2d43] font-medium hover:underline" to="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
