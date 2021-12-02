const config = require('../config/config');
const stripe = require('stripe')(config.stripeKey);

// Create payment intent
module.exports.createPaymentIntent = (totalPrice, stripeCustomerID, email) => stripe.paymentIntents.create({
    amount: totalPrice,
    currency: "sgd",
    customer: stripeCustomerID || null,
    receipt_email: email || null
});

// Update payment intent
module.exports.updatePaymentIntent = (paymentIntentID, totalPrice) => stripe.paymentIntents.update(
    paymentIntentID, {
    amount: totalPrice,
    currency: "sgd"
});

// Create customer
module.exports.createStripeCustomer = (first_name, last_name, email) => stripe.customers.create({
    name: first_name + " " + last_name,
    email: email,
});

// Update customer
module.exports.updateStripeCustomer = (customerID, meta) => stripe.customers.update(
    customerID,
    meta
);

// Detach payment method
module.exports.detachPaymentMethod = (paymentMethodID) => stripe.paymentMethods.detach(
    paymentMethodID
);

// Find payment method
module.exports.findPaymentMethodFromStripe = (paymentMethodID) => stripe.paymentMethods.retrieve(
    paymentMethodID
);

// Find payment intent
module.exports.findPaymentIntent = (paymentIntentID) => stripe.paymentIntents.retrieve(
    paymentIntentID,
    {
        expand: ['payment_method'],
    }
);

// Create setup intent
module.exports.createSetupIntent = (customerID) => stripe.setupIntents.create({
    customer: customerID,
});

// Create subscription
module.exports.createSubscriptionInStripe = (customerID, subscriptionPriceID, meta) => stripe.subscriptions.create({
    ...meta,
    customer: customerID,
    items: [{
        price: subscriptionPriceID
    }],
    payment_behavior: 'default_incomplete',
    proration_behavior: 'create_prorations',
    expand: ['latest_invoice.payment_intent'],
});

// Find subscription
module.exports.findSubscriptionInStripe = (subscriptionID) => stripe.subscriptions.retrieve(
    subscriptionID
);

// Update subscription (general) to be done tmr
module.exports.updateSubscriptionInStripe = (subscriptionID, meta) => stripe.subscriptions.update(
    subscriptionID,
    {
        ...meta,
    }
);

// Cancel subscription
module.exports.cancelSubscription = (stripeSubscriptionID) => stripe.subscriptions.del(
    stripeSubscriptionID
);

// Find invoice
module.exports.findInvoiceInStripe = (invoiceID) => stripe.invoices.retrieve(
    invoiceID
);