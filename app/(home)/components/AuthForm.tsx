"use client"

import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import axios from "axios"
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from 'react-hot-toast'

type Varient = "LOGIN" | "REGISTER"
const AuthForm = () => {
	const session = useSession();
	const router = useRouter();
	const [varient, setVarient] = useState<Varient>("LOGIN");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (session?.status === "authenticated") {
			router.push("/conversations");
		}
	}, [router, session?.status]);

	const toggleVarient = () => {
		if (varient === "LOGIN") {
			setVarient("REGISTER");
		} else {
			setVarient("LOGIN");
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);

		if (varient === "REGISTER") {
      axios
				.post("/api/register", data)
				.then(() =>
					signIn("credentials", {
						...data,
						redirect: false,
					}),
				)
				.then((callback) => {
					if (callback?.error) {
						toast.error("Invalid credentials");
					}

          if (callback?.ok) {
            router.push("/conversations");
					}
        })
        .catch((err) => { toast.error(err?.response?.data ?? "서버 오류가 발생했습니다") })
      .finally(() => {setIsLoading(false)})
    } 
    
    if (varient === "LOGIN") {
      signIn("credentials", {
				...data,
				redirect: false,
			})
      .then((callback) => {
				console.log(callback);
				
        if (callback?.error) {
          toast.error("Invalid credentials");
        }

        if (callback?.ok) {
          router.push("/conversations");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
	};

	return (
		<>
			<div className={`sm:mx-auto sm:w-full sm:max-w-md`}>
				<div className='flex justify-center items-center'>
					<Image src={"/images/logo_white.png"} width={180} height={20} alt='Hi Chat Logo' />
				</div>
				<h2 className="mt-4 text-2xl font-semibold tracking-tight text-center text-gray-300 presentation">
					{varient === "LOGIN" ? "로그인" : "회원가입"}
				</h2>
			</div>
			<div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
				<div className="px-4 py-8 bg-[#161616] border border-[#242424] sm:px-10">
					<form
						action=""
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-5"
					>
						{varient === "REGISTER" && (
							<Input
								disabled={isLoading}
								register={register}
								errors={errors}
								required
								id="name"
								label="이름"
							/>
						)}
						<Input
							disabled={isLoading}
							register={register}
							errors={errors}
							required
							id="email"
							label="이메일"
							type="email"
						/>
						<Input
							disabled={isLoading}
							register={register}
							errors={errors}
							required
							id="password"
							label="비밀번호"
							type="password"
						/>
						<div>
							<Button disabled={isLoading} fullWidth type="submit">
								{varient === "LOGIN" ? "로그인" : "회원가입"}
							</Button>
						</div>
					</form>
					<div className="mt-6">
						<div className="flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500">
							<div>
								{varient === "LOGIN"
									? "메신저를 처음 사용하시나요?"
									: "이미 계정이 있나요?"}
							</div>
							<div onClick={toggleVarient} className="underline cursor-pointer text-gray-400 hover:text-gray-200 transition">
								{varient === "LOGIN" ? "계정만들기" : "로그인하기"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AuthForm