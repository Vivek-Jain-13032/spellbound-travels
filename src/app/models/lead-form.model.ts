export type ServiceNeeded = 'Flight' | 'Visa' | 'Both';

export type TravelClass = 'Economy' | 'Business' | 'First Class';

export type JourneyType = 'One Way' | 'Round Trip' | 'Multi City';

export type VisaType = 'Tourist' | 'Business' | 'Student' | 'Work' | 'Transit';

export type PreferredContact = 'Email' | 'Phone' | 'WhatsApp';

export type TripType = 'Leisure' | 'Business' | 'Honeymoon' | 'Family' | 'Group';

export interface FlightDetails {
  journeyType: JourneyType | '';
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  travelClass: TravelClass | '';
}

export interface VisaDetails {
  nationality: string;
  destinationCountry: string;
  visaType: VisaType | '';
  expectedTravelDate: string;
}

export interface LeadFormValue {
  fullName: string;
  email: string;
  phone: string;
  service: ServiceNeeded | '';
  adults: string;
  children: string;
  infants: string;
  preferredContact: PreferredContact | '';
  tripType: TripType | '';
  flight: FlightDetails;
  visa: VisaDetails;
  message: string;
  consent: boolean;
}
