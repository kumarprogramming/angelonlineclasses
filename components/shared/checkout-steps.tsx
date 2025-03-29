import { cn } from "@/lib/utils";

const checkoutSteps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order'];
const CheckoutSteps = ({ current = 0 }: { current: number }) => {
    return (
        <div className="flex justify-center items-center text-center flex-col md:flex-row w-[70%] mx-auto mb-10 mt-4">
            {checkoutSteps.map((step, index) => (
                <div key={step} className="flex items-center w-full mb-2">
                    <div className={cn('p-2 w-56 rounded-full text-center text-sm bg-gray-200',
                        index === current && 'bg-gray-600 text-white'
                    )}>
                        {step}
                    </div>
                    {
                        index < checkoutSteps.length - 1 &&
                        (
                            <div className="hidden md:flex flex-1 justify-center w-full">
                                <hr className="w-full border-t-2 border-gray-300" />
                            </div>
                        )
                    }
                </div>
            ))}
        </div>
    );
}

export default CheckoutSteps;