import React, { useEffect, useRef } from "react";
import { TopBarComponent } from "./Header/TopBarComponent";
import { LogoComponent } from "./Header/LogoComponent";
import { NavLinksComponent } from "./Header/NavLinksComponent";
import { IconsComponent } from "./Header/IconsComponent";
import '../styles/header.css';

export function HeaderComponent() {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;

    const onScroll = () => {
      if (window.scrollY > 50) {
        // Al bajar más de 50px, fija el header arriba con sombra y fondo
        header.style.position = "fixed";
        header.style.top = "0";
        header.style.left = "0";
        header.style.width = "100%";
        header.style.backgroundColor = "white";
        header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        header.style.zIndex = "9999";
      } else {
        // Cuando estés arriba, vuelve a su estado normal (estático, sin fondo ni sombra)
        header.style.position = "static";
        header.style.top = "";
        header.style.left = "";
        header.style.width = "";
        header.style.backgroundColor = "transparent";
        header.style.boxShadow = "none";
        header.style.zIndex = "";
      }
    };

    window.addEventListener("scroll", onScroll);

    // Ejecutar al cargar para que se aplique si la página ya está scrolleada
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef}>
      <TopBarComponent />
      <div className="main-header">
        <LogoComponent />
        <NavLinksComponent />
        <IconsComponent />
      </div>
    </header>
  );
}
