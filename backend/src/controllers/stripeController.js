const stripe = require('../services/stripeService')
const stripedatabase = require('../services/stripedatabaseService')
const jwt_decode = require("jwt-decode");
const companyService = require('../services/companyService')
const dayjs = require('dayjs')
module.exports.createSetupIntent = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });
        const account = await stripedatabase.getUserByAccountID(acc_id);
        if (account.length == 0) return res.status(400).json({
            message: "Cannot find \"account\""
        });
        const setupIntent = await stripe.createSetupIntent(account[0].stripe_customer_id);
        const clientSecret = setupIntent.client_secret;
        const setupIntentID = setupIntent.id;

        return res.status(200).send({ clientSecret, setupIntentID });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > createSetupIntent " + error);
    }
};

// Create payment method
module.exports.createPaymentMethod = async (req, res) => {
    console.log('creating')

    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const { paymentMethodID } = req.body;

        if (!paymentMethodID) return res.status(400).json({
            message: "Cannot find parameter \"paymentMethodID\""
        });

        // Obtain more details about payment method from Stripe
        const paymentMethod = await stripe.findPaymentMethodFromStripe(paymentMethodID);

        if (!paymentMethod) return res.status(400).json({
            message: "Cannot find \"paymentMethod\""
        });

        // Every card has a unique fingerprint
        const cardFingerprint = paymentMethod.card.fingerprint;

        // Check if new payment method already exists in our database
        const duplicatedPaymentMethod = await stripedatabase.findDuplicatePaymentMethod(acc_id, cardFingerprint);

        if (duplicatedPaymentMethod.length != 0) {
            await stripe.detachPaymentMethod(paymentMethodID); // Detach payment method from Stripe database

            return res.status(400).json({
                duplicate: true,
                message: "Payment Method already exists"
            });
        }


        const cardLastFourDigit = paymentMethod.card.last4;
        const cardType = paymentMethod.card.brand;
        const cardExpMonth = paymentMethod.card.exp_month.toString();
        const cardExpYear = paymentMethod.card.exp_year.toString();
        const cardExpDate = cardExpMonth + "/" + cardExpYear.charAt(2) + cardExpYear.charAt(3);
        console.log(
            `
            ---------------
            cardType: ${cardType}
            cardLastFourDigit: ${cardLastFourDigit}
            cardFingerprint: ${cardFingerprint}
            ---------------
            `
        )
        // Insert payment method in our database
        await stripedatabase.insertPaymentMethod(acc_id, paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate);

        return res.status(200).send({ duplicate: false });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > createPaymentMethod " + error);
    }
};

module.exports.getAllPaymentMethods = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });
        const account = await stripedatabase.getAllPaymentMethods(acc_id);
        if (account.length == 0) return res.status(400).json({
            message: "Cannot find \"account\""
        });

        return res.status(200).send(account);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > getAllPaymentMethods " + error);
    }
};

module.exports.getAllPlans = async (req, res) => {
    try {
       let plans = await stripedatabase.getAllPlan()

        return res.status(200).send(plans);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > getAllPaymentMethods " + error);
    }
};

module.exports.getAllSubscriptions = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });
       let subscriptions = await stripedatabase.getAllSubscriptions(acc_id)

        return res.status(200).send(subscriptions);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > getAllPaymentMethods " + error);
    }
};

module.exports.getSubscriptionById = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });
       let subscriptions = await stripedatabase.findSubscriptionByAccId(acc_id)

        return res.status(200).send(subscriptions);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > getSubscriptionById " + error);
    }
};

// Remove payment method
module.exports.removePaymentMethod = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const { paymentMethodID } = req.params;

        if (!paymentMethodID) return res.status(400).json({
            message: "Cannot find parameter \"paymentMethodID\""
        });

        // Find payment method in our database
        const paymentMethod = await stripedatabase.findPaymentMethod(paymentMethodID);
        if (paymentMethod.length == 0) return res.status(404).json({
            message: "Cannot find \"paymentMethod\""
        });

        // Remove payment method
        await stripe.detachPaymentMethod(paymentMethodID); // Stripe

        await stripedatabase.removePaymentMethod(paymentMethodID); // Our database shd be shifted to webhook

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > removePaymentMethod " + error);
    }
};


