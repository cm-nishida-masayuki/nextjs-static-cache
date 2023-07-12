import Image from "next/image";
import Link from "next/link";
import { priceFormat } from "./util";
import { products } from "./data";

export default function Home() {
  return (
    <main className="mx-5">
      <div className="flex gap-x-5">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="flex gap-3 shadow-md p-4 rounded-md">
              <Image
                alt=""
                width={200}
                height={200}
                src={product.image}
                sizes="50vw"
                className="object-cover w-56 h-56"
              />
              <div key={product.id}>
                <h2>{product.name}</h2>
                <p>価格1: {priceFormat(product.price)}</p>
                <p>{product.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
