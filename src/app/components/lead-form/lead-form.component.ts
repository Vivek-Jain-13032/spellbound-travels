import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideCheck, LucideLoaderCircle, LucideLock } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { EmailService } from '../../services/email.service';
import { ToastService } from '../../services/toast.service';
import { minPhoneDigits } from '../../validators/phone.validator';
import { LeadFormValue, ServiceNeeded } from '../../models/lead-form.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideCheck, LucideLoaderCircle, LucideLock],
  templateUrl: './lead-form.component.html',
})
export class LeadFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly nav = inject(NavigationService);
  private readonly emailService = inject(EmailService);
  private readonly toast = inject(ToastService);

  readonly visaTypes = ['Tourist', 'Business', 'Student', 'Work', 'Transit'] as const;
  readonly travelClasses = ['Economy', 'Business', 'First Class'] as const;
  readonly passengerOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, minPhoneDigits(10)]],
    service: ['' as ServiceNeeded | '', Validators.required],
    flight: this.fb.nonNullable.group({
      from: [''],
      to: [''],
      departureDate: [''],
      returnDate: [''],
      passengers: [1],
      travelClass: [''],
    }),
    visa: this.fb.nonNullable.group({
      nationality: [''],
      destinationCountry: [''],
      visaType: [''],
      expectedTravelDate: [''],
    }),
    message: [''],
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

  isInvalid(controlPath: string): boolean {
    const control = this.form.get(controlPath);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    const value = this.form.getRawValue() as LeadFormValue;

    try {
      await this.emailService.sendEnquiry(value);
      this.toast.show("Thank you! We'll be in touch within 24 hours. ✓", 'success');
      this.form.reset({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        flight: { from: '', to: '', departureDate: '', returnDate: '', passengers: 1, travelClass: '' },
        visa: { nationality: '', destinationCountry: '', visaType: '', expectedTravelDate: '' },
        message: '',
      });
      this.applyConditionalValidators('');
    } catch {
      this.toast.show('Something went wrong. Please try WhatsApp or call us directly.', 'error');
    } finally {
      this.loading = false;
    }
  }

  private applyConditionalValidators(service: ServiceNeeded | ''): void {
    const flight = this.form.controls.flight.controls;
    const visa = this.form.controls.visa.controls;
    const showFlight = service === 'Flight' || service === 'Both';
    const showVisa = service === 'Visa' || service === 'Both';

    this.setRequired(flight.from, showFlight);
    this.setRequired(flight.to, showFlight);
    this.setRequired(flight.departureDate, showFlight);
    this.setRequired(flight.passengers, showFlight, [Validators.min(1), Validators.max(9)]);
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
