"use client"

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import toast from 'react-hot-toast'
import Input from '@/components/inputs/Input'
import Button from '@/components/Button'
import AuthSocialButton from './AuthSocialButton'
import {BsGithub, BsGoogle} from "react-icons/bs"

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


  const socialAction = (action: string) => {
    setIsLoading(true)

    signIn(action, { redirect: false })
			.then((callback) => {
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
	

	return (
		<>
			<div className={`sm:mx-auto sm:w-full sm:max-w-md`}>
				<h2 className="mt-6 text-2xl font-bold tracking-tight text-center text-gray-900">
					{varient === "LOGIN" ? "로그인" : "회원가입"}
				</h2>
			</div>
			<div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
				<div className="px-4 py-8 bg-white sm:rounded-lg sm:px-10">
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
						<div className="relative">
							<div className={`absolute inset-0 flex items-center`}>
								<div className={`w-full border-t border-gray-300`} />
							</div>
							<div className={`relative flex justify-center text-sm`}>
								<span className={`px-2 text-gray-500 bg-white`}>
									소셜로그인
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2 mt-6">
							<AuthSocialButton
								icon={BsGithub}
								onClick={() => socialAction("github")}
							/>
							<AuthSocialButton
								icon={BsGoogle}
								onClick={() => socialAction("google")}
							/>
						</div>
						<div className="flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500">
							<div>
								{varient === "LOGIN"
									? "메신저를 처음 사용하시나요?"
									: "이미 계정이 있나요?"}
							</div>
							<div onClick={toggleVarient} className="underline cursor-pointer">
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