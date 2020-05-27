<?php
/**
 * Class Google\Site_Kit\Core\Modules\Exception\Invalid_Datapoint_Exception
 *
 * @package   Google\Site_Kit\Core\Modules\Exception
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Modules\Exception;

use Exception;
use Google\Site_Kit\Core\Contracts\WP_Errorable;
use WP_Error;

/**
 * Exception thrown when a request to an invalid datapoint is made.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Invalid_Datapoint_Exception extends Exception implements WP_Errorable {

	const WP_ERROR_CODE = 'invalid_datapoint';

	/**
	 * Gets the WP_Error representation of this exception.
	 *
	 * @since n.e.x.t
	 *
	 * @return WP_Error
	 */
	public function to_wp_error() {
		return new WP_Error(
			static::WP_ERROR_CODE,
			$this->getMessage(),
			array(
				'status' => 400, // Bad request.
			)
		);
	}
}
