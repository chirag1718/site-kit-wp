/**
 * Legacy Account Creation component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
 * WordPress dependencies
 */
import { Fragment, useCallback, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Button from '../../../../components/Button';
import Link from '../../../../components/Link';
import ProgressBar from '../../../../components/ProgressBar';
import { trackEvent } from '../../../../util';
import { MODULES_ANALYTICS, ACCOUNT_CREATE } from '../../datastore/constants';
import StoreErrorNotices from '../../../../components/StoreErrorNotices';
import GA4Notice from './GA4Notice';
import ViewContextContext from '../../../../components/Root/ViewContextContext';
const { useInViewSelect, useDispatch } = Data;

export default function AccountCreateLegacy() {
	const { accounts, hasResolvedAccounts } = useInViewSelect( ( select ) => ( {
		accounts: select( MODULES_ANALYTICS ).getAccounts(),
		hasResolvedAccounts: select( MODULES_ANALYTICS ).hasFinishedResolution(
			'getAccounts'
		),
	} ) );
	const accountID = useInViewSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getAccountID()
	);
	const isCreateAccount = ACCOUNT_CREATE === accountID;
	const createAccountURL = useInViewSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getServiceURL( {
			path: '/provision/SignUp',
		} )
	);
	const viewContext = useContext( ViewContextContext );

	const createAccountHandler = useCallback(
		async ( event ) => {
			event.preventDefault();
			await trackEvent(
				`${ viewContext }_analytics`,
				'create_account',
				'custom-oauth'
			);
			global.open( createAccountURL, '_blank' );
		},
		[ createAccountURL, viewContext ]
	);

	const { resetAccounts } = useDispatch( MODULES_ANALYTICS );
	const refetchAccountsHandler = useCallback( () => {
		resetAccounts();
	}, [ resetAccounts ] );

	if ( ! hasResolvedAccounts ) {
		return <ProgressBar />;
	}

	return (
		<div>
			<GA4Notice />
			<StoreErrorNotices
				moduleSlug="analytics"
				storeName={ MODULES_ANALYTICS }
			/>

			{ ! isCreateAccount && accounts && accounts.length === 0 && (
				<p>
					{ __(
						'Looks like you don\'t have an Analytics account yet. Once you create it, click on "Re-fetch my account" and Site Kit will locate it.',
						'google-site-kit'
					) }
				</p>
			) }

			{ isCreateAccount && (
				<Fragment>
					<p>
						{ __(
							'To create a new account, click the button below which will open the Google Analytics account creation screen in a new window.',
							'google-site-kit'
						) }
					</p>
					<p>
						{ __(
							'Once completed, click the link below to re-fetch your accounts to continue.',
							'google-site-kit'
						) }
					</p>
				</Fragment>
			) }

			<div className="googlesitekit-setup-module__action">
				<Button onClick={ createAccountHandler }>
					{ __( 'Create an account', 'google-site-kit' ) }
				</Button>

				<div className="googlesitekit-setup-module__sub-action">
					<Link onClick={ refetchAccountsHandler }>
						{ __( 'Re-fetch My Account', 'google-site-kit' ) }
					</Link>
				</div>
			</div>
		</div>
	);
}
