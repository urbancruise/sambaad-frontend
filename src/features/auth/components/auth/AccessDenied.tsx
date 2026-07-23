"use client";

export default function AccessDenied() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600">
                    403
                </h1>

                <p className="mt-2">
                    Access Denied
                </p>
            </div>
        </div>
    );
}