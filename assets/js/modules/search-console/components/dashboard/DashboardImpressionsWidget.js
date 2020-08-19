/**
 * DashboardAllTrafficWidget component.
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
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { STORE_NAME as CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import whenActive from '../../../../util/when-active';
import ErrorText from '../../../../components/error-text';
import DataBlock from '../../../../components/data-block';
import { extractSearchConsoleDashboardData } from '../../util';
import Sparkline from '../../../../components/sparkline';
import PreviewBlock from '../../../../components/preview-block';
import { extractForSparkline, getSiteKitAdminURL } from '../../../../util';
const { useSelect } = Data;

function DashboardImpressionsWidget() {
	const { data, error } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		const args = {
			dimensions: 'date',
			compareDateRanges: true,
			dateRange: select( CORE_USER ).getDateRange(),
		};

		const url = select( CORE_SITE ).getCurrentEntityURL();
		if ( url ) {
			args.url = url;
		}

		return {
			data: store.getReport( args ),
			error: store.getErrorForSelector( 'getReport', [ args ] ),
		};
	} );

	if ( error ) {
		return (
			<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
				<ErrorText message={ error.message } />
			</div>
		);
	}

	if ( ! data ) {
		return <PreviewBlock width="100%" height="202px" />;
	}

	const href = getSiteKitAdminURL( 'googlesitekit-module-search-console', {} );
	const { totalImpressions, totalImpressionsChange, dataMap } = extractSearchConsoleDashboardData( data );

	return (
		<div className="mdc-layout-grid__cell mdc-layout-grid__cell--align-bottom mdc-layout-grid__cell--span-2-phone mdc-layout-grid__cell--span-2-tablet mdc-layout-grid__cell--span-3-desktop">
			<DataBlock
				className="overview-total-impressions"
				title={ __( 'Impressions', 'google-site-kit' ) }
				datapoint={ totalImpressions }
				change={ totalImpressionsChange }
				changeDataUnit="%"
				source={ {
					name: _x( 'Search Console', 'Service name', 'google-site-kit' ),
					link: href,
				} }
				sparkline={
					<Sparkline
						data={ extractForSparkline( dataMap, 2 ) }
						change={ totalImpressionsChange }
					/>
				}
			/>
		</div>
	);
}

export default whenActive( { moduleName: 'search-console' } )( DashboardImpressionsWidget );
