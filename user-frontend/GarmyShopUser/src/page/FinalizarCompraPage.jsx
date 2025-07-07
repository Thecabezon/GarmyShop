import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/FinalizarCompra.css';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
import authService from '../components/Auth/authService';
import { API_BASE_URL } from '../config/apiConfig';

const STRIPE_PUBLIC_KEY = 'pk_test_51RcUTK040ycu73auxVqdGiH5CzGKmTFjiSUzoQP8O8Hn45TI79oUnaZSq1hdAGiIXN91RQU0SzeZnvoUPF1Fiffe00VdrXUrtf';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" /></svg>);

const StepIndicator = ({ currentStep, goToStep }) => (
    <div className="step-indicator">
        {[1, 2, 3].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
                <div
                    className={`step ${currentStep >= stepNumber ? 'completed' : ''}`}
                    onClick={() => goToStep(stepNumber)}
                >
                    <div className="step-icon">{currentStep > stepNumber ? '✓' : stepNumber}</div>
                    <span>{['Carrito', 'Entrega', 'Pago'][index]}</span>
                </div>
                {index < 2 && <div className="step-line"></div>}
            </React.Fragment>
        ))}
    </div>
);

const OrderSummary = ({ subtotal, total, envio }) => (
    <div className="order-summary-card sticky-card">
        <h2>Resumen de la Orden</h2>
        <div className="total-row"><span>Subtotal</span><span>S/. {subtotal.toFixed(2)}</span></div>
        <div className="total-row"><span>Envío</span><span>{envio === 0 ? 'Gratis' : `S/. ${envio.toFixed(2)}`}</span></div>
        <div className="total-row grand-total"><span>Total</span><span>S/. {total.toFixed(2)}</span></div>
        <p className="security-text"><LockIcon /> Transacción segura y encriptada</p>
    </div>
);

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => (
    <div className="quantity-selector">
        <button onClick={onDecrease}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrease}>+</button>
    </div>
);

