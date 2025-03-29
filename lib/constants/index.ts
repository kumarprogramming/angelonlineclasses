export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Shoes Store";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modern website in Next js 15";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4 ;


export const signInDefaultValue = {
    email: '',
    password: ''
}

export const signUpDefaultValue = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}

export const shippingAddressDefaultValue = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
    ? process.env.PAYMENT_METHODS.split(', ')
: ['PayPal', 'Stripe', 'CashOnDelivery']

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';
export const PAYPAL_API_URL = process.env.PAYPAL_API_URL || '';
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
export const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET || '';