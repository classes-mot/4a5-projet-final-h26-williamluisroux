import AuthForm from "../components/Auth/AuthForm";

export default function Auth({ isLoginMode, onClose }) {
  return <AuthForm isLoginMode={isLoginMode} onClose={onClose} />;
}
