export const environment = {
  production: false,

  // EmailJS (https://www.emailjs.com) — no backend required.
  // Create a free account, an Email Service, and two templates (see README.md
  // "Configure EmailJS" section), then paste the IDs below.
  emailjsServiceId: 'service_m3v00ty',
  // Template sent to the Spellbound Travels inbox with the lead's details.
  emailjsTemplateId: 'template_a488anh',
  // Template sent back to the enquirer confirming receipt.
  emailjsUserTemplateId: 'template_4jp5q0f',
  emailjsPublicKey: 'MJCcpqmUrl2a2jq6-',

  contact: {
    // TODO: test credentials and uncomment once configured
    // adminEmail: 'vivekjain203040@gmail.com',
    // phone: '+91 7414081608',
    // phoneHref: 'tel:+917414081608',
    // whatsappHref: 'https://wa.me/917414081608',
    adminEmail: 'reservations@spellboundtravels.co.in',
    phone: '+91 8690045677',
    phoneHref: 'tel:+918690045677',
    whatsappHref: 'https://wa.me/918690045677',
  },
};
