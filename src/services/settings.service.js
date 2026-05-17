const { SiteSetting } = require('../database/models');

let cachedSettings = null;

async function getSettings() {
  if (cachedSettings) return cachedSettings;
  let settings = await SiteSetting.findOne({ where: { id: 1 } });
  if (!settings) {
    settings = await SiteSetting.create({ id: 1 });
  }
  cachedSettings = settings.toJSON();
  return cachedSettings;
}

async function updateSettings(data) {
  const allowed = [
    'site_name', 'site_email', 'site_phone', 'site_address',
    'currency', 'currency_symbol',
    'payment_paystack', 'payment_whatsapp', 'whatsapp_number',
    'notify_email', 'notify_new_product'
  ];
  const updates = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updates[key] = data[key];
  }
  let settings = await SiteSetting.findOne({ where: { id: 1 } });
  if (!settings) {
    settings = await SiteSetting.create({ id: 1, ...updates });
  } else {
    await settings.update(updates);
  }
  cachedSettings = settings.toJSON();
  return cachedSettings;
}

function invalidateCache() {
  cachedSettings = null;
}

module.exports = { getSettings, updateSettings, invalidateCache };
