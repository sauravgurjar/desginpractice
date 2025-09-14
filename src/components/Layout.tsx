import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-white relative">
            {/* Dual Gradient Overlay (Bottom) Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 20% 100%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.3), transparent)
      `,
                    backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
                }}
            />
            {/* Your Content/Components */}


            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default Layout;
