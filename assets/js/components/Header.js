/**
 * Header component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useMutationObserver } from 'react-use-observer';
import { useHistory } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Logo from './Logo';
import UserMenu from './UserMenu';
import ErrorNotifications from './notifications/ErrorNotifications';
import { CORE_USER } from '../googlesitekit/datastore/user/constants';
import { Grid, Row, Cell } from '../material-components';
import DashboardNavigation from './DashboardNavigation';
import EntityHeader from './EntityHeader';
import ViewOnlyMenu from './ViewOnlyMenu';
import { useFeature } from '../hooks/useFeature';
import useViewOnly from '../hooks/useViewOnly';
import useDashboardType from '../hooks/useDashboardType';
import SettingsSvg from '../../svg/icons/cog.svg';
import Button from '../googlesitekit/components-gm2/Button';
import Link from './Link';
const { useSelect } = Data;

const Header = ( { children, subHeader, showNavigation } ) => {
	const dashboardSharingEnabled = useFeature( 'dashboardSharing' );
	const isDashboard = !! useDashboardType();
	const isViewOnly = useViewOnly();
	const history = useHistory();

	const isAuthenticated = useSelect( ( select ) =>
		select( CORE_USER ).isAuthenticated()
	);
	const [ subHeaderRef, subHeaderMutation ] = useMutationObserver( {
		childList: true,
	} );
	const hasSubheader = !! subHeaderMutation.target?.childElementCount;

	return (
		<Fragment>
			<header
				className={ classnames( 'googlesitekit-header', {
					'googlesitekit-header--has-subheader': hasSubheader,
					'googlesitekit-header--has-navigation': showNavigation,
				} ) }
			>
				<Grid>
					<Row>
						<Cell
							smSize={ 1 }
							mdSize={ 2 }
							lgSize={ 4 }
							className="googlesitekit-header__logo"
							alignMiddle
						>
							<Link
								aria-label={ __(
									'Go to dashboard',
									'google-site-kit'
								) }
								className="googlesitekit-header__logo-link"
								to="/dashboard"
							>
								<Logo />
							</Link>
						</Cell>
						<Cell
							smSize={ 3 }
							mdSize={ 6 }
							lgSize={ 8 }
							className="googlesitekit-header__children"
							alignMiddle
						>
							{ children }

							{ isAuthenticated && (
								<Button
									className="googlesitekit-header__button googlesitekit-border-radius-round googlesitekit-button-icon googlesitekit-border-radius-round googlesitekit-button-icon"
									onClick={ () =>
										history.push( '/settings' )
									}
									aria-label={ __(
										'Settings',
										'google-site-kit'
									) }
									icon={
										<SettingsSvg width="24" height="24" />
									}
								/>
							) }

							{ ! isAuthenticated &&
								dashboardSharingEnabled &&
								isDashboard &&
								isViewOnly && <ViewOnlyMenu /> }
							{ isAuthenticated &&
								( ! dashboardSharingEnabled ||
									! isViewOnly ) && <UserMenu /> }
						</Cell>
					</Row>
				</Grid>
			</header>

			<div className="googlesitekit-subheader" ref={ subHeaderRef }>
				{ subHeader }
			</div>

			{ showNavigation && <DashboardNavigation /> }

			<EntityHeader />

			<ErrorNotifications />
		</Fragment>
	);
};

Header.displayName = 'Header';

Header.propTypes = {
	children: PropTypes.node,
	subHeader: PropTypes.element,
	showNavigation: PropTypes.bool,
};

Header.defaultProps = {
	children: null,
	subHeader: null,
};

export default Header;
