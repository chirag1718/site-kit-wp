/**
 * Tests for report utilities.
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
 * Internal dependencies.
 */
import { isZeroReport } from './is-zero-report';

describe( 'isZeroReport', () => {
	it.each( [
		[ 'undefined', undefined ],
		[ 'NULL', null ],
		[ 'FALSE', false ],
		[ 'a number', 1 ],
		[ 'a string', 'test' ],
		[ 'an empty object', {} ],
		[ 'an object without totals', { rows: [ [] ] } ],
		[ 'an object with invalid totals', { rows: [ [] ], totals: 11 } ],
		[ 'an object without rows', { totals: [ 1 ] } ],
		[ 'an object with invalid rows', { rows: 12, totals: [ 1 ] } ],
	] )( 'should return TRUE when %s is passed', ( _, report ) => {
		expect( isZeroReport( report ) ).toBe( true );
	} );

	it( 'should return FALSE when a valid object is passed', () => {
		const report = {
			totals: [ '1' ],
			rows: [ [] ],
		};

		expect( isZeroReport( report ) ).toBe( false );
	} );
} );
