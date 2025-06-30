import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import '../styles/SobreNosotrosPage.css';

const SobreNosotrosPage = () => {

    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const whyPeruRef = useRef(null);
    const solutionRef = useRef(null);
    const impactRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible'); 
                    } else {
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.2 
            }
        );

        const sectionsToObserve = [
            heroRef.current,
            missionRef.current,
            whyPeruRef.current,
            solutionRef.current,
            impactRef.current,
            ctaRef.current
        ].filter(Boolean);


        sectionsToObserve.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        return () => {
            sectionsToObserve.forEach(section => {
                 if (section) {
                    observer.unobserve(section);
                 }
            });
        };
    }, []);


    return (
        <div className="about-us-container">
            <section className="about-hero fade-in" ref={heroRef}>
                <div className="hero-content">
                    <h1>Sobre GarmyShop</h1>
                    <p>Impulsando marcas peruanas con estilo, tecnología y propósito.</p>
                </div>
            </section>
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
            <section className="about-section why-peru-section fade-in" ref={whyPeruRef}>
                <div className="section-content">
                    <h2>Por Qué Nos Enfocamos en la Moda Femenina Peruana</h2>
                    <div className="why-peru-content">
                        <div className="why-peru-text">
                            <p>Nuestra elección estratégica tiene un profundo impacto social y económico en Perú.</p>
                            <p>El sector de ropa femenina es uno de los más dinámicos en el e-commerce de moda, asegurando un mercado activo. Pero, más importante aún, un gran porcentaje de los emprendimientos en este rubro son liderados por mujeres.</p>
                             <p>Al crear GarmyShop, les ofrecemos una herramienta poderosa y accesible para superar barreras como el alto costo del e-commerce propio, profesionalizar sus ventas más allá de las redes sociales y ganar visibilidad en un mercado centralizado. Buscamos ser un motor de crecimiento para estas mujeres empresarias.</p>
                        </div>
                         <div className="why-peru-image">
                             <img src="https://m.media-amazon.com/images/I/41Dp-h3NWhL.jpg" alt="Moda peruana" />
                         </div>
                    </div>
                </div>
            </section>


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

            <section className="about-section impact-section fade-in" ref={impactRef}>
                 <div className="section-content">
                      <h2>Nuestro Impacto</h2>
                      <p>Al unirte a GarmyShop, ya sea como marca o compradora, contribuyes a:</p>
                      <div className="impact-items-container">
                          <div className="impact-item">
                              <i className="bi bi-gem"></i>
                              <h3>Empoderamiento</h3>
                              <p>Brindamos herramientas digitales a emprendedoras, ahorrándoles costos significativos y abriendo nuevos mercados.</p>
                          </div>
                           <div className="impact-item">
                              <i className="bi bi-shop"></i>
                              <h3>Economía Local</h3>
                              <p>Fomentamos la producción y el consumo de moda "Hecho en Perú", fortaleciendo la industria nacional.</p>
                          </div>
                           <div className="impact-item">
                              <i className="bi bi-graph-up"></i>
                              <h3>Profesionalización</h3>
                              <p>Ayudamos a las PYMES a formalizar y escalar sus operaciones de venta online con datos confiables.</p>
                          </div>
                           <div className="impact-item">
                              <i className="bi bi-heart"></i>
                              <h3>Conexión</h3>
                              <p>Facilitamos a los consumidores encontrar y apoyar directamente el talento y diseño peruano.</p>
                          </div>
                      </div>
                 </div>
            </section>

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