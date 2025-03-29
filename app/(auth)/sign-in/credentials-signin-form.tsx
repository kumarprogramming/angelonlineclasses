'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValue } from "@/lib/constants";
import Link from "next/link";
import { signInWithCredentials, signInWithFacebook, signInWithGoogle } from '@/lib/actions/user.actions';
import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: ''
    })
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isPendingFB, startTransitionFB] = useTransition();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const SignInButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button disabled={pending} className="w-full" variant="default">
                {pending ? 'Signing In..' : 'Sign In'}
            </Button>
        )
    }
    const googleSignIn = async () => {
        startTransition(async () => {
            await signInWithGoogle();
        });
    }

    const facebookSignIn = async () => {
        startTransitionFB(async () => {
            await signInWithFacebook();
        });
    }


    const GoogleSignInButton = () => {
        return (
            <>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 py-3 bg-white text-muted-foreground">OR</span>
                    </div>
                </div>
                <Button
                    className="w-full flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    variant="outline"
                    onClick={() => googleSignIn()}>
                    {isPending ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                            <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12   s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20    s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039   l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571   c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                    )} {' '} Sign in with Google
                </Button>
            </>
        )
    }

    const FacebookSignInButton = () => {
        return (
            <>
                <Button
                    className="w-full flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    variant="outline"
                    onClick={() => facebookSignIn()}>
                    {isPendingFB ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                            <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                        </svg>
                    )} {' '} Sign in with Facebook
                </Button>
            </>
        )
    }
    return (
        <form action={action}>
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <div className="space-y-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={signInDefaultValue.email} />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required autoComplete="password" defaultValue={signInDefaultValue.password} />
                </div>
                <div>
                    <SignInButton />
                </div>
                {data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message}
                    </div>
                )}
                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account? {' '}
                    <Link href='/sign-up' target="_self" className="link">
                        Sign Up
                    </Link>
                </div>
                <GoogleSignInButton />
                <FacebookSignInButton />
            </div>
        </form>
    );
}
export default CredentialsSignInForm;
