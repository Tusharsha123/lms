import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession({ courseId, courseTitle, price, userId, userEmail, couponCode }) {
  const discounts = couponCode ? [{ coupon: couponCode }] : [];
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: courseTitle,
          metadata: { courseId }
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/courses/${courseId}?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/courses/${courseId}?canceled=true`,
    customer_email: userEmail,
    metadata: { userId, courseId },
    discounts,
  });
  
  return session;
}

export async function createStripeCoupon(discountPercent, code) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercent,
    duration: 'once',
    id: code,
  });
  return coupon;
}

export async function constructWebhookEvent(body, signature) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

export async function createConnectAccount(email, userId) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: { userId },
    capabilities: {
      transfers: { requested: true },
    },
  });
  return account;
}

export async function createAccountLink(accountId, userId) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/instructor/earnings?refresh=true`,
    return_url: `${process.env.NEXTAUTH_URL}/instructor/earnings?success=true`,
    type: 'account_onboarding',
  });
  return accountLink;
}

export async function createPayout(accountId, amount) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    destination: accountId,
  });
  return transfer;
}

export { stripe };
