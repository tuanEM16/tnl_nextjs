// components/public/home/FeaturedProducts.js
'use client';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import ProductCard from '../product/ProductCard';
import Button from '../ui/Button';
import { usePublicProducts } from '@/hooks/public/usePublicProducts';
import Link from 'next/link';

export default function FeaturedProducts() {
  const { products, loading } = usePublicProducts({ featured: 1 });

  if (loading) return null;

  return (
    <section className="py-24 bg-white">
      <Container>
        <SectionTitle 
          subtitle="Kho hàng Tân Ngọc Lực" 
          title="Sản phẩm nổi bật" 
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/products">
            <Button variant="outline">XEM TẤT CẢ SẢN PHẨM</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}