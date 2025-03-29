'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValue } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SignUpFormSchemaType } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpFormSchema } from "@/lib/validator";
import { signUpUser } from "@/lib/actions/user.actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [actionError, setActionError] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormSchemaType>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: signUpDefaultValue
    });

    const onSubmit = async (data: SignUpFormSchemaType) => {
        setActionError(null);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("confirmPassword", data.confirmPassword);

            const response = await signUpUser(null, formData);

            if (response.success) {
                console.log(response.message);
            } else {
                setActionError(response.message);
            }
        } catch (error) {
            console.log(error);
            if (isRedirectError(error)) { 
                router.refresh();
            }
            setActionError("An unexpected error occurred. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="mt-1 text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} />
                {errors.email && <p className="mt-1 text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type='password' {...register("password")} />
                {errors.password && <p className="mt-1 text-red-500">{errors.password.message}</p>}
            </div>

            <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type='password' {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="mt-1 text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Submitting...' : 'Sign Up'}
                </Button>
            </div>

            {actionError && (
                <div className="text-center text-red-500">
                    {actionError}
                </div>
            )}

            <div className="text-sm text-center text-muted-foreground">
                Already have an account? {' '}
                <Link href='/sign-in' target="_self" className="link">
                    Sign In
                </Link>
            </div>
        </form>
    );
}

export default SignUpForm;