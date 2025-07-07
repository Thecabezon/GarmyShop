// src/page/GuiaTallasPage.jsx

import React, { useEffect } from 'react';
import '../styles/GuiaTallasPage.css'; // Crearemos este archivo de estilos a continuación

const GuiaTallasPage = () => {
    // Efecto para asegurar que la página se muestre desde el principio
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="guia-tallas-container">
            <div className="guia-header">
                <h1>Guía de Tallas</h1>
                <p className="subtitulo">
                    Encuentra tu ajuste perfecto. Usa esta guía para asegurarte de que eliges la talla correcta.
                </p>
            </div>

            <section className="como-medirte-seccion">
                <h2>¿Cómo Medirte?</h2>
                <p>Para obtener las medidas más precisas, usa una cinta métrica y mídete sobre la ropa interior, sin apretar demasiado.</p>
                <ul>
                    <li><strong>Busto:</strong> Mide alrededor de la parte más completa de tu busto, manteniendo la cinta métrica horizontal.</li>
                    <li><strong>Cintura:</strong> Mide alrededor de la parte más estrecha de tu cintura, generalmente justo por encima del ombligo.</li>
                    <li><strong>Cadera:</strong> Mide alrededor de la parte más completa de tus caderas, asegurándote de que la cinta esté nivelada.</li>
                </ul>
            </section>

            <section className="tabla-seccion">
                <h2>Partes de Arriba (Tops, Vestidos, Chaquetas)</h2>
                <div className="tabla-responsive">
                    <table className="tallas-tabla">
                        <thead>
                            <tr>
                                <th>Talla</th>
                                <th>Busto (cm)</th>
                                <th>Cintura (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>XS</td>
                                <td>80 - 84</td>
                                <td>62 - 66</td>
                            </tr>
                            <tr>
                                <td>S</td>
                                <td>85 - 89</td>
                                <td>67 - 71</td>
                            </tr>
                            <tr>
                                <td>M</td>
                                <td>90 - 94</td>
                                <td>72 - 76</td>
                            </tr>
                            <tr>
                                <td>L</td>
                                <td>95 - 101</td>
                                <td>77 - 83</td>
                            </tr>
                            <tr>
                                <td>XL</td>
                                <td>102 - 108</td>
                                <td>84 - 90</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="tabla-seccion">
                <h2>Partes de Abajo (Pantalones, Faldas, Shorts)</h2>
                 <div className="tabla-responsive">
                    <table className="tallas-tabla">
                        <thead>
                            <tr>
                                <th>Talla</th>
                                <th>Cintura (cm)</th>
                                <th>Cadera (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>XS (26)</td>
                                <td>62 - 66</td>
                                <td>88 - 92</td>
                            </tr>
                            <tr>
                                <td>S (28)</td>
                                <td>67 - 71</td>
                                <td>93 - 97</td>
                            </tr>
                            <tr>
                                <td>M (30)</td>
                                <td>72 - 76</td>
                                <td>98 - 102</td>
                            </tr>
                            <tr>
                                <td>L (32)</td>
                                <td>77 - 83</td>
                                <td>103 - 109</td>
                            </tr>
                            <tr>
                                <td>XL (34)</td>
                                <td>84 - 90</td>
                                <td>110 - 116</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            
            <section className="notas-seccion">
                <h3>Notas Importantes</h3>
                <p>
                    * Esta guía es una referencia. Las medidas pueden variar ligeramente según la marca y el tejido de la prenda.
                </p>
                <p>
                    * Si tus medidas se encuentran entre dos tallas, te recomendamos elegir la talla más grande para un ajuste más cómodo.
                </p>
            </section>
        </div>
    );
};

export default GuiaTallasPage;