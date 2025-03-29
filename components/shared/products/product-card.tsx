import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="p-0 items-center">
                <Link href={`product/${product.slug}`} >
                    <Image src={product.images[0]} alt={product.name} width={300} height={300} priority={true} />
                </Link>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`product/${product.slug}`} >
                    <h2 className="text-sm font-medium">{product.name}</h2>
                </Link>
                {/* display colour */}
                <div className="flex item-center gap-2">
                    <p className="text-md"> Color:</p>
                    <div className="flex gap-1">
                        {product.colors?.map((color: string, index: number) => (
                            <div key={index} className="w-5 h-5 rounded-full border" style={{ backgroundColor: color }} title={color} />
                        ))}
                    </div>
                </div>

                {/* display size */}
                <div className="flex item-center gap-2">
                    <p className="text-md"> Size:</p>
                    <div className="flex gap-1">
                        {product.sizes?.map((size: string, index: number) => (
                            <div key={index} className="px-2 py-1 border text-xs font-medium rounded-md">
                                { size}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-between gap-4">
                    <p>{product.rating} Stars</p>
                    {product.stock > 0 ? (
                        <ProductPrice value={Number(product.price)} />
                    ) : (
                        <p className="text-destructive">Out of stock!</p>
                    )}
                </div>
            </CardContent>

        </Card>
    );
}

export default ProductCard;