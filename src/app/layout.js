import "./globals.css";
import Navbar from "@/components/navBar/NavBar";

export const metadata = {
  title: "Mining Operations - AI Control Tower | AIIS",
  description: "AI-Powered Industrial Operations Platform - Accenture Industrial Intelligence Suite",
  keywords: ["AIIS", "Accenture", "Industrial AI", "Predictive Maintenance", "Mining Operations", "Azure AI", "Control Tower"],
  authors: [{ name: "Accenture" }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Mining Operations - AI Control Tower | AIIS",
    description: "AI-Powered Industrial Operations Platform - Accenture Industrial Intelligence Suite",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-16 h-screen">
        <Navbar />
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-3 w-full h-[calc(100vh-4rem)] max-w-screen-3xl mx-auto flex flex-col box-border">
          {children}
        </div>
      </body>
    </html>
  );
}
