/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {ChangePasswordGuard} from './change.password.service';
import {Authentication} from '../identity/domain/authentication.model';

describe('Test Password Change Service', () => {

  const route: ActivatedRouteSnapshot = undefined;

  const state: RouterStateSnapshot = undefined;

  const router = {
    navigate() {
    }
  };

  describe('when logged in', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ChangePasswordGuard,
          {provide: Router, useValue: router},
          {
            provide: Store, useClass: class {
            select = jasmine.createSpy('select').and.callFake(selector => Observable.of({}));
          }
          }
        ]
      });
    });

    function setup(authentication: Authentication): ChangePasswordGuard {
      const store = TestBed.get(Store);

      store.select.and.returnValue(Observable.of({
        authentication
      }));

      return TestBed.get(ChangePasswordGuard);
    }

    it('should test if route is not active when password expiration is in the past', (done: DoneFn) => {
      const changePasswordGuard = setup({
        passwordExpiration: '2016-01-01',
        accessToken: '',
        accessTokenExpiration: '',
        tokenType: '',
        refreshTokenExpiration: ''
      });

      changePasswordGuard.canActivateChild(route, state).subscribe(canActivateChild => {
        expect(canActivateChild).toBeFalsy();
        done();
      });
    });

    it('should test if route is active when no password expiration is set', (done: DoneFn) => {
      const changePasswordGuard = setup({
        passwordExpiration: null,
        accessToken: '',
        accessTokenExpiration: '',
        tokenType: '',
        refreshTokenExpiration: ''
      });

      changePasswordGuard.canActivateChild(route, state).subscribe(canActivateChild => {
        expect(canActivateChild).toBeTruthy();
        done();
      });
    });
  });

});
