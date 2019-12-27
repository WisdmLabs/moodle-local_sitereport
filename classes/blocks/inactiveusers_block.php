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
 * Plugin administration pages are defined here.
 *
 * @package     report_elucidsitereport
 * @category    admin
 * @copyright   2019 wisdmlabs <support@wisdmlabs.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace report_elucidsitereport;

use stdClass;
use cache;

require_once($CFG->dirroot . "/report/elucidsitereport/classes/constants.php");
require_once($CFG->dirroot . "/report/elucidsitereport/classes/reporting_manager.php");
/**
 * Class Inacive Users Block
 * To get the data related to inactive users block
 */
class inactiveusers_block extends utility {
    // is user reporting manager
    public static $isrpm = false;
    // reporting manager class object
    public static $rpm = null;
    // reporting manager students
    public static $rpmusers = array();
    /**
     * Get Inactive users data
     * @param  [String] $filter Filter
     * @return [object] response object
     */
    public static function get_data($filter) {
        // Make cache for inactive users block
        $cache = cache::make("report_elucidsitereport", "courseprogress");
        self::$rpm = new reporting_manager();
        // Check current user is reporting manager or not
        self::$isrpm = self::$rpm->check_user_is_reporting_manager();
        // if user is reporting manager then get his students
        if (self::$isrpm) {
            self::$rpmusers = self::$rpm->get_repoting_manager_students();
            $cachekey = "inactiveusers-" . $filter . "_".self::$rpm->userid;
        } else {
            $cachekey = "inactiveusers-" . $filter;
        }

        // If cache not set for course progress
        if (!$response = $cache->get($cachekey)) {
            $response = new stdClass();

            // Get response data
            $response->data = self::get_inactiveusers($filter);

            // Set cache to get data for course progress
            $cache->set($cachekey, $response);
        }

        // Return response
        return $response;
    }

    /**
     * Get inactive users list
     * @param  [String] $filter Filter
     * @return [Array] Array of inactive users
     */
    public static function get_inactiveusers($filter = 'all', $isCsv = false) {
        global $DB;

        // Get current time
        $timenow = time();

        // Get last login time using filter
        switch ($filter) {
            case '1month':
                $lastlogin = $timenow - 1 * ONEMONTH;
                break;
            case '3month':
                $lastlogin = $timenow - 3 * ONEMONTH;
                break;
            case '6month':
                $lastlogin = $timenow - 6 * ONEMONTH;
                break;
            default:
                $lastlogin = 0;
        }
        $inparams = array();
        if (self::$isrpm) {
            // get reporting manager students in "IN" for SQL
            list($insql, $inparams) = $DB->get_in_or_equal(self::$rpmusers, SQL_PARAMS_NAMED, 'param', true);
            // Query to get users who have not logged in from reporting manager students
            $sql = "SELECT * FROM {user} WHERE lastlogin <= :lastlogin
                AND deleted = 0 AND id ".$insql;
        } else {
            // Query to get users who have not logged in
            $sql = "SELECT * FROM {user} WHERE lastlogin <= :lastlogin
                    AND deleted = 0 AND id > 1";
        }
        $inparams['lastlogin'] = $lastlogin;
        // Get all users who are inactive
        $users = $DB->get_records_sql($sql, $inparams);

        // Geenerate Inactive users return array
        $inactiveusers = array();
        foreach ($users as $user) {
            $inactiveuser = array(
                "name" => fullname($user),
                "email" => $user->email
            );

            // If downloading the reports
            if (!$isCsv) {
                $inactiveuser["lastlogin"] = '<div class="d-none">'.$user->lastlogin.'</div>';
            } else {
                $inactiveuser["lastlogin"] = '';
            }

            // Get last login by users
            if ($user->lastlogin) {
                $inactiveuser["lastlogin"] .= format_time($timenow - $user->lastlogin);
            } else {
                $inactiveuser["lastlogin"] .= get_string('never');
            }

            // Put inactive users in inactive users table
            $inactiveusers[] = array_values($inactiveuser);
        }

        // Return inactive users array
        return $inactiveusers;
    }

    /**
     * Get headers for exportable data
     * @return [type] [description]
     */
    private static function get_headers() {
        return array(
            get_string('fullname', 'report_elucidsitereport'),
            get_string('email', 'report_elucidsitereport'),
            get_string('lastaccess', 'report_elucidsitereport')
        );
    }

    /**
     * Get exportable data for inactive users
     * @return [type] [description]
     */
    public static function get_exportable_data_block($filter) {
        // Prepare inactive users data
        $inactiveusers = array();
        $inactiveusers[] = self::get_headers();
        $inactiveusers = array_merge($inactiveusers, self::get_inactiveusers($filter, true));

        // Return all inactive users
        return $inactiveusers;
    }
}