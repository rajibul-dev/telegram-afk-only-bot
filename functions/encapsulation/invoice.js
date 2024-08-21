const STRIPE_TOKEN = process.env.PROVIDER_TOKEN;

process.env.DEV_MODE === "true"
  ? process.env.DEV_STRIPE_PROVIDER_TOKEN
  : process.env.STRIPE_PROVIDER_TOKEN;

function getInvoice({ title, description, id, currency, amount }) {
  const invoice = {
    chat_id: id,
    title,
    description,
    currency,
    prices: [{ label: title, amount }],
    payload: {
      unique_id: `${id}_${Number(new Date())}`,
      groupID: id,
      provider_token: STRIPE_TOKEN,
    },
  };

  return invoice;
}

module.exports = { getInvoice };
