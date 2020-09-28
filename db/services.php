<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 * Reports ablock external services
 *
 * @package     local_sitereport
 * @copyright   2019 wisdmlabs <support@wisdmlabs.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$functions = array(
    'local_sitereport_complete_sitereport_installation' => array(
        'classname' => 'local_sitereport\external\api',
        'methodname' => 'complete_sitereport_installation',
        'classpath' => '',
        'description' => 'Complete sitereport plugin installation',
        'type' => 'write',
        'ajax' => true,
    ),
    'local_sitereport_get_plugin_config' => array(
        'classname' => 'local_sitereport\external\api',
        'methodname' => 'get_plugin_config',
        'classpath' => '',
        'description' => 'Get plugin config',
        'type' => 'write',
        'ajax' => true,
    )
);