// Create Subscription
module.exports.createSubscription = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId
        let company_id = decodedToken.companyId
        let company = await companyService.getCompanyData(company_id)
        // const { decoded } = res.locals.auth;
        // const plan = res.locals.plan;
        const { paymentMethodID } = req.body;
        const { type } = req.params;

        if (!type) return res.status(400).json({
            message: "Invalid parameter \"type\""
        });

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        // Get account information
        const account = await stripedatabase.getUserByAccountID(acc_id);
        if (account.length == 0) return res.status(404).json({
            message: "Cannot find \"account\""
        });

        const plan = await stripedatabase.findOnePlan(type);
        if (plan.length == 0) return res.status(404).json({
            message: "Cannot find parameter \"plan\""
        });
        const priceID = plan[0].stripe_price_id; // price ids are generated by stripe, every plan (product) has a price id associated to it

        // Check if user has live subscriptions
        // live means subscription status aka stripe_status can be: 
        // 'incomplete', 'active', 'trialing', 'past_due'
        const liveSubscription = await stripedatabase.findLiveSubscription(company_id);

        // If user already has live subscription, throw error
        if (liveSubscription.length != 0) return res.status(400).json({
            message: "Account already has a live subscription"
        });

        let subscriptionID;
        let clientSecret;

        // If account has not used its free trial yet
        if (company[0].trialed === 0) {

            if (!paymentMethodID) return res.status(400).json({
                message: "Invalid parameter \"paymentMethodID\""
            });

            // Check if payment method exists
            const paymentMethod = stripedatabase.findPaymentMethod(paymentMethodID);
            if (paymentMethod.length === 0) return res.status(404).json({
                message: "Cannot find payment method!"
            });

            // Unix time now + 7 days
            const trialEndDate = Math.floor(Date.now() / 1000) + 604800;
            const tempTrialEndDate = Math.floor(Date.now() / 1000) + 180; // for testing, trial lasts for 3 mins

            // Create subscription in Stripe
            const subscription = await stripe.createSubscriptionInStripe(account[0].stripe_customer_id, priceID, {
                trial_end: tempTrialEndDate,
                default_payment_method: paymentMethodID
            });

            subscriptionID = subscription.id;
            const planID = plan[0].plan_id;

            // Create subscription in our Database
            await stripedatabase.createSubscription(subscriptionID, planID, acc_id, company_id, paymentMethodID, 'trialing',
                dayjs((tempTrialEndDate + 3600) * 1000).toDate(), // for testing, trial lasts for 3 mins + 1hr delay for Stripe to charge
            );

        } else {
            // Create subscription in Stripe
            const subscription = await stripe.createSubscriptionInStripe(account[0].stripe_customer_id, priceID);
            subscriptionID = subscription.id;
            clientSecret = subscription.latest_invoice.payment_intent.client_secret;

        }

        return res.status(200).send({ clientSecret, subscriptionID });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > createSubscription " + error);
    }
};

// Update Subscription
module.exports.updateSubscription = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId
        let company_id = decodedToken.companyId

        const { type } = req.params;

        if (!type) return res.status(400).json({
            message: "Invalid parameter \"type\""
        });
        const plan = await stripedatabase.findOnePlan(type);
        if (plan.length == 0) return res.status(404).json({
            message: "Cannot find parameter \"plan\""
        });
        const { paymentMethodID } = req.body;

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        // Get account information
        const account = await stripedatabase.getUserByAccountID(acc_id);
        if (account.length == 0) return res.status(404).json({
            message: "Cannot find \"account\""
        });

        // Check if user has active subscriptions
        // Live means subscription status aka stripe_status can be: 
        // 'incomplete', 'active', 'trialing' or 'past_due'
        const liveSubscription = await stripedatabase.findLiveSubscription(company_id);

        // If user don't have live subscription, throw error
        if (liveSubscription.length == 0) return res.status(404).json({
            message: "Cannot find subscription"
        });

        // Subscription already canceling
        if (liveSubscription[0].stripe_status === "canceling") return res.status(400).json({
            message: "subscription is already cancelling"
        });

        // Price ID of new plan
        const subscriptionID = liveSubscription[0].stripe_subscription_id;

        // Change plan
        if (plan.length != 0) {
            const priceID = plan[0].stripe_price_id; // price ids are generated by stripe, every plan (product) has a price id associated to it
            // Prevent changing of same plan
            if (plan[0].plan_id === liveSubscription[0].plan.plan_id) return res.status(400).json({
                message: "Same plan change not allowed!"
            });

            // Find subscription item id to uddate
            const subscription = await stripe.findSubscriptionInStripe(subscriptionID);

            await stripe.updateSubscriptionInStripe(subscriptionID, {
                items: [{
                    id: subscription.items.data[0].id,
                    price: priceID
                }],
                proration_behavior: "always_invoice" // tell stripe to invoice and charge immediately
            });


            // Update subscription in our database
            const planID = plan[0].plan_id;
            await stripedatabase.updateSubscriptionPlan(subscriptionID, planID)
        }

        // Change default payment method
        if (paymentMethodID) {
            // Check if payment method exists in our database
            const paymentMethod = await stripedatabase.findPaymentMethod(paymentMethodID);
            if (!paymentMethod) return res.status(404).json({
                message: "Cannot find parameter \"paymentMethod\""
            });

            // Check if payment method is the same payment method
            const defaultPaymentMethodID = liveSubscription[0].payment_method;
            if (paymentMethodID === defaultPaymentMethodID) return res.status(400).json({
                message: "Error! Payment method is the same as current default payment method"
            });

            // Update subscription payment method in Stripe
            await stripe.updateSubscriptionInStripe(subscriptionID, { default_payment_method: paymentMethodID });

            // Update subscription payment method in our database
            await stripedatabase.updateSubscriptionPaymentMethod(subscriptionID, paymentMethodID);
        }

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > updateSubscriptionPlan " + error);
    }
};

