import { getOrderById } from "@/lib/actions/order.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { PAYPAL_CLIENT_ID } from "@/lib/constants";

export const metadata: Metadata = {
    title: 'Order Details'
}
const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
    const { id } = await props.params;
    const order = await getOrderById(id);
    if (!order) notFound();

    return (<>
        <OrderDetailsTable order={order} payPalClientId={ PAYPAL_CLIENT_ID} />
    </>);
}

export default OrderDetailsPage;