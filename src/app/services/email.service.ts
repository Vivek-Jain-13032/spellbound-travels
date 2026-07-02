import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';
import { LeadFormValue, ServiceNeeded } from '../models/lead-form.model';

const SERVICE_LABELS: Record<ServiceNeeded, string> = {
  Flight: 'Flight Booking',
  Visa: 'Visa Assistance',
  Both: 'Flight Booking and Visa Assistance',
};

/**
 * Sends lead enquiries via EmailJS — no backend required.
 * Two templates are used: one notifies the Spellbound Travels inbox with
 * the full enquiry, the other confirms receipt back to the enquirer.
 * See README.md "Configure EmailJS" for template setup.
 */
@Injectable({ providedIn: 'root' })
export class EmailService {
  async sendEnquiry(value: LeadFormValue): Promise<void> {
    const templateParams = this.buildTemplateParams(value);

    await emailjs.send(
      environment.emailjsServiceId,
      environment.emailjsTemplateId,
      templateParams,
      { publicKey: environment.emailjsPublicKey },
    );

    await emailjs.send(
      environment.emailjsServiceId,
      environment.emailjsUserTemplateId,
      templateParams,
      { publicKey: environment.emailjsPublicKey },
    );
  }

  private buildTemplateParams(value: LeadFormValue): Record<string, string> {
    return {
      to_admin_email: environment.contact.adminEmail,
      to_email: value.email,
      submitted_at: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      full_name: value.fullName,
      email: value.email,
      phone: value.phone,
      service: value.service ? SERVICE_LABELS[value.service] : '',
      travelers: this.formatTravelers(value.adults, value.children, value.infants),
      adults: value.adults,
      children: value.children,
      infants: value.infants,
      preferred_contact: value.preferredContact,
      trip_type: value.tripType,
      journey_type: value.flight.journeyType,
      flying_from: value.flight.from,
      flying_to: value.flight.to,
      departure_date: value.flight.departureDate,
      return_date: value.flight.returnDate,
      travel_class: value.flight.travelClass,
      nationality: value.visa.nationality,
      destination_country: value.visa.destinationCountry,
      visa_type: value.visa.visaType,
      expected_travel_date: value.visa.expectedTravelDate,
      message: value.message,
    };
  }

  /** e.g. "2 Adults, 1 Child, 1 Infant" — readable summary for the email body. */
  private formatTravelers(adults: string, children: string, infants: string): string {
    const parts: string[] = [];
    const add = (count: string, singular: string, plural: string) => {
      const n = Number(count);
      if (n > 0) parts.push(`${n} ${n === 1 ? singular : plural}`);
    };
    add(adults, 'Adult', 'Adults');
    add(children, 'Child', 'Children');
    add(infants, 'Infant', 'Infants');
    return parts.join(', ');
  }
}
