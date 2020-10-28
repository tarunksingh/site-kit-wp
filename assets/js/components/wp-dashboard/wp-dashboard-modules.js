/**
 * WPDashboardModules component.
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
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getModulesData } from '../../util';
import AnalyticsInactiveCTA from '../AnalyticsInactiveCTA';
import WPDashboardModule from './wp-dashboard-module';
import WPDashboardHeader from './wp-dashboard-header';

class WPDashboardModules extends Component {
	render() {
		const modulesData = getModulesData();

		return (
			<Fragment>
				<div className={ classnames(
					'googlesitekit-wp-dashboard-stats',
					{ 'googlesitekit-wp-dashboard-stats--fourup': modulesData.analytics.active }
				) }>
					<WPDashboardHeader
						key={ 'googlesitekit-wp-dashboard-header' }
					/>
					{ // Show the Analytics CTA if analytics is not enabled.
						( ! modulesData.analytics.active ) &&
						<div className="googlesitekit-wp-dashboard-stats__cta">
							<AnalyticsInactiveCTA
								title={ __( 'See unique vistors, goal completions, top pages and more.', 'google-site-kit' ) }
								ctaLabel={ __( 'Set up analytics', 'google-site-kit' ) }
								description=""
							/>
						</div>
					}
				</div>
				<WPDashboardModule
					key={ 'googlesitekit-wp-dashboard-module' }
				/>
			</Fragment>
		);
	}
}

export default WPDashboardModules;
