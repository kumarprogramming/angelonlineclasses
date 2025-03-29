'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";

export async function createOrder() {
    try {
     // get session and userId
        const session = await auth();
        if(!session) throw new Error('User is not authenticated')
        
        const userId = session?.user?.id;
        if (!userId) throw new Error('User not found');

        const user = await getUserById(userId);

        // get the existing cart from database
        const cart = await getMyCart();
        if (!cart || cart.items.length === 0) {
            return {success: false, message: 'Cart is empty' , redirectTo:'/cart'}
        }
        if (!user.address) { 
            return { success: false, message: 'No shipping address', redirectTo: '/shipping-address' }
        }
        if (!user.paymentMethod) {
            return { success: false, message: 'No Payment method', redirectTo: '/payment-method' }
        }

        // create order 
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const insertedOrderId = await prisma.$transaction(async (tx:any) => {
            // insert data to order
            const insertedOrder = await tx.order.create({ data: order });

            // insert data to order item 
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        order: { connect: { id: insertedOrder.id } },
                        product: { connect: { id: item.productId } },
                        qty: item.qty,
                        price: item.price,
                        name: item.name,
                        slug: item.slug,
                        image: item.image
                    }
                })
            }
            // clear cart table
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    itemsPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: 0,
                }
            });

            return insertedOrder.id
        });

        if (!insertedOrderId) throw new Error('Order not created');

        return {success: true, message: 'Order created successfully', redirectTo:`/order/${insertedOrderId}`}

 } catch (error) {
     if (isRedirectError(error)) throw error;
     return {success: false, message: formatError(error)}
 }   
}

// get order by id
export async function getOrderById(orderId:string) {
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: {name:true, email:true} }
        }
    });
    return convertToPlainObject(data);
}