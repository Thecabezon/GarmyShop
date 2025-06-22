// src/pages/SobreNosotrosPage.jsx
import React, { useEffect, useRef } from 'react'; // Importa useRef
import { Link } from 'react-router-dom'; // Asegúrate de tenerlo importado si usas la CTA

import '../styles/SobreNosotrosPage.css'; // Importa el CSS

const SobreNosotrosPage = () => {

    // Refs para observar cada sección
    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const whyPeruRef = useRef(null);
    const solutionRef = useRef(null);
    const impactRef = useRef(null);
    const ctaRef = useRef(null); // Ref para la sección CTA si la usas

    // Scroll al inicio de la página al cargar
    useEffect(() => {
        window.scrollTo(0, 0);

        // --- Lógica para IntersectionObserver ---
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Si el elemento está visible
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible'); // Añade la clase para la animación final
                        // Opcional: Desconectar después de que se haya hecho visible una vez
                        // observer.unobserve(entry.target);
                    } else {
                         // Opcional: Quitar la clase si sale del viewport (para animar de nuevo si scrolleas hacia arriba/abajo)
                         // entry.target.classList.remove('is-visible');
                    }
                });
            },
            {
                // Opciones del observer
                root: null, // null significa que se observa respecto al viewport
                rootMargin: '0px',
                threshold: 0.2 // 20% del elemento debe estar visible para disparar la acción
            }
        );

        // Observa cada sección que quieres animar
        const sectionsToObserve = [
            heroRef.current,
            missionRef.current,
            whyPeruRef.current,
            solutionRef.current,
            impactRef.current,
            ctaRef.current // Observa la CTA si la usas
        ].filter(Boolean); // Filtra los refs que puedan ser null (ej. si la CTA está comentada)


        sectionsToObserve.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        // Limpieza: Desconectar el observer cuando el componente se desmonte
        return () => {
            sectionsToObserve.forEach(section => {
                 if (section) {
                    observer.unobserve(section);
                 }
            });
        };
    }, []); // Array vacío asegura que se ejecuta solo al montar y desmontar


    return (
        <div className="about-us-container">

            {/* Sección Principal / Hero */}
            {/* Añade ref y clase para la animación */}
            <section className="about-hero fade-in" ref={heroRef}>
                <div className="hero-content">
                    <h1>Sobre GarmyShop</h1>
                    <p>Impulsando marcas peruanas con estilo, tecnología y propósito.</p>
                </div>
            </section>

            {/* Sección: Nuestra Misión y Visión */}
             {/* Añade ref y clase para la animación */}
            <section className="about-section mission-vision-section fade-in" ref={missionRef}>
                <div className="section-content">
                    <h2>Nuestra Misión y Visión</h2>
                    <div className="mission-vision-grid">
                        <div className="vision-block">
                            <h3>Nuestra Visión</h3>
                            <p>Ser el principal punto de encuentro online para la moda femenina peruana, conectando marcas talentosas con compradoras que buscan calidad y diseño local.</p>
                        </div>
                         <div className="mission-block">
                            <h3>Nuestra Misión</h3>
                            <p>Facilitar la digitalización de emprendimientos de moda peruanos y mejorar la experiencia de compra online para las consumidoras, apoyando el crecimiento económico y social.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: Por Qué Moda Femenina Peruana */}
             {/* Añade ref y clase para la animación */}
            <section className="about-section why-peru-section fade-in" ref={whyPeruRef}>
                <div className="section-content">
                    <h2>Por Qué Nos Enfocamos en la Moda Femenina Peruana</h2>
                    <div className="why-peru-content">
                        <div className="why-peru-text">
                            <p>Nuestra elección estratégica tiene un profundo impacto social y económico en Perú.</p>
                            <p>El sector de ropa femenina es uno de los más dinámicos en el e-commerce de moda, asegurando un mercado activo. Pero, más importante aún, un gran porcentaje de los emprendimientos en este rubro son liderados por mujeres.</p>
                             <p>Al crear GarmyShop, les ofrecemos una herramienta poderosa y accesible para superar barreras como el alto costo del e-commerce propio, profesionalizar sus ventas más allá de las redes sociales y ganar visibilidad en un mercado centralizado. Buscamos ser un motor de crecimiento para estas mujeres empresarias.</p>
                        </div>
                         {/* Puedes añadir una imagen aquí */}
                         <div className="why-peru-image">
                             {/* Asegúrate de que esta imagen existe o usa una URL */}
                             {/* Usar una imagen de ejemplo para que veas cómo funciona */}
                             <img src="https://m.media-amazon.com/images/I/41Dp-h3NWhL.jpg" alt="Moda peruana" />
                         </div>
                    </div>
                </div>
            </section>


            {/* Sección: Nuestra Solución */}
             {/* Añade ref y clase para la animación */}
            <section className="about-section solution-section fade-in" ref={solutionRef}>
                <div className="section-content">
                    <h2>Nuestra Solución</h2>
                    <p>GarmyShop ofrece una propuesta integral para abordar estos desafíos, brindando:</p>
                    <ul>
                        <li><strong>Plataforma Accesible y de Bajo Costo:</strong> Las marcas venden en un marketplace profesional sin la inversión inicial de una web propia.</li>
                        <li><strong>Operación Simplificada:</strong> Nos encargamos de la gestión técnica y publicación, liberando a las marcas para enfocarse en la creación.</li>
                        <li><strong>Experiencia de Compra Asistida:</strong> Un chatbot en la web simula la atención de tienda física, guiando a las compradoras.</li>
                        <li><strong>Visibilidad Especializada:</strong> Agrupamos talento peruano, creando un destino fácil de usar para encontrar moda local.</li>
                        <li><strong>Transparencia y Datos:</strong> Proveemos reportes de venta confiables para análisis y toma de decisiones informadas.</li>
                    </ul>
                </div>
            </section>

            {/* Sección: Impacto y Beneficios */}
             {/* Añade ref y clase para la animación */}
            <section className="about-section impact-section fade-in" ref={impactRef}>
                 <div className="section-content">
                      <h2>Nuestro Impacto</h2>
                      <p>Al unirte a GarmyShop, ya sea como marca o compradora, contribuyes a:</p>
                      {/* Agrupamos los items en un div contenedor si queremos más control flexbox */}
                      <div className="impact-items-container">
                          <div className="impact-item">
                              <i className="bi bi-gem"></i> {/* Icono de ejemplo */}
                              <h3>Empoderamiento</h3>
                              <p>Brindamos herramientas digitales a emprendedoras, ahorrándoles costos significativos y abriendo nuevos mercados.</p>
                          </div>
                           <div className="impact-item">
                              <i className="bi bi-shop"></i> {/* Icono de ejemplo */}
                              <h3>Economía Local</h3>
                              <p>Fomentamos la producción y el consumo de moda "Hecho en Perú", fortaleciendo la industria nacional.</p>
                          </div>
                           <div className="impact-item">
                              <i className="bi bi-graph-up"></i> {/* Icono de ejemplo */}
                              <h3>Profesionalización</h3>
                              <p>Ayudamos a las PYMES a formalizar y escalar sus operaciones de venta online con datos confiables.</p>
                          </div>
                           <div className="impact-item">
                              <i className="bi bi-heart"></i> {/* Icono de ejemplo */}
                              <h3>Conexión</h3>
                              <p>Facilitamos a los consumidores encontrar y apoyar directamente el talento y diseño peruano.</p>
                          </div>
                      </div> {/* Fin impact-items-container */}
                 </div>
            </section>

            {/* Sección: Nuestro Equipo (Opcional) */}
            {/* Puedes añadir ref y clase fade-in si la descomentas */}
             {/*
            <section className="about-section team-section fade-in" ref={teamRef}>
                 <div className="section-content">
                      <h2>Conoce a Nuestro Equipo</h2>
                       <div className="team-grid">
                           ...
                       </div>
                 </div>
            </section>
            */}

            {/* Llamada a la acción (Opcional) */}
            {/* Asegúrate que esta sección esté descomentada en tu código si quieres que aparezca */}
            {/* Añade ref y clase para la animación */}
            <section className="about-section cta-section fade-in" ref={ctaRef}>
                 <div className="section-content text-center">
                     <h2>¿Eres una Marca Peruana?</h2>
                     <p>Únete a nuestra plataforma y lleva tus creaciones al siguiente nivel.</p>
                     <Link to="/vende-con-nosotros" className="cta-button">Descubre Cómo</Link>
                 </div>
            </section>


        </div>
    );
};


export default SobreNosotrosPage;