import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";


export const metadata: Metadata = {
    title: "ShippingAddress"
}

const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    const headersList = await headers();
    const callbackUrl = headersList.get('next-url');

    if (!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) redirect(`/sign-in?callbackUrl=${callbackUrl}`);
    const user = await getUserById(userId);

    return (
        <>
            <CheckoutSteps current={1} />
            <ShippingAddressForm address={user.address as ShippingAddress} />
        </>
      
    );
}

export default ShippingAddressPage;