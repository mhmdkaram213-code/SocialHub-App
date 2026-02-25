
import React from 'react';

export default function PostCardSkeleton() {
    return (
        <div className="post-card bg-white rounded-lg shadow p-8 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <header className="post-header flex items-center justify-between">
                <div className="user-info flex items-center gap-2">
                    <div className="size-12 rounded-full bg-gray-200" />
                    <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                    </div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
            </header>
            {/* Post Text Skeleton */}
            <figure className="post-info">
                <div className="mb-4 h-4 w-3/4 bg-gray-200 rounded" />
                <div className="mb-2 h-4 w-2/3 bg-gray-100 rounded" />
                <div className="-mx-8">
                    <div className="w-full h-60 bg-gray-200 rounded-lg" />
                </div>
            </figure>
            {/* Reactions Skeleton */}
            <div className="reactions flex items-center justify-between">
                <div className="likes flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="icon bg-gray-200 size-8 rounded-full" />
                        <div className="icon bg-gray-200 size-8 rounded-full" />
                    </div>
                    <div className="h-3 w-10 bg-gray-100 rounded" />
                </div>
                <div className="h-3 w-12 bg-gray-100 rounded" />
            </div>
            {/* Action Buttons Skeleton */}
            <div className="action-btn flex items-center text-lg -mx-8 text-gray-700 border-y border-gray-400/30 p-2 gap-2">
                <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                <div className="h-8 w-20 bg-gray-100 rounded-lg" />
            </div>
            {/* Comments Skeleton */}
            <section>
                <div className="all-comments space-y-4">
                    <div className="flex gap-2 items-center">
                        <div className="size-8 rounded-full bg-gray-200" />
                        <div className="h-3 w-32 bg-gray-100 rounded" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="size-8 rounded-full bg-gray-200" />
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="size-8 rounded-full bg-gray-200" />
                        <div className="h-3 w-28 bg-gray-100 rounded" />
                    </div>
                </div>
            </section>
        </div>
    );
}