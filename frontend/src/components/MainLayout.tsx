import type { PropsWithChildren } from "react";
import { Header } from "./Header"

export const MainLayout = (props: PropsWithChildren) => {
  return (
      <main>
        <Header />
        { props.children } 
      </main>
  );
};