'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { shippingAddressDefaultValue } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validator";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddress>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValue
    });
    const [isPending, startTransition] = useTransition();

    const OnSubmit = async (data: ShippingAddress) => {
        try {
            startTransition(async () => {
                const res = await updateUserAddress(data);
                if (!res.success) {
                    toast.error(`${res.message}`);
                    return
                }
                router.push('/payment-method');
            });
        } catch (error) {
            if (isRedirectError(error)) {
                router.refresh();
            }
        }
    }
    return (<>
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2-bold mt-4">Shipping Address</h1>
            <p className="text-sm text-muted-foreground">Please enter your shipping address</p>
            <form onSubmit={handleSubmit(OnSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" {...register("fullName")} />
                    {errors.fullName && <p className="mt-1 text-red-500">{errors.fullName.message}</p>}
                </div>
                <div>
                    <Label htmlFor="streetAddress">Address</Label>
                    <Input id="streetAddress" {...register("streetAddress")} />
                    {errors.streetAddress && <p className="mt-1 text-red-500">{errors.streetAddress.message}</p>}
                </div>
                <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && <p className="mt-1 text-red-500">{errors.city.message}</p>}
                </div>
                <div>
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input id="postalCode" {...register("postalCode")} />
                    {errors.postalCode && <p className="mt-1 text-red-500">{errors.postalCode.message}</p>}
                </div>
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register("country")} />
                    {errors.country && <p className="mt-1 text-red-500">{errors.country.message}</p>}
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <ArrowRight className="w-4 h-4" />
                        )} {' '} Continue
                    </Button >
                </div>
            </form>
        </div>
    </>);
}

export default ShippingAddressForm;