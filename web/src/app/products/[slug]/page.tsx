import { priceFormat } from "@/app/util";
import Image from "next/image";
import { products } from "@/app/data";

export async function generateStaticParams() {
  const params = products.map((products) => {
    return {
      slug: products.id.toString(),
    };
  });

  return params;
}

export default function Product({ params }: { params: { slug: string } }) {
  const product = products.find(
    (product) => product.id === parseInt(params.slug)
  );

  if (product == undefined) {
    return <p>Not Found Item</p>;
  }

  return (
    <main>
      <div className="flex gap-x-3">
        <div className="w-60 h-60 relative">
          <Image fill src={product.image} alt="" className="object-cover" />
        </div>
        <div>
          <h1>{product.name}</h1>
          <section>
            <p>{priceFormat(product.price)}</p>
            <p>{product.description}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
