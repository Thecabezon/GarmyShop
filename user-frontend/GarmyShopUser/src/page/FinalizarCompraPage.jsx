import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FinalizarCompra.css';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

// --- Iconos SVG ---
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg> );
const YapeLogo = () => <img src="https://www.logo.wine/a/logo/Yape/Yape-Logo.wine.svg" alt="Yape" className="yape-logo"/>;
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/></svg> );

// === COMPONENTE PRINCIPAL DEL CHECKOUT ===
export default function FinalizarCompraPage({ cartItems, setCartItems }) {
    
    const [step, setStep] = useState(1);
    const [deliveryInfo, setDeliveryInfo] = useState({ address: '', city: '', country: 'Perú' });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [errors, setErrors] = useState({});

    const handleUpdateQuantity = (id, newQuantity) => {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.idUnicoCarrito === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };
    const handleRemoveItem = (id) => {
        setCartItems(currentItems => currentItems.filter(item => item.idUnicoCarrito !== id));
    };

    const validateDeliveryForm = () => {
        const newErrors = {};
        if (!deliveryInfo.address.trim()) newErrors.address = "La dirección es requerida";
        if (!deliveryInfo.city.trim()) newErrors.city = "La ciudad es requerida";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (step === 2 && validateDeliveryForm()) {
            setStep(3);
        } else if (step < 3) {
            setStep(prev => prev + 1);
        }
    };
    const handlePrevStep = () => setStep(prev => prev - 1);
    const goToStep = (stepNumber) => {
        if (stepNumber < step) {
            setStep(stepNumber);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <CartReviewStep items={cartItems} onNext={handleNextStep} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />;
            case 2:
                return <DeliveryStep onBack={handlePrevStep} onNext={handleNextStep} deliveryInfo={deliveryInfo} setDeliveryInfo={setDeliveryInfo} errors={errors} />;
            case 3:
                return <PaymentStep onBack={handlePrevStep} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />;
            default:
                return <div>Paso desconocido</div>;
        }
    };
    
    return (
        <div className="checkout-page-container">
            <StepIndicator currentStep={step} goToStep={goToStep} />
            <div className="checkout-main-content">
                <div className="checkout-left-column">
                    {renderStepContent()}
                </div>
                <div className="checkout-right-column">
                    <OrderSummary items={cartItems} />
                </div>
            </div>
        </div>
    );
}

// === SUB-COMPONENTES PARA MAYOR CLARIDAD ===

const StepIndicator = ({ currentStep, goToStep }) => (
    <div className="step-indicator">
        {[1, 2, 3].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
                <div className={`step ${currentStep >= stepNumber ? 'completed' : ''}`} onClick={() => goToStep(stepNumber)}>
                    <div className="step-icon">{currentStep > stepNumber ? '✓' : stepNumber}</div>
                    <span>{['Carrito', 'Entrega', 'Pago'][index]}</span>
                </div>
                {index < 2 && <div className="step-line"></div>}
            </React.Fragment>
        ))}
    </div>
);

const OrderSummary = ({ items }) => {
    const { subtotal, total, envio } = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
        const envio = subtotal > 200 || subtotal === 0 ? 0 : 15;
        const total = subtotal + envio;
        return { subtotal, total, envio };
    }, [items]);

    return (
        <div className="order-summary-card sticky-card">
            <h2>Resumen de la Orden</h2>
            <div className="total-row">
                <span>Subtotal</span>
                <span>S/. {subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
                <span>Envío</span>
                <span>{envio === 0 ? 'Gratis' : `S/. ${envio.toFixed(2)}`}</span>
            </div>
            <div className="total-row grand-total">
                <span>Total</span>
                <span>S/. {total.toFixed(2)}</span>
            </div>
            <p className="security-text"><LockIcon/> Transacción segura y encriptada</p>
        </div>
    );
};

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => (
    <div className="quantity-selector">
        <button onClick={onDecrease}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrease}>+</button>
    </div>
);

