import React, { useEffect, useRef } from 'react';
import '../styles/SobreNosotrosPage.css';

// Importar iconos de react-icons
// Los de Bootstrap (bs)
import { BsBullseye, BsEye, BsGem, BsLightbulb, BsBuilding, BsGenderFemale } from 'react-icons/bs';
// Los de Font Awesome (fa) - Incluye FaRobot y FaHandsHelping
import { FaRobot, FaHandsHelping } from 'react-icons/fa';


const SobreNosotrosPage = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    sectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const addSectionRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="about-us-container">

      <section className="about-section animatable-section" ref={addSectionRef}>
        <div className="section-content intro-content">
          <h2 className="titulo-sobre-nosotros">Sobre nosostros</h2>
          <div className="linea-decorativa"></div>

          <p>
            GarmyShop es una plataforma de e-commerce peruana dedicada exclusivamente a la venta de ropa para mujer. Reunimos las mejores marcas nacionales e internacionales en un solo lugar para ofrecer estilo, calidad y autenticidad a nuestras clientas.
          </p>
          <p>
            Nos enfocamos en el público femenino porque, según diversas estadísticas, las mujeres lideran el consumo de moda en el comercio electrónico. Nuestro objetivo es brindar una experiencia especializada, personalizada y cercana.
          </p>
          <p>
            Una de nuestras principales innovaciones es el <FaRobot className="icon-inline" /> <strong>chatbot inteligente</strong> que actúa como un asistente de tienda, acompañándote durante todo el proceso de compra para resolver dudas, recomendar productos y ayudarte a encontrar lo que necesitas.
          </p>
        </div>
      </section>

      <section className="about-section animatable-section alternate-background" ref={addSectionRef}>
        <div className="section-content mission-vision-grid">
            <div>
                <h3 className="subtitulo"><BsBullseye className="icon-heading" /> Nuestra Misión</h3>
                <p>
                  Empoderar a las mujeres a través de la moda, ofreciendo una plataforma segura, moderna y accesible donde puedan encontrar prendas que reflejen su identidad y personalidad.
                </p>
            </div>
             <div>
                <h3 className="subtitulo"><BsEye className="icon-heading" /> Nuestra Visión</h3>
                <p>
                  Ser el marketplace líder en moda femenina del Perú, reconocida por su compromiso con la calidad, la innovación y el impulso de marcas emergentes y consolidadas.
                </p>
            </div>
        </div>
      </section>

      <section className="about-section animatable-section" ref={addSectionRef}>
        <div className="section-content">
          <h3 className="subtitulo text-center"><BsGem className="icon-heading" /> Nuestros Valores</h3>
          <div className="values-grid">
              <div className="value-item">
                  <BsGem className="icon-value" />
                  <h4>Calidad</h4>
                  <p>Seleccionamos marcas que priorizan materiales y confección de alto nivel.</p>
              </div>
               <div className="value-item">
                  <FaHandsHelping className="icon-value" /> {/* Corregido: FaHandsHelping de /fa */}
                  <h4>Empatía</h4>
                  <p>Pensamos como nuestras clientas y diseñamos experiencias que respondan a sus verdaderas necesidades.</p>
              </div>
               <div className="value-item">
                  <BsLightbulb className="icon-value" />
                  <h4>Innovación</h4>
                  <p>Integramos tecnología como el chatbot para mejorar la experiencia de compra.</p>
              </div>
               <div className="value-item">
                  <BsBuilding className="icon-value" />
                  <h4>Apoyo local</h4>
                  <p>Impulsamos marcas peruanas para fomentar el talento y el empleo en el país.</p>
              </div>
          </div>
        </div>
      </section>

      <section className="about-section animatable-section alternate-background" ref={addSectionRef}>
        <div className="section-content why-women-content">
            <div className="why-women-text">
                <h3 className="subtitulo"><BsGenderFemale className="icon-heading" /> ¿Por qué solo para mujeres?</h3>
                <p>
                  Porque creemos en ofrecer una experiencia de compra especializada. Sabemos que las mujeres tienen un estilo único y necesidades particulares al comprar moda. Nuestra plataforma está diseñada exclusivamente para ellas, desde el catálogo hasta la atención personalizada con tecnología.
                </p>
            </div>
             <div className="why-women-icon-large">
                 <BsGenderFemale className="large-icon" />
             </div>
        </div>
      </section>

      <section className="about-section animatable-section" ref={addSectionRef}>
        <div className="section-content text-center">
          <p className="conclusion-text">
            En GarmyShop, no solo compras ropa. Descubres estilo, inspiración y una comunidad de mujeres empoderadas que confían en su identidad. ¡Gracias por ser parte de nuestra historia!
          </p>
        </div>
      </section>

    </div>
  );
};

export default SobreNosotrosPage;