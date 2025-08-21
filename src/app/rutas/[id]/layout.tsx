import { mockRoutes } from '@/data/mockRoutes';

export async function generateStaticParams() {
  return mockRoutes.map((route) => ({
    id: route.id.toString(),
  }));
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}