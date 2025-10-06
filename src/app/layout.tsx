import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "./components/theme-provider";
import NavbarDesktop from "./components/navigation/navbarDesktop";
import NavMobile from "./components/navigation/navMobile";
import QueryProvider from "./components/QueryProvider";
import ConditionalFooter from "./components/ConditionalFooter"; // ⬅️ new import

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} mb-20 md:mb-0 scrollBar`}>
        <QueryProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <NavbarDesktop />
            <NavMobile />
            {children}
            <ConditionalFooter />{" "}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
