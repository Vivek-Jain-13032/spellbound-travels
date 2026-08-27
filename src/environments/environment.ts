export const environment = {
  production: false,

  // EmailJS (https://www.emailjs.com) — no backend required.
  // Create a free account, an Email Service, and two templates (see README.md
  // "Configure EmailJS" section), then paste the IDs below.
  emailjsServiceId: 'service_genvnee', //Test service ID for Spellbound Travels: 'service_m3v00ty'
  // Template sent to the Spellbound Travels inbox with the lead's details.
  emailjsTemplateId: 'template_xcbb23f', //Test template ID for Spellbound Travels: 'template_a488anh'
  // Template sent back to the enquirer confirming receipt.
  emailjsUserTemplateId: 'template_a8xljml', //Test template ID for Spellbound Travels: 'template_4jp5q0f'
  emailjsPublicKey: '3SU5Xx5UO_4X20D2l', //Test public key for Spellbound Travels: 'MJCcpqmUrl2a2jq6-'  

  contact: {
    // TODO: test credentials and uncomment once configured
    // adminEmail: 'vivekjain203040@gmail.com',
    // phone: '+91 7414081608',
    // phoneHref: 'tel:+917414081608',
    // whatsappHref: 'https://wa.me/917414081608',
    adminEmail: 'contact@spellboundtravels.com',
    phone: '+91 8690045677',
    phoneHref: 'tel:+918690045677',
    whatsappHref: 'https://wa.me/918690045677',
  },
};
