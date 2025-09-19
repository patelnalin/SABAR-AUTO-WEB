
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const BreadcrumbTrail = () => {
    const pathname = usePathname();
    if (pathname === '/dashboard') {
        return null;
    }
    const pathSegments = pathname.split('/').filter(segment => segment);

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/_/g, ' ');
        return { href, name, isLast };
    });

    return (
        <nav aria-label="Breadcrumb" className="mb-1 text-sm font-medium text-muted-foreground bg-background">
            <ol className="flex items-center space-x-1.5 ml-5">
                <li>
                    <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                </li>
                {breadcrumbs.slice(1).map((breadcrumb, index) => (
                    <li key={breadcrumb.href} className="flex items-center space-x-1.5">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <Link
                            href={breadcrumb.href}
                            className={cn(
                                'transition-colors hover:text-primary',
                                breadcrumb.isLast && 'text-foreground pointer-events-none'
                            )}
                            aria-current={breadcrumb.isLast ? 'page' : undefined}
                        >
                            {breadcrumb.name}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
};


const Breadcrumbs = () => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient ? <BreadcrumbTrail /> : null;
};

export default Breadcrumbs;
