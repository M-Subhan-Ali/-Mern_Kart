import { Suspense } from "react";
import ProductList from "../../components/ProductList";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 pt-20">Loading products...</div>}>
      <ProductList />
    </Suspense>
  );
}
