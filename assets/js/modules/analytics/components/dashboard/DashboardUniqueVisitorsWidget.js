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
import PreviewBlock from '../../../../components/PreviewBlock';
import DataBlock from '../../../../components/data-block';
import Sparkline from '../../../../components/Sparkline';
import AnalyticsInactiveCTA from '../../../../components/AnalyticsInactiveCTA';
import { changeToPercent, readableLargeNumber } from '../../../../util';
import getDataErrorComponent from '../../../../components/notifications/data-error';
import getNoDataComponent from '../../../../components/notifications/nodata';
import parseDimensionStringToDate from '../../util/parseDimensionStringToDate';
import applyEntityToReportPath from '../../util/applyEntityToReportPath';

const { useSelect } = Data;

function DashboardUniqueVisitorsWidget() {
	const {
		loading,
		error,
		sparkData,
		serviceURL,
		visitorsData,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );

		const accountID = store.getAccountID();
		const profileID = store.getProfileID();
		const internalWebPropertyID = store.getInternalWebPropertyID();
		const commonArgs = {
			dateRange: select( CORE_USER ).getDateRange(),
		};

		const url = select( CORE_SITE ).getCurrentEntityURL();
		if ( url ) {
			commonArgs.url = url;
		}
		const sparklineArgs = {
			dimensions: 'ga:date',
			metrics: [
				{
					expression: 'ga:users',
					alias: 'Users',
				},
			],
			...commonArgs,
		};

		// This request needs to be separate from the sparkline request because it would result in a different total if it included the ga:date dimension.
		const args = {
			multiDateRange: 1,
			metrics: [
				{
					expression: 'ga:users',
					alias: 'Total Users',
				},
			],
			...commonArgs,
		};

		return {
			loading: store.isResolving( 'getReport', [ sparklineArgs ] ) || store.isResolving( 'getReport', [ args ] ),
			error: store.getErrorForSelector( 'getReport', [ sparklineArgs ] ) || store.getErrorForSelector( 'getReport', [ args ] ),
			// Due to the nature of these queries, we need to run them separately.
			sparkData: store.getReport( sparklineArgs ),
			serviceURL: store.getServiceURL(
				{
					path: applyEntityToReportPath( url, `/report/visitors-overview/a${ accountID }w${ internalWebPropertyID }p${ profileID }/` ),
				}
			),
			visitorsData: store.getReport( args ),
		};
	} );

	if ( loading ) {
		return <PreviewBlock width="100%" height="202px" />;
	}

	if ( error ) {
		return getDataErrorComponent( 'analytics', error.message, false, false, false, error );
	}

	if ( ( ! sparkData || ! sparkData.length ) && ( ! visitorsData || ! visitorsData.length ) ) {
		return getNoDataComponent( _x( 'Analytics', 'Service name', 'google-site-kit' ) );
	}

	const sparkLineData = [
		[
			{ type: 'date', label: 'Day' },
			{ type: 'number', label: 'Bounce Rate' },
		],
	];
	const dataRows = sparkData[ 0 ].data.rows;

	// Loop the rows to build the chart data.
	for ( let i = 0; i < dataRows.length; i++ ) {
		const { values } = dataRows[ i ].metrics[ 0 ];
		const dateString = dataRows[ i ].dimensions[ 0 ];
		const date = parseDimensionStringToDate( dateString );
		sparkLineData.push( [
			date,
			values[ 0 ],
		] );
	}

	const { totals } = visitorsData[ 0 ].data;
	const totalUsers = totals[ 0 ].values;
	const previousTotalUsers = totals[ 1 ].values;
	const totalUsersChange = changeToPercent( previousTotalUsers, totalUsers );

	return (
		<DataBlock
			className="overview-total-users"
			title={ __( 'Unique Visitors', 'google-site-kit' ) }
			datapoint={ readableLargeNumber( totalUsers ) }
			change={ totalUsersChange }
			changeDataUnit="%"
			source={ {
				name: _x( 'Analytics', 'Service name', 'google-site-kit' ),
				link: serviceURL,
				external: true,
			} }
			sparkline={
				sparkLineData &&
					<Sparkline
						data={ sparkLineData }
						change={ totalUsersChange }
					/>
			}
		/>
	);
}

export default whenActive( {
	moduleName: 'analytics',
	fallbackComponent: AnalyticsInactiveCTA,
} )( DashboardUniqueVisitorsWidget );
