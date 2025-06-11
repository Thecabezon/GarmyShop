import React from 'react';
import '../styles/FinalizarCompra.css';

export default function FinalizarCompraPage({ cartItems, setCartItems }) {
    void setCartItems;


    const totalConIgv = cartItems.reduce(
        (total, item) => total + item.precio * item.quantity,
        0
    );

    const subtotal = totalConIgv / 1.18;
    const igv = subtotal * 0.18;

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <h1>Finalizar Compra</h1>
                </div>
            </div>

            <div className="checkout-main">
                <div className="checkout-content">
                    <div className="order-summary">
                        <h2>Resumen del Pedido</h2>

                        <div className="items-list">
                            {cartItems.map((item) => (
                                <div key={item.cod} className="item-card">
                                    <div className="item-info">
                                        <img
                                            src={item.imagen}
                                            alt={item.nombre}
                                            className="item-image"
                                            loading="lazy"
                                        />
                                        <h3 className="item-name">{item.nombre}</h3>
                                        <div className="item-details">
                                            <span className="item-quantity">Cantidad: {item.quantity}</span>
                                            <span className="item-price">S/. {item.precio.toFixed(2)} c/u</span>
                                        </div>
                                    </div>
                                    <div className="item-total">
                                        S/. {(item.precio * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Subtotal (sin IGV):</span>
                                <span>S/. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>IGV (18%):</span>
                                <span>S/. {igv.toFixed(2)}</span>
                            </div>
                            <div className="total-row total-final">
                                <span>Total:</span>
                                <span>S/. {totalConIgv.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="payment-section">
                    <div className="payment-card">
                        <div className="security-badges">
                            <div className="badge">
                                <i className="fas fa-shield-alt"></i>
                                <span>Pago Seguro</span>
                            </div>
                            <div className="badge">
                                <i className="fas fa-truck"></i>
                                <span>Envío Gratis</span>
                            </div>
                        </div>

                        <button className="pay-button" type="button">
                            <i className="fas fa-credit-card"></i>
                            Realizar Pago
                        </button>

                        <div className="payment-methods">
                            <span>Métodos de pago aceptados:</span>
                            <div className="payment-icons">
                                <i className="fab fa-cc-visa"></i>
                                <i className="fab fa-cc-mastercard"></i>
                                <i className="fab fa-cc-paypal"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}