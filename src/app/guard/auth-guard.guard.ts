import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import Swal  from 'sweetalert2';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1),
    map((isLoggedIn: boolean) => {

      if (!isLoggedIn) {
        router.navigate(['/login']);
        return false;
      }
      return true;

    })
  );
};
