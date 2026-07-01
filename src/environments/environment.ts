export const environment = {
  production: false,

  // EmailJS (https://www.emailjs.com) — no backend required.
  // Create a free account, an Email Service, and two templates (see README.md
  // "Configure EmailJS" section), then paste the IDs below.
  emailjsServiceId: 'YOUR_SERVICE_ID',
  // Template sent to the Spellbound Travels inbox with the lead's details.
  emailjsTemplateId: 'YOUR_TEMPLATE_ID',
  // Template sent back to the enquirer confirming receipt.
  emailjsUserTemplateId: 'YOUR_USER_TEMPLATE_ID',
  emailjsPublicKey: 'YOUR_PUBLIC_KEY',

  contact: {
    adminEmail: 'vivekjain203040@gmail.com',
    phone: '+91 7414081608',
    phoneHref: 'tel:+917414081608',
    whatsappHref: 'https://wa.me/917414081608',
  },
};