// Cancel Subscription
module.exports.cancelSubscription = async (req, res) => {
    try {
        let decodedToken = jwt_decode(req.signedCookies.refreshToken)
        let acc_id = decodedToken.accId
        let company_id = decodedToken.companyId

        if (isNaN(acc_id)) return res.status(400).json({
            message: "Invalid parameter \"acc_id\""
        });

        // Check if user has live subscriptions
        // live means subscription status aka stripe_status can be: 
        // 'incomplete', 'active', 'trialing', 'past_due', 'canceling'
        const liveSubscription = await stripedatabase.findLiveSubscription(company_id);

        // If user don't have live subscription, throw error
        if (liveSubscription.length == 0) return res.status(404).json({
            message: "Cannot find live subscriptions"
        });

        // Subscription already canceling
        if (liveSubscription[0].stripe_status === "canceling") return res.status(400).json({
            message: "subscription is already cancelling"
        });

        const subscriptionID = liveSubscription[0].stripe_subscription_id;

        if (liveSubscription[0].stripe_status === "trialing") {
            // Cancel subscription straight away
            await stripe.cancelSubscription(subscriptionID);
            // Update subscription status in our Database
            await stripedatabase.updateSubscriptionStatus(subscriptionID, 'canceled');

        } else {
            // Update subscription cancel date in Stripe
            await stripe.updateSubscriptionInStripe(subscriptionID, {
                cancel_at_period_end: true // by default, Stripe cancels subscription immediately.
                // Having this option will tell Stripe to cancel only the
                // end of the current billing period
            });
            // Update subscription status in our Database
            await stripedatabase.updateSubscriptionStatus(subscriptionID, 'canceling');
        }

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! > cancelSubscription " + error);
    }
};


