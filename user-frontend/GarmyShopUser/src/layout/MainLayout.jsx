import { HeaderComponent } from "../components/HeaderComponent";

export function MainLayout({ children }) {
  return (
    <>
      <HeaderComponent />
      <main>{children}</main>
    </>
  );
}
