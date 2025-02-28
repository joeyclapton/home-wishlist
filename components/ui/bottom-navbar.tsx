import Link from 'next/link';
import { HomeIcon, ListChecks, PackageIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNavbar() {
  const pathname = usePathname();

  const menuList = [
    {
      path: '/',
      icon: <PackageIcon size={26} strokeWidth={1.25} />,
    },
    {
      path: '/list',
      icon: <ListChecks size={26} strokeWidth={1.25} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
      <ul className="flex justify-around p-6">
        {menuList.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`${cn('flex flex-col', pathname !== item.path && 'opacity-40')}`}
            >
              {item.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
