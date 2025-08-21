import { mockOrders } from '@/data/mockOrders';

export async function generateStaticParams() {
  return mockOrders.map((order) => ({
    id: order.id.toString(),
  }));
}

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}