const CartReviewStep = ({ items, onNext, onUpdateQuantity, onRemoveItem }) => (
    <div className="step-card">
        <h2>Revisa tu Carrito</h2>
        {items.length > 0 ? (
            <>
                <div className="cart-items-list">
                    {items.map(item => {
                        const imagePath = item.imagenPrincipalUrl || item.imagen;
                        const fullImageUrl = imagePath ? `${CLOUDINARY_BASE_URL}/${imagePath}` : 'https://dummyimage.com/100x120/f0f0f0/ccc&text=No+Img';
                        return (
                            <div key={item.idUnicoCarrito} className="cart-item-row">
                                <img src={fullImageUrl} alt={item.nombre} />
                                <div className="item-info-checkout">
                                    <p className="item-name">{item.nombre}</p>
                                    <p className="item-attributes">Talla: {item.talla} / Color: {item.color.nombre}</p>
                                    <p className="item-price">S/. {item.precio.toFixed(2)}</p>
                                </div>
                                <div className="item-actions">
                                    <QuantitySelector
                                        quantity={item.quantity}
                                        onDecrease={() => onUpdateQuantity(item.idUnicoCarrito, item.quantity - 1)}
                                        onIncrease={() => onUpdateQuantity(item.idUnicoCarrito, item.quantity + 1)}
                                    />
                                    <p className="item-total-price">S/. {(item.precio * item.quantity).toFixed(2)}</p>
                                </div>
                                <button className="remove-item-button" onClick={() => onRemoveItem(item.idUnicoCarrito)} title="Eliminar producto">
                                    <TrashIcon />
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="navigation-buttons single-button">
                    <button className="primary-button" onClick={onNext}>Continuar a Entrega</button>
                </div>
            </>
        ) : (
            <div className="empty-cart-message">
                <h3>Tu carrito está vacío</h3>
                <p>Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
                <Link to="/tienda" className="primary-button">Ir a la tienda</Link>
            </div>
        )}
    </div>
);

const FormField = ({ id, label, value, onChange, error, ...props }) => (
    <div className={`form-group ${error ? 'invalid' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={id} value={value} onChange={onChange} {...props} />
        {error && <span className="error-message">{error}</span>}
    </div>
);

const DeliveryStep = ({ onBack, onNext, deliveryInfo, setDeliveryInfo, errors }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="step-card">
            <h2>¿Dónde enviamos tu pedido?</h2>
            <form className="delivery-form" noValidate>
                <FormField id="address" label="Dirección de envío" value={deliveryInfo.address} onChange={handleInputChange} error={errors.address} placeholder="Ej: Av. La Moda 123, San Borja" />
                <FormField id="city" label="Ciudad" value={deliveryInfo.city} onChange={handleInputChange} error={errors.city} placeholder="Ej: Lima" />
                <div className={`form-group ${errors.country ? 'invalid' : ''}`}>
                    <label htmlFor="country">País</label>
                    <select id="country" name="country" value={deliveryInfo.country} onChange={handleInputChange}>
                        <option>Perú</option>
                    </select>
                </div>
            </form>
            <div className="navigation-buttons">
                <button className="secondary-button" onClick={onBack}>Volver al Carrito</button>
                <button className="primary-button" onClick={onNext}>Continuar al Pago</button>
            </div>
        </div>
    );
};

const PaymentStep = ({ onBack, paymentMethod, setPaymentMethod }) => (
    <div className="step-card">
        <h2>Elige tu método de pago</h2>
        <div className="payment-method-selector">
            {['card', 'yape'].map(method => (
                <label key={method} className={`payment-method-option ${paymentMethod === method ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    {method === 'card' ? 'Tarjeta de Crédito/Débito' : <><YapeLogo/> Yape</>}
                </label>
            ))}
        </div>
        {paymentMethod === 'card' && (
            <div className="card-details-form">
                <FormField id="cardName" label="Nombre en la Tarjeta" placeholder="Como aparece en la tarjeta" />
                <FormField id="cardNumber" label="Número de Tarjeta" placeholder="0000 0000 0000 0000" />
                <div className="form-row">
                    <FormField id="expiry" label="Fecha de Exp. (MM/AA)" placeholder="MM / AA" />
                    <FormField id="cvv" label="CVV" placeholder="123" />
                </div>
            </div>
        )}
        {paymentMethod === 'yape' && (
            <div className="yape-payment-info">
                <p>Escanea el código QR con tu app Yape para completar el pago.</p>
                <div className="qr-code-placeholder"><span>QR</span></div>
            </div>
        )}
        <div className="navigation-buttons">
            <button className="secondary-button" onClick={onBack}>Volver a Entrega</button>
            <button className="primary-button">Pagar S/. XX.XX</button>
        </div>
    </div>
);