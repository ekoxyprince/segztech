/**
 * Geolocation Middleware
 * Detects user location based on IP address
 */

let geoip;
try {
  geoip = require('geoip-lite');
} catch (e) {
  console.log('geoip-lite not installed, using basic geolocation');
}

const geoData = {
  US: { country: 'United States', currency: 'NGN', timezone: 'America/New_York' },
  GB: { country: 'United Kingdom', currency: 'GBP', timezone: 'Europe/London' },
  DE: { country: 'Germany', currency: 'EUR', timezone: 'Europe/Berlin' },
  FR: { country: 'France', currency: 'EUR', timezone: 'Europe/Paris' },
  ES: { country: 'Spain', currency: 'EUR', timezone: 'Europe/Madrid' },
  IT: { country: 'Italy', currency: 'EUR', timezone: 'Europe/Rome' },
  NL: { country: 'Netherlands', currency: 'EUR', timezone: 'Europe/Amsterdam' },
  BE: { country: 'Belgium', currency: 'EUR', timezone: 'Europe/Brussels' },
  AT: { country: 'Austria', currency: 'EUR', timezone: 'Europe/Vienna' },
  CH: { country: 'Switzerland', currency: 'CHF', timezone: 'Europe/Zurich' },
  CA: { country: 'Canada', currency: 'CAD', timezone: 'America/Toronto' },
  AU: { country: 'Australia', currency: 'AUD', timezone: 'Australia/Sydney' },
  NZ: { country: 'New Zealand', currency: 'NZD', timezone: 'Pacific/Auckland' },
  JP: { country: 'Japan', currency: 'JPY', timezone: 'Asia/Tokyo' },
  KR: { country: 'South Korea', currency: 'KRW', timezone: 'Asia/Seoul' },
  CN: { country: 'China', currency: 'CNY', timezone: 'Asia/Shanghai' },
  HK: { country: 'Hong Kong', currency: 'HKD', timezone: 'Asia/Hong_Kong' },
  SG: { country: 'Singapore', currency: 'SGD', timezone: 'Asia/Singapore' },
  IN: { country: 'India', currency: 'INR', timezone: 'Asia/Kolkata' },
  BR: { country: 'Brazil', currency: 'BRL', timezone: 'America/Sao_Paulo' },
  MX: { country: 'Mexico', currency: 'MXN', timezone: 'America/Mexico_City' },
  AE: { country: 'United Arab Emirates', currency: 'AED', timezone: 'Asia/Dubai' },
  SA: { country: 'Saudi Arabia', currency: 'SAR', timezone: 'Asia/Riyadh' },
  ZA: { country: 'South Africa', currency: 'ZAR', timezone: 'Africa/Johannesburg' },
  NG: { country: 'Nigeria', currency: 'NGN', timezone: 'Africa/Lagos' },
  EG: { country: 'Egypt', currency: 'EGP', timezone: 'Africa/Cairo' },
  KE: { country: 'Kenya', currency: 'KES', timezone: 'Africa/Nairobi' },
  PH: { country: 'Philippines', currency: 'PHP', timezone: 'Asia/Manila' },
  TH: { country: 'Thailand', currency: 'THB', timezone: 'Asia/Bangkok' },
  MY: { country: 'Malaysia', currency: 'MYR', timezone: 'Asia/Kuala_Lumpur' },
  ID: { country: 'Indonesia', currency: 'IDR', timezone: 'Asia/Jakarta' },
  VN: { country: 'Vietnam', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh' },
  PK: { country: 'Pakistan', currency: 'PKR', timezone: 'Asia/Karachi' },
  BD: { country: 'Bangladesh', currency: 'BDT', timezone: 'Asia/Dhaka' },
  AR: { country: 'Argentina', currency: 'ARS', timezone: 'America/Buenos_Aires' },
  CL: { country: 'Chile', currency: 'CLP', timezone: 'America/Santiago' },
  CO: { country: 'Colombia', currency: 'COP', timezone: 'America/Bogota' },
  PE: { country: 'Peru', currency: 'PEN', timezone: 'America/Lima' },
  PL: { country: 'Poland', currency: 'PLN', timezone: 'Europe/Warsaw' },
  SE: { country: 'Sweden', currency: 'SEK', timezone: 'Europe/Stockholm' },
  NO: { country: 'Norway', currency: 'NOK', timezone: 'Europe/Oslo' },
  DK: { country: 'Denmark', currency: 'DKK', timezone: 'Europe/Copenhagen' },
  FI: { country: 'Finland', currency: 'EUR', timezone: 'Europe/Helsinki' },
  IE: { country: 'Ireland', currency: 'EUR', timezone: 'Europe/Dublin' },
  PT: { country: 'Portugal', currency: 'EUR', timezone: 'Europe/Lisbon' },
  GR: { country: 'Greece', currency: 'EUR', timezone: 'Europe/Athens' },
  CZ: { country: 'Czech Republic', currency: 'CZK', timezone: 'Europe/Prague' },
  HU: { country: 'Hungary', currency: 'HUF', timezone: 'Europe/Budapest' },
  RO: { country: 'Romania', currency: 'RON', timezone: 'Europe/Bucharest' },
  UA: { country: 'Ukraine', currency: 'UAH', timezone: 'Europe/Kiev' },
  TR: { country: 'Turkey', currency: 'TRY', timezone: 'Europe/Istanbul' },
  IL: { country: 'Israel', currency: 'ILS', timezone: 'Asia/Jerusalem' },
  NG: { country: 'Nigeria', currency: 'NGN', timezone: 'Africa/Lagos' },
};

function getGeoInfo(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      country: 'United States',
      region: 'Unknown',
      city: 'Local',
      ll: [37.0902, -95.7129],
      timezone: 'America/New_York',
      currency: 'NGN'
    };
  }

  if (geoip) {
    try {
      const geo = geoip.lookup(ip);
      if (geo) {
        const countryData = geoData[geo.country] || {
          country: geo.country,
          currency: 'NGN',
          timezone: 'UTC'
        };
        
        return {
          country: countryData.country,
          region: geo.region,
          city: geo.city,
          ll: geo.ll,
          timezone: countryData.timezone,
          currency: countryData.currency
        };
      }
    } catch (e) {
      console.error('Geo lookup error:', e);
    }
  }

  return {
    country: 'United States',
    region: 'Unknown',
    city: 'Unknown',
    ll: [37.0902, -95.7129],
    timezone: 'America/New_York',
    currency: 'NGN'
  };
}

function geoMiddleware(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
  
  if (!req.geo) {
    req.geo = {};
  }
  
  const geoInfo = getGeoInfo(clientIp);
  
  req.geo.ip = clientIp;
  req.geo.country = geoInfo.country;
  req.geo.region = geoInfo.region;
  req.geo.city = geoInfo.city;
  req.geo.latitude = geoInfo.ll?.[0];
  req.geo.longitude = geoInfo.ll?.[1];
  req.geo.timezone = geoInfo.timezone;
  req.geo.currency = geoInfo.currency;
  
  next();
}

module.exports = {
  geoMiddleware,
  getGeoInfo,
  geoData
};
