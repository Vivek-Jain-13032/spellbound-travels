import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideCheck, LucideLoaderCircle, LucideLock } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { EmailService } from '../../services/email.service';
import { ToastService } from '../../services/toast.service';
import { phoneDigitsInRange } from '../../validators/phone.validator';
import { containsLetter } from '../../validators/name.validator';
import { dateNotBefore } from '../../validators/date-range.validator';
import { LeadFormValue, ServiceNeeded } from '../../models/lead-form.model';
import { SelectComponent, SelectOption } from '../shared/select.component';
import { DatePickerDirective } from '../../directives/date-picker.directive';

const MESSAGE_MAX_LENGTH = 1000;

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideCheck, LucideLoaderCircle, LucideLock, SelectComponent, DatePickerDirective],
  templateUrl: './lead-form.component.html',
})
export class LeadFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly nav = inject(NavigationService);
  private readonly emailService = inject(EmailService);
  private readonly toast = inject(ToastService);

  readonly messageMaxLength = MESSAGE_MAX_LENGTH;

  readonly serviceOptions: SelectOption[] = [
    { value: 'Flight', label: '✈️ Flight Booking' },
    { value: 'Visa', label: '🛂 Visa Assistance' },
    { value: 'Both', label: '✈️🛂 Both' },
  ];
  readonly travelerOptions: SelectOption[] = Array.from({ length: 9 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  readonly tripTypeOptions: SelectOption[] = ['Leisure', 'Business', 'Honeymoon', 'Family', 'Group'].map((v) => ({
    value: v,
    label: v,
  }));
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
    phone: ['', [Validators.required, phoneDigitsInRange(10)]],
    service: ['' as ServiceNeeded | '', Validators.required],
    travelers: ['1', Validators.required],
    preferredContact: ['' as 'Email' | 'Phone' | 'WhatsApp' | '', Validators.required],
    tripType: ['', Validators.required],
    flight: this.fb.nonNullable.group(
      {
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
  }

  ngOnDestroy(): void {
    this.serviceSub?.unsubscribe();
  }

  get showFlight(): boolean {
    const service = this.form.controls.service.value;
    return service === 'Flight' || service === 'Both';
  }

  get showVisa(): boolean {
    const service = this.form.controls.service.value;
    return service === 'Visa' || service === 'Both';
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
      travelers: '1',
      preferredContact: '',
      tripType: '',
      flight: { from: '', to: '', departureDate: '', returnDate: '', travelClass: '' },
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
