/**
 * AdBlockingRecoveryCTA component tests.
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
import AdBlockingRecoveryCTA from './AdBlockingRecoveryCTA';
import { render, provideModules } from '../../../../../../tests/js/test-utils';
import {
	AD_BLOCKING_RECOVERY_SETUP_STATUS_SETUP_CONFIRMED,
	MODULES_ADSENSE,
} from '../../datastore/constants';
import {
	ACCOUNT_STATUS_PENDING,
	ACCOUNT_STATUS_READY,
	SITE_STATUS_ADDED,
	SITE_STATUS_READY,
} from '../../util';

describe( 'AdBlockingRecoveryCTA', () => {
	it.each( [
		[
			'the Ad blocker detection feature flag is not enabled',
			ACCOUNT_STATUS_PENDING,
			SITE_STATUS_READY,
			'',
			false,
		],
		[
			'Adsense account status is not ready',
			ACCOUNT_STATUS_PENDING,
			SITE_STATUS_READY,
			'',
			true,
		],
		[
			'Adsense site status is not ready',
			ACCOUNT_STATUS_READY,
			SITE_STATUS_ADDED,
			'',
			true,
		],
		[
			'Ad blocking recovery status is not an empty string',
			ACCOUNT_STATUS_READY,
			SITE_STATUS_ADDED,
			AD_BLOCKING_RECOVERY_SETUP_STATUS_SETUP_CONFIRMED,
			true,
		],
	] )(
		'should not render the CTA when %s',
		(
			testName,
			accountStatus,
			siteStatus,
			adBlockingRecoverySetupStatus,
			adBlockerDetectionEnabled
		) => {
			const { container } = render( <AdBlockingRecoveryCTA />, {
				features: [].concat(
					adBlockerDetectionEnabled ? 'adBlockerDetection' : []
				),
				setupRegistry: ( registry ) => {
					provideModules( registry, [
						{
							slug: 'adsense',
							active: true,
							connected: true,
						},
					] );
					registry.dispatch( MODULES_ADSENSE ).receiveGetSettings( {
						accountStatus,
						siteStatus,
						adBlockingRecoverySetupStatus,
					} );
				},
			} );

			expect(
				container.querySelector(
					'.googlesitekit-settings-notice-ad-blocking-recovery-cta'
				)
			).toBeNull();

			expect( container.textContent ).not.toContain(
				'Ad blocking recovery'
			);
		}
	);

	it( 'should render the CTA when Ad Blocking Recovery is not set up', () => {
		const { container } = render( <AdBlockingRecoveryCTA />, {
			features: [ 'adBlockerDetection' ],
			setupRegistry: ( registry ) => {
				provideModules( registry, [
					{
						slug: 'adsense',
						active: true,
						connected: true,
					},
				] );
				registry.dispatch( MODULES_ADSENSE ).receiveGetSettings( {
					accountStatus: ACCOUNT_STATUS_READY,
					siteStatus: SITE_STATUS_READY,
					adBlockingRecoverySetupStatus: '',
				} );
			},
		} );

		expect(
			container.querySelector(
				'.googlesitekit-settings-notice-ad-blocking-recovery-cta'
			)
		).not.toBeNull();

		expect( container.textContent ).toContain( 'Ad blocking recovery' );
		expect( container.textContent ).toContain(
			'Start recovering revenue lost from ad blockers by deploying the ad blocking tag through Site Kit.'
		);
	} );
} );