const CartReviewStep = ({ items, onNext, onUpdateQuantity, onRemoveItem }) => {

    // =====> ESTA FUNCIÓN SE HABÍA PERDIDO <=====
    const getImageUrl = (item) => {
        const imagePath = item.imagen;
        if (!imagePath) {
            return 'https://dummyimage.com/100x100/f0f0f0/ccc&text=No+Imagen';
        }
        // Si la imagen ya es una URL completa (por si acaso), úsala. Si no, constrúyela.
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `${CLOUDINARY_BASE_URL}/${imagePath}`;
    };
    // ===============================================

    return (
        <div className="step-card">
            <h2>Revisa tu Carrito</h2>
            {items.length > 0 ? (
                <>
                    <div className="cart-items-list">
                        {items.map(item => (
                            <div key={item.idUnicoCarrito} className="cart-item-row">
                                <img src={getImageUrl(item)} alt={item.nombre} />
                                <div className="item-info-checkout">
                                    <p className="item-name">{item.nombre}</p>
                                    <p className="item-attributes">Talla: {item.talla?.nombre || item.talla} / Color: {item.color?.nombre}</p>
                                    <p className="item-price">S/. {item.precio.toFixed(2)}</p>
                                </div>
                                <div className="item-actions">
                                    <QuantitySelector quantity={item.quantity} onDecrease={() => onUpdateQuantity(item.idUnicoCarrito, item.quantity - 1)} onIncrease={() => onUpdateQuantity(item.idUnicoCarrito, item.quantity + 1)} />
                                    <p className="item-total-price">S/. {(item.precio * item.quantity).toFixed(2)}</p>
                                </div>
                                <button className="remove-item-button" onClick={() => onRemoveItem(item.idUnicoCarrito)} title="Eliminar producto"><TrashIcon /></button>
                            </div>
                        ))}
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
};

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
            <h2>Datos para el Envío</h2>
            <form className="delivery-form" noValidate onSubmit={(e) => { e.preventDefault(); onNext(); }}>
                <div className="form-row">
                    <FormField id="nombre" name="nombre" label="Nombre (quién recibe)" value={deliveryInfo.nombre} onChange={handleInputChange} error={errors.nombre} placeholder="Ej: Maria" required />
                    <FormField id="apellido" name="apellido" label="Apellido" value={deliveryInfo.apellido} onChange={handleInputChange} error={errors.apellido} placeholder="Ej: Perez" required />
                </div>
                <FormField id="telefono" name="telefono" label="Teléfono de Contacto" value={deliveryInfo.telefono} onChange={handleInputChange} error={errors.telefono} placeholder="Ej: 987654321" required />
                <FormField id="direccion" name="direccion" label="Dirección (Calle, número, etc.)" value={deliveryInfo.direccion} onChange={handleInputChange} error={errors.direccion} placeholder="Ej: Av. La Peruanidad 123" required />
                <FormField id="referencia" name="referencia" label="Referencia (Opcional)" value={deliveryInfo.referencia} onChange={handleInputChange} error={errors.referencia} placeholder="Ej: Al lado de la farmacia, puerta roja" />
                <div className="form-row">
                    <FormField id="departamento" name="departamento" label="Departamento" value={deliveryInfo.departamento} onChange={handleInputChange} error={errors.departamento} placeholder="Ej: Lima" required />
                    <FormField id="provincia" name="provincia" label="Provincia" value={deliveryInfo.provincia} onChange={handleInputChange} error={errors.provincia} placeholder="Ej: Lima" required />
                    <FormField id="distrito" name="distrito" label="Distrito" value={deliveryInfo.distrito} onChange={handleInputChange} error={errors.distrito} placeholder="Ej: San Borja" required />
                </div>
                <FormField id="codigoPostal" name="codigoPostal" label="Código Postal" value={deliveryInfo.codigoPostal} onChange={handleInputChange} error={errors.codigoPostal} placeholder="Ej: 15036" required />
            </form>
            <div className="navigation-buttons">
                <button className="secondary-button" onClick={onBack}>Volver al Carrito</button>
                <button className="primary-button" onClick={onNext}>Continuar al Pago</button>
            </div>
        </div>
    );
};

const PaymentStep = ({ onBack, onFinalizePayment, isProcessing, paymentError, total, metodoPago, setMetodoPago }) => {
    const metodosDisponibles = {
        'stripe_checkout': 'Tarjeta de Crédito / Débito',
        'efectivo_contra_entrega': 'Efectivo Contra Entrega'
    };

    return (
        <div className="step-card">
            <h2>Paso Final: Elige tu Método de Pago</h2>
            <div className="payment-methods">
                {Object.entries(metodosDisponibles).map(([key, value]) => (
                    <label key={key} className={`payment-method-option ${metodoPago === key ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={key}
                            checked={metodoPago === key}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        />
                        <div className="payment-method-details">
                            <strong>{value}</strong>
                            {key === 'stripe_checkout' && <p>Paga de forma segura con tus tarjetas a través de Stripe.</p>}
                            {key === 'efectivo_contra_entrega' && <p>Paga el monto exacto en efectivo cuando recibas tu pedido.</p>}
                        </div>
                    </label>
                ))}
            </div>
            {paymentError && (<div className="payment-error-message"><p><strong>Error:</strong> {paymentError}</p></div>)}
            <div className="navigation-buttons">
                <button className="secondary-button" onClick={onBack} disabled={isProcessing}>Volver a Entrega</button>
                <button className="primary-button" onClick={onFinalizePayment} disabled={isProcessing || total === 0 || !metodoPago}>
                    {isProcessing ? 'Procesando...' : `Finalizar Compra - S/. ${total.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
};


export default function FinalizarCompraPage({ cartItems, setCartItems }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [step, setStep] = useState(1);
    const [metodoPago, setMetodoPago] = useState('stripe_checkout');
    const [deliveryInfo, setDeliveryInfo] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        referencia: '',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: '',
        codigoPostal: ''
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        const storedToken = localStorage.getItem('token');

        if (!user || !storedToken) {
            navigate('/login?redirect=/finalizar_compra');
        } else {
            setCurrentUser(user);
            setToken(storedToken);
            setDeliveryInfo(prev => ({
                ...prev,
                nombre: user.firstName || '',
                apellido: user.lastName || ''
            }));
        }
    }, [navigate]);

    const { subtotal, total, envio } = useMemo(() => {
        const subtotalCalc = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
        const envioCalc = 0;
        const totalCalc = subtotalCalc + envioCalc;
        return { subtotal: subtotalCalc, total: totalCalc, envio: envioCalc };
    }, [cartItems]);

    const handleUpdateQuantity = (id, newQuantity) => {
        setCartItems(currentItems =>
            currentItems.map(item => item.idUnicoCarrito === id ? { ...item, quantity: Math.max(1, newQuantity) } : item)
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(currentItems => currentItems.filter(item => item.idUnicoCarrito !== id));
    };

    const validateDeliveryForm = () => {
        const newErrors = {};
        if (!deliveryInfo.nombre.trim()) newErrors.nombre = "El nombre es requerido";
        if (!deliveryInfo.apellido.trim()) newErrors.apellido = "El apellido es requerido";
        if (!deliveryInfo.telefono.trim()) newErrors.telefono = "El teléfono es requerido";
        if (!deliveryInfo.direccion.trim()) newErrors.direccion = "La dirección es requerida";
        if (!deliveryInfo.distrito.trim()) newErrors.distrito = "El distrito es requerido";
        if (!deliveryInfo.codigoPostal.trim()) newErrors.codigoPostal = "El código postal es requerido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (step === 1 && cartItems.length === 0) return;
        if (step === 2 && !validateDeliveryForm()) return;
        if (step < 3) setStep(prev => prev + 1);
    };

    const handlePrevStep = () => setStep(prev => prev - 1);

    const goToStep = (stepNumber) => {
        if (stepNumber < step && stepNumber > 0) {
            if (step === 3 && stepNumber === 2 && !validateDeliveryForm()) return;
            setStep(stepNumber);
        }
    };

    const crearOrdenEnBackend = async (metodoPagoSeleccionado) => {
        const direccionPayload = {
            nombre: deliveryInfo.nombre,
            apellido: deliveryInfo.apellido,
            telefono: deliveryInfo.telefono,
            calle: deliveryInfo.direccion,
            departamento: deliveryInfo.departamento,
            provincia: deliveryInfo.provincia,
            distrito: deliveryInfo.distrito,
            codigoPostal: deliveryInfo.codigoPostal,
            referencia: deliveryInfo.referencia
        };

        const direccionResponse = await fetch(`${API_BASE_URL}/api/direcciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(direccionPayload)
        });

        if (!direccionResponse.ok) throw new Error('No se pudo guardar la dirección de envío.');
        const direccionGuardada = await direccionResponse.json();

        const ordenPayload = {
            direccionEnvioId: direccionGuardada.id,
            metodoPago: metodoPagoSeleccionado,
            items: cartItems.map(item => ({
                combinacionProductoId: item.combinacionProductoId,
                cantidad: item.quantity
            }))
        };

        const ordenResponse = await fetch(`${API_BASE_URL}/api/ordenes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(ordenPayload)
        });

        if (!ordenResponse.ok) {
            const errorText = await ordenResponse.text();
            throw new Error(`Error al crear la orden: ${errorText}`);
        }

        return await ordenResponse.json();
    };

    const handleFinalizePayment = async () => {
        if (isProcessing || total === 0 || !currentUser || !token) return;

        setIsProcessing(true);
        setPaymentError(null);

        try {
            if (metodoPago === 'stripe_checkout') {
                const ordenCreada = await crearOrdenEnBackend('stripe_checkout');

                const stripePayload = {
                    items: cartItems.map(item => ({
                        nombreProducto: item.nombre,
                        descripcionProducto: `Talla: ${item.talla?.nombre || item.talla} / Color: ${item.color?.nombre}`,
                        imagenProductoUrl: `${CLOUDINARY_BASE_URL}/${item.imagen}`,
                        precioUnitario: item.precio,
                        cantidad: item.quantity,
                        moneda: "pen"
                    })),
                    successUrl: `https://garmy-shop.vercel.app/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: `https://garmy-shop.vercel.app/finalizar-compra`,
                    ordenIdLocal: ordenCreada.id,
                    emailCliente: currentUser.email
                };

                const sessionResponse = await fetch(`${API_BASE_URL}/api/pagos/crear-checkout-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(stripePayload)
                });

                if (!sessionResponse.ok) throw new Error('Error al crear la sesión de pago.');
                const { sessionId } = await sessionResponse.json();

                const stripe = await stripePromise;
                const { error } = await stripe.redirectToCheckout({ sessionId });
                if (error) throw new Error(error.message);

            } else if (metodoPago === 'efectivo_contra_entrega') {
                const ordenCreada = await crearOrdenEnBackend('efectivo_contra_entrega');
                setCartItems([]);
                navigate('/pago-confirmado-ce', { state: { orden: ordenCreada }, replace: true });
            }
        } catch (error) {
            console.error("Error en el proceso de finalización de compra:", error);
            setPaymentError(error.message || "Ocurrió un error inesperado.");
            setIsProcessing(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <CartReviewStep items={cartItems} onNext={handleNextStep} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />;
            case 2:
                return <DeliveryStep onBack={handlePrevStep} onNext={handleNextStep} deliveryInfo={deliveryInfo} setDeliveryInfo={setDeliveryInfo} errors={errors} />;
            case 3:
                return <PaymentStep onBack={handlePrevStep} onFinalizePayment={handleFinalizePayment} isProcessing={isProcessing} paymentError={paymentError} total={total} metodoPago={metodoPago} setMetodoPago={setMetodoPago} />;
            default:
                return <div>Paso desconocido</div>;
        }
    };

    return (
        <div className="checkout-page-container">
            <StepIndicator currentStep={step} goToStep={goToStep} />
            <div className="checkout-main-content">
                <div className="checkout-left-column">{renderStepContent()}</div>
                <div className="checkout-right-column">
                    <OrderSummary subtotal={subtotal} total={total} envio={envio} />
                </div>
            </div>
        </div>
    );
}