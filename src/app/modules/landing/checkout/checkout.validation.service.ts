import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CheckoutValidationService {

    /**
     * Constructor
     */
    constructor()
    {
    }
  
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            required: 'Required',
            invalidEmailAddress: 'Invalid email address',
            invalidPhonenumber: 'Invalid phonenumber',
            invalidPostcode: 'Invalid postcode',
            minlength: `Minimum length ${validatorValue.requiredLength}`,
            deliveryProviderHasError: `Error found in delivery service provider ${validatorValue}`
        };
        
        return config[validatorName];
    }
    
    static requiredValidator(control){
      if (control.value) {
        return true;
      } else {
        return false;
      }
    }
  
    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (
            control.value.match(
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            )
        ) {
            return null;
        } else {
            return { invalidEmailAddress: true };
        }
    }

    static phonenumberValidator(control) {

        if (!control.value || control.value === null){
          return { required: true };
        }

        // https://regexr.com/3c53v
        if (
          control.value.match(
            /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
          )
        ) {
          return null;
        } else {
          return { invalidPhonenumber: true };
        }
    }

    static postcodeValidator(control) {

        if (!control.value || control.value === null){
          return { required: true };
        }

        // https://regexr.com/3c53v
        if (
          control.value.match(
            /^[0-9]+$/
          )
        ) {
          return null;
        } else {
          return { invalidPostcode: true };
        }
    }

    static deliveryProviderValidator(control){
      return null;
    }
}