import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import Swal  from 'sweetalert2';

export const ResetPasswordLinkGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1),
    map((isLoggedIn: boolean) => {

            // Define the restricted URL
    if ( state.url.includes('/reset-password') ) {
        if(isLoggedIn){
        // Show loading spinner while redirecting
        Swal.fire({
        title: 'Already Logged In',
        text: 'Redirecting...',
        timer:3000,
        didOpen: () => {
            Swal.showLoading();
        }
        }).then(() => {
        router.navigate(['/simple-search']); // Navigate after Swal is closed
        });
        // Adjust timeout as needed
        return false;
        }
        return true;
    }
      if (!isLoggedIn) {
        router.navigate(['/login']); // Navigate after Swal is closed
        return false;
      }
      return true;
    })
  );
};
