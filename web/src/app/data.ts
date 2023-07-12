interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "ドギーマン",
    price: 100,
    description: "めっちゃ美味しい",
    image: "/images/dog-01.jpg",
  },
  {
    id: 2,
    name: "ドギーマン3",
    price: 200,
    description: "めっちゃ美味しいし栄養ある",
    image: "/images/dog-02.jpg",
  },
];
