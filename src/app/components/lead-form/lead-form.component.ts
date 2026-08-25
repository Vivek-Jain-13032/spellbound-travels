import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideCheck, LucideLoaderCircle, LucideLock } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { EmailService } from '../../services/email.service';
import { ToastService } from '../../services/toast.service';
import { CountryService } from '../../services/country.service';
import { containsLetter } from '../../validators/name.validator';
import { dateNotBefore } from '../../validators/date-range.validator';
import { LeadFormValue, ServiceNeeded } from '../../models/lead-form.model';
import { SelectComponent, SelectOption } from '../shared/select.component';
import { DatePickerDirective } from '../../directives/date-picker.directive';
import { PhoneInputDirective } from '../../directives/phone-input.directive';
import { AirportAutocompleteComponent } from '../shared/airport-autocomplete.component';
import { GtmService } from '../../services/gtm.service';

const MESSAGE_MAX_LENGTH = 1000;

const numberOptions = (count: number, start = 0): SelectOption[] =>
  Array.from({ length: count }, (_, i) => ({ value: String(i + start), label: String(i + start) }));

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideCheck,
    LucideLoaderCircle,
    LucideLock,
    SelectComponent,
    DatePickerDirective,
    PhoneInputDirective,
    AirportAutocompleteComponent,
  ],
  templateUrl: './lead-form.component.html',
})
export class LeadFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly nav = inject(NavigationService);
  private readonly emailService = inject(EmailService);
  private readonly toast = inject(ToastService);
  private readonly countryService = inject(CountryService);
  private readonly gtm = inject(GtmService);

  readonly messageMaxLength = MESSAGE_MAX_LENGTH;

  readonly countryOptions: SelectOption[] = this.countryService
    .getCountryNames()
    .map((name) => ({ value: name, label: name }));

  readonly serviceOptions: SelectOption[] = [
    { value: 'Flight', label: 'Flight Booking', icons: ['plane'] },
    { value: 'Visa', label: 'Visa Assistance', icons: ['id-card'] },
    { value: 'Both', label: 'Both', icons: ['plane', 'id-card'] },
  ];
  readonly adultOptions: SelectOption[] = numberOptions(9, 1); // 1–9
  readonly childrenOptions: SelectOption[] = numberOptions(9, 0); // 0–8
  readonly infantOptions: SelectOption[] = numberOptions(5, 0); // 0–4
  readonly tripTypeOptions: SelectOption[] = ['Leisure', 'Business', 'Honeymoon', 'Family', 'Group'].map((v) => ({
    value: v,
    label: v,
  }));
  readonly journeyTypeOptions: { value: 'One Way' | 'Round Trip' | 'Multi City'; label: string }[] = [
    { value: 'One Way', label: 'One Way' },
    { value: 'Round Trip', label: 'Round Trip' },
    { value: 'Multi City', label: 'Multi City' },
  ];
  readonly travelClassOptions: SelectOption[] = ['Economy', 'Business', 'First Class'].map((v) => ({
    value: v,
    label: v,
  }));
  readonly visaTypeOptions: SelectOption[] = ['Tourist', 'Business', 'Student', 'Work', 'Transit'].map((v) => ({
    value: v,
    label: v,
  }));
  readonly preferredContactOptions: { value: 'Email' | 'Phone' | 'WhatsApp'; label: string }[] = [
    { value: 'Email', label: 'Email' },
    { value: 'Phone', label: 'Phone' },
    { value: 'WhatsApp', label: 'WhatsApp' },
  ];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2), containsLetter()]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    service: ['' as ServiceNeeded | '', Validators.required],
    adults: ['1', Validators.required],
    children: ['0', Validators.required],
    infants: ['0', Validators.required],
    preferredContact: ['' as 'Email' | 'Phone' | 'WhatsApp' | '', Validators.required],
    tripType: ['', Validators.required],
    flight: this.fb.nonNullable.group(
      {
        journeyType: ['One Way' as 'One Way' | 'Round Trip' | 'Multi City'],
        from: [''],
        to: [''],
        departureDate: [''],
        returnDate: [''],
        travelClass: [''],
      },
      { validators: [dateNotBefore('departureDate', 'returnDate')] },
    ),
    visa: this.fb.nonNullable.group({
      nationality: [''],
      destinationCountry: [''],
      visaType: [''],
      expectedTravelDate: [''],
    }),
    message: ['', Validators.maxLength(MESSAGE_MAX_LENGTH)],
    consent: [false, Validators.requiredTrue],
    // Honeypot: invisible to real users (see template), bots that auto-fill
    // every input will fill this in — if it's non-empty on submit we treat
    // it as spam. No validators on purpose; it must never block a real user.
    website: [''],
  });

  loading = false;

  private serviceSub?: Subscription;
  private journeyTypeSub?: Subscription;

  constructor() {
    // "Enquire Now" / hero CTAs pre-select a service and scroll here.
    effect(() => {
      const service = this.nav.preselectedService();
      if (service) {
        this.form.controls.service.setValue(service);
      }
    });
  }

  ngOnInit(): void {
    this.serviceSub = this.form.controls.service.valueChanges.subscribe((service) => {
      this.applyConditionalValidators(service);
    });

    // Return Date only makes sense (and is only required) for Round Trip;
    // One Way/Multi City hide it entirely (see template) and shouldn't
    // carry a stale value or validator when hidden.
    this.journeyTypeSub = this.form.controls.flight.controls.journeyType.valueChanges.subscribe((journeyType) => {
      const returnDate = this.form.controls.flight.controls.returnDate;
      if (journeyType === 'Round Trip') {
        returnDate.setValidators(Validators.required);
      } else {
        returnDate.setValue('');
        returnDate.clearValidators();
      }
      returnDate.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.serviceSub?.unsubscribe();
    this.journeyTypeSub?.unsubscribe();
  }

  get showFlight(): boolean {
    const service = this.form.controls.service.value;
    return service === 'Flight' || service === 'Both';
  }

  get showVisa(): boolean {
    const service = this.form.controls.service.value;
    return service === 'Visa' || service === 'Both';
  }

  get journeyType(): string {
    return this.form.controls.flight.controls.journeyType.value;
  }

  get todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /** Return Date can't be before whatever Departure Date is currently set to. */
  get returnDateMin(): string {
    return this.form.controls.flight.controls.departureDate.value || this.todayIso;
  }

  get messageLength(): number {
    return this.form.controls.message.value?.length ?? 0;
  }

  isInvalid(controlPath: string): boolean {
    const control = this.form.get(controlPath);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return;

    // Honeypot tripped: pretend success without actually sending anything,
    // so a bot has no signal that it was caught.
    if (this.form.controls.website.value) {
      this.toast.show("Thank you! We'll be in touch within 24 hours. ✓", 'success');
      this.resetForm();
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    const value = this.form.getRawValue() as unknown as LeadFormValue;

    try {
      await this.emailService.sendEnquiry(value);

      this.gtm.pushEvent('generate_lead', {
        service: value.service,
        preferred_contact: value.preferredContact
      });

      this.toast.show("Thank you! We'll be in touch within 24 hours. ✓", 'success');
      this.resetForm();
    } catch {
      this.toast.show('Something went wrong. Please try WhatsApp or call us directly.', 'error');
    } finally {
      this.loading = false;
    }
  }

  private resetForm(): void {
    this.form.reset({
      fullName: '',
      email: '',
      phone: '',
      service: '',
      adults: '1',
      children: '0',
      infants: '0',
      preferredContact: '',
      tripType: '',
      flight: { journeyType: 'One Way', from: '', to: '', departureDate: '', returnDate: '', travelClass: '' },
      visa: { nationality: '', destinationCountry: '', visaType: '', expectedTravelDate: '' },
      message: '',
      consent: false,
      website: '',
    });
    this.applyConditionalValidators('');
  }

  private applyConditionalValidators(service: ServiceNeeded | ''): void {
    const flight = this.form.controls.flight.controls;
    const visa = this.form.controls.visa.controls;
    const showFlight = service === 'Flight' || service === 'Both';
    const showVisa = service === 'Visa' || service === 'Both';

    this.setRequired(flight.from, showFlight);
    this.setRequired(flight.to, showFlight);
    this.setRequired(flight.departureDate, showFlight);
    this.setRequired(flight.travelClass, showFlight);

    this.setRequired(visa.nationality, showVisa);
    this.setRequired(visa.destinationCountry, showVisa);
    this.setRequired(visa.visaType, showVisa);
    this.setRequired(visa.expectedTravelDate, showVisa);
  }

  private setRequired(control: AbstractControl, required: boolean, extra: ValidatorFn[] = []): void {
    control.setValidators(required ? [Validators.required, ...extra] : extra);
    control.updateValueAndValidity();
  }
}
