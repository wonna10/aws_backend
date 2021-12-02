const pool = require('../config/database');
const moment = require('moment')

module.exports.getUserByAccountID = (acc_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM accounts WHERE acc_id = ?`, [acc_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getUserByAccountID

module.exports.getUserDataByAccountID = (acc_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM users WHERE acc_id = ?`, [acc_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getUserByAccountID

module.exports.updateTrial = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE companies SET trialed = 1 WHERE company_id = ?`, [company_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findDuplicatePaymentMethod


module.exports.getAccountByStripeCustID = (StripeCustID) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM accounts WHERE stripe_customer_id = ?`, [StripeCustID], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getAccountByStripeCustID



module.exports.getAllPaymentMethods = (acc_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM payment_methods WHERE acc_id = ?`, [acc_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getAllPaymentMethods

module.exports.getAllSubscriptions = (acc_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM subscriptions WHERE acc_id = ?`, [acc_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getAllSubscriptions 


module.exports.findPaymentMethod = (paymentMethodID) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM payment_methods WHERE stripe_payment_method_id = ? `, [paymentMethodID], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findPaymentMethod 

module.exports.updateAccountBalance = (acc_id, balance) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE accounts SET balance = ? WHERE acc_id = ?`, [balance, acc_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateAccountBalance

module.exports.updatePaymentMethod = (paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE payment_methods SET stripe_payment_method_fingerprint = ?, stripe_card_last_four_digit = ?, stripe_card_type = ?, stripe_card_exp_date = ? WHERE stripe_payment_method_id = ?`, [cardFingerprint, cardLastFourDigit, cardType, cardExpDate, paymentMethodID], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of updatePaymentMethod

module.exports.findDuplicatePaymentMethod = (acc_id, cardFingerprint) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM payment_methods WHERE acc_id = ? AND stripe_payment_method_fingerprint = ?`, [acc_id, cardFingerprint],(err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findDuplicatePaymentMethod

module.exports.insertPaymentMethod = (acc_id, paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                let currentTime = moment().format('YYYY-MM-DD hh:mm:ss')
                connection.query(`INSERT INTO payment_methods ( acc_id, stripe_payment_method_id, stripe_payment_method_fingerprint, stripe_card_last_four_digit, stripe_card_type, stripe_card_exp_date, updated_at) VALUES (?,?,?,?,?,?,?)`,
                    [acc_id, paymentMethodID, cardFingerprint, cardLastFourDigit, cardType, cardExpDate, currentTime], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of insertPaymentMethod

module.exports.removePaymentMethod = (paymentMethodID) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`DELETE FROM payment_methods WHERE stripe_payment_method_id = ?`, [paymentMethodID], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of removePaymentMethod

module.exports.getAllPlan = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM plans`, [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of getAllPlan 

module.exports.findOnePlan = (type) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM plans WHERE name = ?`, [type], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findOnePlan

module.exports.findPlanByPriceID = (price_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`Select * from plans where stripe_price_id = '${price_id}' `,
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findPlanByPriceID

module.exports.findLiveSubscription = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM subscriptions WHERE acc_id = ? AND stripe_status != 'canceled' `, [company_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findLiveSubscription

module.exports.findSubscriptionByAccId = (acc_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT * FROM subscriptions s, plans p WHERE s.plan_id = p.plan_id AND s.acc_id=${acc_id} AND s.stripe_status != "canceled"; `,
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findSubscriptionByAccId

module.exports.findActiveSubscription = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM subscriptions WHERE acc_id = ? AND stripe_status != 'canceled' OR stripe_status != 'incomplete' `, [company_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of findActiveSubscription

module.exports.createSubscription = (subscriptionID, planID, acc_id, company_id, paymentMethodID, stripe_status, trial_end) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO subscriptions ( stripe_subscription_id, plan_id, acc_id, company_id, payment_method_id, stripe_status, trial_end) VALUES (?,?,?,?,?,?,?)`,
                    [subscriptionID, planID, acc_id, company_id, paymentMethodID, stripe_status, trial_end],(err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of createSubscription
                        
module.exports.createSubscriptionWebhook = ( subscriptionID, planID, accountID, company_id, stripe_status, paymentIntentID) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO payment_methods ( stripe_subscription_id, plan_id, acc_id, company_id, stripe_status, payment_method_id) VALUES (?,?,?,?,?,?)`,
                    [ subscriptionID, planID, accountID, company_id, stripe_status, paymentIntentID],(err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of createSubscription

module.exports.updateSubscriptionPlan = (subscription_id, plan_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE subscriptions SET plan_id = ? WHERE stripe_subscription_id = ?`, [plan_id, subscription_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateSubscriptionPlan

module.exports.updateSubscriptionPaymentMethod = (subscription_id, paymentMethodID) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE subscriptions SET payment_method_id = ? WHERE stripe_subscription_id = ?`, [paymentMethodID, subscription_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateSubscriptionPaymentMethod 

module.exports.updateSubscriptionStatus = (subscription_id, stripe_status) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE subscriptions SET stripe_status = ? WHERE stripe_subscription_id = ?`, [stripe_status, subscription_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateSubscriptionStatus

module.exports.updateSubscriptionBillingCycle = (stripe_status, plan_id, current_period_start, current_period_end, subscription_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE subscriptions SET stripe_status = ?, plan_id = ?, current_period_start = ?, current_period_end = ?, WHERE stripe_subscription_id = ?`, [stripe_status, plan_id, current_period_start, current_period_end, subscription_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateSubscriptionStatus

module.exports.createInvoice = (stripe_invoice_id, stripe_reference_number, stripe_payment_intent_id, stripe_client_secret, stripe_payment_intent_status, amount, balance, stripe_subscription_id, paid_on) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`INSERT INTO invoices (stripe_invoice_id, stripe_reference_number, stripe_payment_intent_id, stripe_client_secret, stripe_payment_intent_status, amount, balance, stripe_subscription_id, paid_on) VALUES (?,?,?,?,?,?,?,?,?)`,
                    [stripe_invoice_id, stripe_reference_number, stripe_payment_intent_id, stripe_client_secret, stripe_payment_intent_status, amount, balance, stripe_subscription_id, paid_on], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of createInvoice

module.exports.findInvoice = (invoice_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`SELECT * FROM invoices WHERE invoice_id = ?`, [invoice_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
            }
        });
    });
} //End of createInvoice

module.exports.updateInvoice = (stripe_payment_intent_status, stripe_reference_number, amount, balance, stripe_subscription_id, paid_on, stripe_invoice_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE invoices SET stripe_payment_intent_status = ?, stripe_reference_number = ?, amount = ?, balance = ?, stripe_subscription_id = ?, paid_on = ? WHERE stripe_invoice_id = ?`, [stripe_payment_intent_status, stripe_reference_number, amount, balance, stripe_subscription_id, paid_on, stripe_invoice_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateInvoice

module.exports.updateInvoiceUpdated = (stripe_payment_intent_status, amount, balance, stripe_subscription_id, stripe_invoice_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE invoices SET stripe_payment_intent_status = ?, amount = ?, balance = ?, stripe_subscription_id = ?,  WHERE stripe_invoice_id = ?`, [stripe_payment_intent_status, amount, balance, stripe_subscription_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateInvoice

module.exports.updateInvoiceFailed = (stripe_payment_intent_status, stripe_reference_number, amount, balance, stripe_subscription_id, stripe_invoice_id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                reject(err);
            } else {
                connection.query(`UPDATE invoices SET stripe_payment_intent_status = ?, stripe_reference_number = ?, amount = ?, balance = ?, stripe_subscription_id = ?, WHERE stripe_invoice_id = ?`, [stripe_payment_intent_status, stripe_reference_number, amount, balance, stripe_subscription_id, stripe_invoice_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateInvoice