import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div
      className={`flex flex-col justify-center min-h-full py-12 bg-[#121212] px-5`}
    >
      <AuthForm />
    </div>
  );
}
