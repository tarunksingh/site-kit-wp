/**
 * AnalyticsAdminbarWidget component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
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
import { Component, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AnalyticsAdminbarWidgetOverview from './AnalyticsAdminbarWidgetOverview';
import AnalyticsInactiveCTA from '../../../../components/AnalyticsInactiveCTA';
import { getModulesData } from '../../../../util';

class AnalyticsAdminbarWidget extends Component {
	render() {
		if ( typeof global._googlesitekitLegacyData.permaLink !== typeof undefined && '' === global._googlesitekitLegacyData.permaLink ) {
			return null;
		}

		if ( ! getModulesData().analytics.active ) {
			return (
				<Fragment>
					<div className="
						mdc-layout-grid__cell
						mdc-layout-grid__cell--span-4-tablet
						mdc-layout-grid__cell--span-6-desktop
					">
						<AnalyticsInactiveCTA />
					</div>
				</Fragment>
			);
		}

		return (
			<AnalyticsAdminbarWidgetOverview />
		);
	}
}

export default AnalyticsAdminbarWidget;
