import Providers from "@/components/Providers";
import "../styles/globals.css";

export const metadata = {
  title: "Gabbers",
  description: "Real-time language practice platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
