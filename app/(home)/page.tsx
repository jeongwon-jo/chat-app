import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className={`flex flex-col justify-center min-h-full py-12 bg-[#0d0d0d] px-6 lg:px-8`}>
      <AuthForm />
    </div>
  );
}
