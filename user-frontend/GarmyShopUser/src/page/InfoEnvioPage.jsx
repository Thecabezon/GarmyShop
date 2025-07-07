import React, { useEffect } from 'react';
import '../styles/InfoEnvioPage.css'; // Usamos los mismos estilos

const InfoEnvioPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="info-envio-container">
            <div className="info-envio-header">
                <h1>Información de Envío</h1>
                <p className="subtitulo">
                    ¡Tu estilo, sin costos adicionales! Llevamos tus compras a cualquier rincón del Perú.
                </p>
            </div>

            <section className="envio-seccion tiempos-costos">
                <div className="opciones-envio">
                    <div className="opcion-card promocion">
                        <div className="card-icon">
                            <i className="bi bi-star-fill"></i>
                        </div>
                        <h3>¡Envío Gratis a Todo el Perú!</h3>
                        <p><strong>Costo:</strong> S/ 0.00</p>
                        <p className="detalle">
                            En GarmyShop, queremos que te concentres solo en elegir tus prendas favoritas. 
                            Por eso, <strong>todos nuestros envíos son completamente gratis</strong>, sin monto mínimo de compra.
                        </p>
                    </div>
                </div>
            </section>
            
            <section className="envio-seccion">
                <h2>Tiempos de Entrega</h2>
                <p>Contamos con nuestra propia red de distribución para asegurar una entrega rápida y segura.</p>
                <ul>
                    <li><strong>Lima Metropolitana:</strong> Recibe tu pedido de 1 a 3 días hábiles.</li>
                    <li><strong>Provincias:</strong> Recibe tu pedido de 3 a 7 días hábiles.</li>
                </ul>
            </section>

            <section className="envio-seccion">
                <h2>Seguimiento de tu Pedido</h2>
                <p>
                    Una vez que tu orden sea despachada, recibirás un correo electrónico con el estado "Enviado". Podrás ver el progreso de todos tus pedidos en la sección <strong><a href="/mis-pedidos">"Mis Pedidos"</a></strong> de tu cuenta.
                </p>
            </section>

            <section className="envio-seccion">
                <h2>Consideraciones Importantes</h2>
                <ul>
                    <li>Los días hábiles son de Lunes a Viernes, excluyendo feriados.</li>
                    <li>Las entregas se realizan en horario de oficina (9:00 am a 6:00 pm).</li>
                    <li>Es responsabilidad del cliente proporcionar una dirección de entrega válida y correcta. Si la dirección es incorrecta, podrían aplicarse cargos adicionales por reenvío.</li>
                    <li>Asegúrate de que haya alguien disponible en la dirección de entrega para recibir el paquete.</li>
                </ul>
            </section>
        </div>
    );
};

export default InfoEnvioPage;