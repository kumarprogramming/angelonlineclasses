import ProductList from "@/components/shared/products/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home"
};

const HomePage = async () => {
    const latestProducts = await getLatestProducts();
    return (
        <>
            <ProductList data={latestProducts} title='Latest Arrivals' />
        </>
    );
}

export default HomePage;