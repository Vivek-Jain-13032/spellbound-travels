export type ServiceNeeded = 'Flight' | 'Visa' | 'Both';

export type TravelClass = 'Economy' | 'Business' | 'First Class';

export type VisaType = 'Tourist' | 'Business' | 'Student' | 'Work' | 'Transit';

export interface FlightDetails {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
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
  flight: FlightDetails;
  visa: VisaDetails;
  message: string;
}
