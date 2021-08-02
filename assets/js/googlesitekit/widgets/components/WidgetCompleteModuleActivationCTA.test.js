/**
 * WidgetCompleteModuleActivationCTA component tests.
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
 * Internal dependencies
 */
import {
	render,
	createTestRegistry,
	provideModules,
	provideUserCapabilities,
} from '../../../../../tests/js/test-utils';
import WidgetCompleteModuleActivationCTA from './WidgetCompleteModuleActivationCTA';
import { CORE_WIDGETS } from '../datastore/constants';
import CompleteModuleActivationCTA from '../../../components/CompleteModuleActivationCTA';

describe( 'WidgetCompleteModuleActivationCTA', () => {
	let registry;

	beforeAll( () => {
		registry = createTestRegistry();
		provideModules( registry );
		provideUserCapabilities( registry );
	} );

	it( 'sets widget state when rendered and unsets when unmounted', () => {
		const widgetSlug = 'testWidget';
		const moduleSlug = 'analytics';

		// Initial state should be null.
		expect(
			registry.select( CORE_WIDGETS ).getWidgetState( widgetSlug )
		).toBe( null );

		// Special state should be set upon render.
		const widget = render(
			<WidgetCompleteModuleActivationCTA
				widgetSlug={ widgetSlug }
				moduleSlug={ moduleSlug }
			/>,
			{ registry }
		);
		expect(
			registry.select( CORE_WIDGETS ).getWidgetState( widgetSlug )
		).toMatchObject( {
			Component: CompleteModuleActivationCTA,
			metadata: { moduleSlug },
		} );

		// Special state should be unset again upon unmount.
		widget.unmount();
		expect(
			registry.select( CORE_WIDGETS ).getWidgetState( widgetSlug )
		).toBe( null );
	} );

	it( 'only considers moduleSlug prop for widget state', () => {
		const widgetSlug = 'testWidget';
		const moduleSlug = 'analytics';

		// Pass extraProp (which should not be included in metadata).
		render(
			<WidgetCompleteModuleActivationCTA
				widgetSlug={ widgetSlug }
				moduleSlug={ moduleSlug }
				extraProp="propValue"
			/>,
			{ registry }
		);

		expect(
			registry.select( CORE_WIDGETS ).getWidgetState( widgetSlug )
		).toMatchObject( {
			Component: CompleteModuleActivationCTA,
			metadata: { moduleSlug },
		} );
	} );

	it( 'renders the same output as CompleteModuleActivationCTA with the same props (except widgetSlug)', () => {
		const props = {
			moduleSlug: 'analytics',
			description: 'Complete the module setup!',
		};

		// WidgetCompleteModuleActivationCTA wraps CompleteModuleActivationCTA, so the output must match.
		const widgetContainer = render(
			<WidgetCompleteModuleActivationCTA
				widgetSlug="testWidget"
				{ ...props }
			/>,
			{ registry }
		).container;
		const container = render(
			<CompleteModuleActivationCTA { ...props } />,
			{ registry }
		).container;

		expect( widgetContainer.innerHTML ).toEqual( container.innerHTML );
	} );
} );
