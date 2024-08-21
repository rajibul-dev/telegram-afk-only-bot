function getInvoice({ title, description, id, currency, amount }) {
  const invoice = {
    chat_id: id,
    title,
    description,
    currency,
    prices: [{ label: title, amount }],
    payload: {
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN,
    },
  };

  return invoice;
}

module.exports = { getInvoice };
