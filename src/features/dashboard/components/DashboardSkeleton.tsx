import Skeleton from "@/src/components/common/Skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6">

            <Skeleton className="h-24 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />

            </div>

            <Skeleton className="h-72 w-full" />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <Skeleton className="h-80" />
                <Skeleton className="h-80" />

            </div>

        </div>
    );
}