// Webhooks
module.exports.handleWebhook = async (req, res) => {
    try {
        const { event } = res.locals;

        // Types of events: https://stripe.com/docs/api/events/types
        switch (event.type) {
            case 'customer.updated': {
                const customer = event.data.object;

                const customerID = customer.id;

                // Find accoutn by customer id
                const account = await stripedatabase.getAccountByStripeCustID(customerID);
                await stripedatabase.updateAccountBalane(account[0].acc_id, parseFloat(customer.balance / 100).toFixed(2));
                break;
            }

            case 'payment_method.automatically_updated': {
                // Purpose of listening to this event: https://stripe.com/docs/saving-cards#automatic-card-updates
                const paymentMethod = event.data.object;

                const cardFingerprint = paymentMethod.card.fingerprint;
                const cardLastFourDigit = paymentMethod.card.last4;
                const cardType = paymentMethod.card.brand;
                const cardExpMonth = paymentMethod.card.exp_month.toString();
                const cardExpYear = paymentMethod.card.exp_year.toString();
                const cardExpDate = cardExpMonth + "/" + cardExpYear.charAt(2) + cardExpYear.charAt(3);
                const paymentMethodID = paymentMethod.id;

                // Update payment method
                await stripedatabase.updatePaymentMethod(paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate);
                break;
            }

            case 'invoice.paid': {
                const invoice = event.data.object;
                const account = await stripedatabase.getAccountByStripeCustID(invoice.customer);
                const userData = await stripedatabase.getUserDataByAccountID(account[0].acc_id)
                const company_id = userData[0].company_id
                const acc_id = userData.userData[0].acc_id
                // If this is user's first time subscribing
                if (company[0].trialed == 0) {
                    // Update user trialed status to prevent user from access to free trial multiple times
                    await stripedatabase.updateTrial(company_id)
                } else {
                    const subscriptionID = invoice.subscription;
                    const amount = parseFloat(invoice.amount_paid / 100).toFixed(2);
                    console.log("-------");
                    console.log(invoice.payment_intent);
                    console.log("-------");
                    // Charged with a payment method
                    if (invoice.payment_intent) {

                        const paymentIntentID = invoice.payment_intent;

                        const paymentIntent = await stripe.findPaymentIntent(paymentIntentID);
                        const paymentMethod = paymentIntent.payment_method;
                        const paymentMethodID = paymentMethod.id;
                        console.log("-------");
                        console.log(invoice.billing_reason);

                        console.log(invoice.billing_reason === 'subscription_create');
                        console.log("-------");
                        // https://stripe.com/docs/api/invoices/object#invoice_object-billing_reason
                        if (invoice.billing_reason === 'subscription_create') {

                            // Update subscription payment method in Stripe
                            await stripe.updateSubscriptionInStripe(subscriptionID, { default_payment_method: paymentMethodID });

                            const priceID = invoice.lines.data[0].price.id;
                            const plan = await stripedatabase.findPlanByPriceID(priceID);
                            const planID = plan[0].plan_id;

                            await stripedatabase.createSubscriptionWebhook(subscriptionID, planID, acc_id, company_id, 'active', paymentMethodID);

                        }

                        // Payment method information
                        const cardFingerprint = paymentMethod.card.fingerprint;
                        const cardLastFourDigit = paymentMethod.card.last4;
                        const cardType = paymentMethod.card.brand;
                        const cardExpMonth = paymentMethod.card.exp_month.toString();
                        const cardExpYear = paymentMethod.card.exp_year.toString();
                        const cardExpDate = cardExpMonth + "/" + cardExpYear.charAt(2) + cardExpYear.charAt(3);

                        // Check if invoice exists in our Database already
                        const invoiceExists = await stripedatabase.findInvoice(invoice.id);

                        if (invoiceExists[0].length != 0) {
                            // Update invoice
                            await stripedatabase.updateInvoice('succeeded', invoice.number, amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, new Date(), invoice.id);
                        } else {
                            const clientSecret = paymentIntent.client_secret;
                            // Insert invoice
                            await stripedatabase.createInvoice(invoice.id, invoice.number, paymentIntentID, clientSecret, 'succeeded', amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, new Date())
                        }
                    } else {
                        // Credited/debited with account credits/debts
                        // Check if invoice exists in our Database already
                        const invoiceExists = await stripedatabase.findInvoice(invoice.id);

                        if (invoiceExists[0].length != 0) {
                            // Update invoice
                            await stripedatabase.updateInvoice('succeeded', invoice.number, amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, new Date(), invoice.id)
                        } else {
                            // Insert invoice
                            await createInvoice({
                                stripe_invoice_id: invoice.id,
                                stripe_reference_number: invoice.number,
                                stripe_payment_intent_status: 'succeeded',
                                amount,
                                balance: parseFloat(invoice.ending_balance / 100).toFixed(2),
                                fk_stripe_subscription_id: subscriptionID,
                                paid_on: new Date()
                            });
                            await stripedatabase.createInvoice(invoice.id, invoice.number, null, null, 'succeeded', amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, new Date())

                        }
                    }
                }

                // Send email to user
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const subscriptionID = subscription.id;
                let subscriptionStatus = subscription.status;

                if (subscriptionStatus === "incomplete_expired") {
                    // do nothing
                } else {
                    const priceID = subscription.items.data[0].price.id;
                    const plan = await stripedatabase.findPlanByPriceID(priceID);
                    // Only applicable for canceled subscription
                    if (subscriptionStatus === "canceled") {
                        const latestInvoiceID = subscription.latest_invoice;
                        const invoice = await findInvoiceInStripe(latestInvoiceID);
                        // Only applicable for cancellations due to overdue payments
                        if (invoice.status !== 'paid') {
                            const amount = plan[0].price; // price of subscription plan

                            const invoiceExists = await stripedatabase.findInvoice(latestInvoiceID);
                            if (invoiceExists[0].length !=0) {
                                // Update invoice
                                await stripedatabase.updateInvoiceUpdated('canceled', amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, latestInvoiceID)
                            } else {
                                // Insert invoice
                                await createInvoice({
                                    stripe_invoice_id: latestInvoiceID,
                                    stripe_payment_intent_status: 'canceled',
                                    amount,
                                    balance: parseFloat(invoice.ending_balance / 100).toFixed(2),
                                    fk_stripe_subscription_id: subscriptionID,
                                });
                                await stripedatabase.createInvoice(latestInvoiceID, null, null, null, 'canceled', amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, null)
                            }
                        }
                    }

                    const planID = plan[0].plan_id;
                    // New billing cycle date
                    const subscriptionPeriodStart = dayjs(subscription.current_period_start * 1000).toDate(); // dayjs function converts unix time to native Date Object
                    const subscriptionPeriodEnd = dayjs(subscription.current_period_end * 1000).toDate();

                    if (subscription.cancel_at_period_end) {
                        // subscription is in canceling state
                        if (subscription.cancel_at > Math.floor(Date.now() / 1000)) {
                            subscriptionStatus = "canceling";
                        }
                    }

                    // Update plan, subscription status, and new billing cycle in our Database
                    await stripedatabase.updateSubscriptionBillingCycle(subscriptionStatus, planID, subscriptionPeriodStart, subscriptionPeriodEnd, subscriptionID)
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const subscriptionID = invoice.subscription;
                // If the payment fails or the customer does not have a valid payment method,
                // an invoice.payment_failed event is sent, the subscription becomes past_due.
                // Use this webhook to notify user that their payment has
                // failed and to retrieve new card details.

                // Find plan based on price id
                const amount = parseFloat(invoice.amount_due / 100).toFixed(2);

                // Check if invoice exists in our Database already
                const invoiceExists = await stripedatabase.findInvoice(invoice.id);
                if (invoiceExists.length != 0) {
                    // Update invoice
                    await stripedatabase.updateInvoiceFailed('require_payment_method', invoice.number, amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, invoice.id)
                } else {
                    const paymentIntentID = invoice.payment_intent;
                    const paymentIntent = await stripe.findPaymentIntent(paymentIntentID);
                    const clientSecret = paymentIntent.client_secret;

                    // Insert invoice
                    await createInvoice({
                        stripe_invoice_id: invoice.id,
                        stripe_reference_number: invoice.number,
                        stripe_payment_intent_id: paymentIntentID,
                        stripe_client_secret: clientSecret,
                        stripe_payment_intent_status: 'requires_payment_method',
                        amount,
                        balance: parseFloat(invoice.ending_balance / 100).toFixed(2),
                        fk_stripe_subscription_id: subscriptionID,
                    });
                    await stripedatabase.createInvoice(invoice.id, invoice.number, paymentIntentID, clientSecret, 'require_payment_method', amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, null)
                }

                // Send email to customer informing them to take action
                break;
            }

            case 'invoice.payment_action_required': {
                const invoice = event.data.object;
                const subscriptionID = invoice.subscription;
                // If the payment fails due to card authentication required,
                // an invoice.payment_failed event is sent, the subscription becomes past_due.
                // Use this webhook to notify user that their payment has
                // failed and to retrieve new card details.

                const amount = parseFloat(invoice.amount_due / 100).toFixed(2);

                // Check if invoice exists in our Database already
                const invoiceExists = await findInvoice(invoice.id);
                if (invoiceExists) {
                    // Update invoice
                    await stripedatabase.updateInvoiceFailed('require_action', invoice.number, amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, invoice.id)
                } else {
                    const paymentIntentID = invoice.payment_intent;
                    const paymentIntent = await findPaymentIntent(paymentIntentID);
                    const clientSecret = paymentIntent.client_secret;

                    // Insert invoice
                    await stripedatabase.createInvoice(invoice.id, invoice.number, paymentIntentID, clientSecret, 'require_action', amount, parseFloat(invoice.ending_balance / 100).toFixed(2), subscriptionID, null)
                }

                // Send email to customer informing them to take action

                break;
            }

            // Unexpected event type
            default: {
                console.log(`Unhandled event type ${event.type}.`);
            }
        };

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js > handleWebhook! " + error);
    }
}