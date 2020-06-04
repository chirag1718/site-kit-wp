/**
 * modules/tagmanager data store: versions tests.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
import { STORE_NAME } from './constants';
import {
	createTestRegistry,
	muteConsole,
	subscribeUntil,
	unsubscribeFromAll,
} from '../../../../../tests/js/utils';
import * as fixtures from './__fixtures__';

describe( 'modules/tagmanager versions', () => {
	let registry;

	// const defaultSettings = {
	// 	accountID: '',
	// 	ampContainerID: '',
	// 	containerID: '',
	// 	internalAMPContainerID: '',
	// 	internalContainerID: '',
	// 	useSnippet: true,
	// };

	beforeAll( () => {
		API.setUsingCache( false );
	} );

	beforeEach( () => {
		registry = createTestRegistry();
		// Preload default settings to prevent the resolver from making unexpected requests
		// as this is covered in settings store tests.
		// registry.dispatch( STORE_NAME ).receiveSettings( defaultSettings );
	} );

	afterAll( () => {
		API.setUsingCache( true );
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'actions', () => {

	} );

	describe( 'selectors', () => {
		describe( 'getLiveContainerVersion', () => {
			it( 'uses a resolver to make a network request', async () => {
				const {
					getLiveContainerVersion,
					hasFinishedResolution,
				} = registry.select( STORE_NAME );
				const accountID = fixtures.liveContainerVersion.accountId;
				const internalContainerID = fixtures.liveContainerVersion.containerId;

				fetch
					.doMockOnceIf( /^\/google-site-kit\/v1\/modules\/tagmanager\/data\/live-container-version/ )
					.mockResponseOnce(
						JSON.stringify( fixtures.liveContainerVersion ),
						{ status: 200 }
					);

				const initialContainerVersion = getLiveContainerVersion( accountID, internalContainerID );

				expect( initialContainerVersion ).toEqual( undefined );
				await subscribeUntil( registry,
					() => hasFinishedResolution( 'getLiveContainerVersion', [ accountID, internalContainerID ] )
				);

				const liveContainerVersion = getLiveContainerVersion( accountID, internalContainerID );
				expect( fetch ).toHaveBeenCalledTimes( 1 );
				expect( liveContainerVersion ).toEqual( fixtures.liveContainerVersion );
			} );

			it( 'does not make a network request if the container version is already present', async () => {
				const {
					getLiveContainerVersion,
					hasFinishedResolution,
				} = registry.select( STORE_NAME );
				const accountID = fixtures.liveContainerVersion.accountId;
				const internalContainerID = fixtures.liveContainerVersion.containerId;

				registry.dispatch( STORE_NAME ).receiveLiveContainerVersion( fixtures.liveContainerVersion, { accountID, internalContainerID } );

				const liveContainerVersion = getLiveContainerVersion( accountID, internalContainerID );
				await subscribeUntil( registry,
					() => hasFinishedResolution( 'getLiveContainerVersion', [ accountID, internalContainerID ] )
				);

				expect( liveContainerVersion ).toEqual( fixtures.liveContainerVersion );
				expect( fetch ).not.toHaveBeenCalled();
			} );

			it( 'dispatches an error if the request fails', async () => {
				const {
					getError,
					getLiveContainerVersion,
					hasFinishedResolution,
				} = registry.select( STORE_NAME );
				const accountID = fixtures.liveContainerVersion.accountId;
				const internalContainerID = fixtures.liveContainerVersion.containerId;

				const response = {
					code: 'internal_server_error',
					message: 'Internal server error',
					data: { status: 500 },
				};
				fetch
					.doMockOnceIf( /^\/google-site-kit\/v1\/modules\/tagmanager\/data\/live-container-version/ )
					.mockResponse(
						JSON.stringify( response ),
						{ status: 500 }
					);

				muteConsole( 'error' );
				getLiveContainerVersion( accountID, internalContainerID );
				await subscribeUntil( registry,
					() => hasFinishedResolution( 'getLiveContainerVersion', [ accountID, internalContainerID ] )
				);

				expect( fetch ).toHaveBeenCalledTimes( 1 );
				expect( getError() ).toEqual( response );
				expect( getLiveContainerVersion( accountID, internalContainerID ) ).toEqual( undefined );
			} );
		} );
	} );
} );
