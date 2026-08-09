import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Argus Security Platform",
  description: "Unified Web GUI for Cybersecurity Tooling",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className="bg-bg-primary text-secondary antialiased min-h-screen">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 ml-56 p-8 max-w-[1200px]">{children}</main>
        </div>
      </div>
      </body>
      </html>
  );
}