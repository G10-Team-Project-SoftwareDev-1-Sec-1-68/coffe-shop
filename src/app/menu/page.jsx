import React from "react";
import Header from "../components/Header";

const page = () => {
  return (
    <div>
        <Header />
        <div className="flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Menu
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-card shadow-lg border border-border p-4 rounded-2xl">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Coffee
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default page