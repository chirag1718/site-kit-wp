/**
 * `modules/adsense` data store: ad-blocking-recovery tests.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import {
	createTestRegistry,
	unsubscribeFromAll,
} from '../../../../../tests/js/utils';
import { MODULES_ADSENSE } from './constants';

describe( 'modules/adsense ad-blocking-recovery', () => {
	let registry;

	beforeAll( () => {
		API.setUsingCache( false );
	} );

	beforeEach( () => {
		registry = createTestRegistry();
	} );

	afterAll( () => {
		API.setUsingCache( true );
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'actions', () => {
		describe( 'syncAdBlockingRecoveryTags', () => {
			it( 'dispatches an error if the request fails', async () => {
				const errorResponse = {
					code: 'internal_server_error',
					message: 'Internal server error',
					data: { status: 500 },
				};

				fetchMock.postOnce(
					new RegExp(
						'^/google-site-kit/v1/modules/adsense/data/sync-ad-blocking-recovery-tags'
					),
					{ body: errorResponse, status: 500 }
				);

				const { response, error } = await registry
					.dispatch( MODULES_ADSENSE )
					.syncAdBlockingRecoveryTags();

				expect( error ).toEqual( errorResponse );
				expect( response ).toEqual( undefined );
				expect( console ).toHaveErrored();
			} );

			it( 'fetches and returns success status', async () => {
				const syncSyncAdBlockingRecoveryTagssResponse = {
					success: true,
				};

				fetchMock.postOnce(
					new RegExp(
						'^/google-site-kit/v1/modules/adsense/data/sync-ad-blocking-recovery-tags'
					),
					{
						body: syncSyncAdBlockingRecoveryTagssResponse,
						status: 200,
					}
				);

				const { response, error } = await registry
					.dispatch( MODULES_ADSENSE )
					.syncAdBlockingRecoveryTags();

				expect( error ).toEqual( undefined );
				expect( response ).toEqual(
					syncSyncAdBlockingRecoveryTagssResponse
				);
			} );
		} );
	} );
} );
