import AuthForm from "../components/Form";

export default function Login() {
  return (
    <div className="flex flex-1 justify-center items-center w-full h-screen">
      <AuthForm route="/api/token/" method="login"  />
    </div>
  );
}
