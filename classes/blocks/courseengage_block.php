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

defined('MOODLE_INTERNAL') || die();

use stdClass;
use core_user;
use context_course;
use html_writer;
use html_table;
use html_table_cell;
use html_table_row;
use moodle_url;

/**
 * Class Course Engagement Block
 * To get the data related to course engagement block
 */
class courseengage_block extends utility {
    /** Get data for course engagement block
     * @return [object] Information about the course engage
     * block
     */
    public static function get_data($cohortid) {
        $response = new stdClass();
        $response->data = self::get_courseengage($cohortid);

        return $response;
    }

    /**
     * Get Course Engagement Data
     * @return [array] Array of course engagement
     */
    public static function get_courseengage($cohortid) {
        global $DB;

        $engagedata = array();
        $courses = self::get_courses(true);
        $params = array();
        // Create reporting manager instance.
        $rpm = reporting_manager::get_instance();
        $sqlcohort = "";
        $cohortjoin = '';
        $cohortcondition = '';
        if ($cohortid) {
            $cohortjoin = 'JOIN {cohort_members} cm ON cm.userid = u.id';
            $cohortcondition = 'AND cm.cohortid = :cohortid';
            $params["cohortid"] = $cohortid;
        }
        $completionsql = "SELECT c.courseid, COUNT(c.userid) AS usercount,
            c.progress as completion
            FROM {edw_course_progress} c
            JOIN {user} u ON u.id = c.userid "
            . $cohortjoin .
            " WHERE c.progress
            BETWEEN :completionstart
            AND :completionend
            AND u.deleted = 0 "
            . $cohortcondition .
            " GROUP BY c.courseid";
        // Calculate atleast completed one modules.
        $completionmodulesql = "SELECT c.courseid, COUNT(c.userid) AS usercount
            FROM {edw_course_progress} c
            JOIN {user} u ON u.id = c.userid "
            . $cohortjoin .
            " WHERE (LENGTH(completedmodules) -
                    LENGTH(REPLACE(completedmodules, ',', '')) + 1
                    ) >= :completedactivities
            AND u.deleted = 0 "
            . $cohortcondition .
            " GROUP BY c.courseid";

        // Calculate 50% Completion Count for Courses.
        $params["completionstart"] = 50.00;
        $params["completionend"] = 99.99;
        $params = array_merge($params, $rpm->inparams);
        $completion50 = $DB->get_records_sql($completionsql, $params);

        // Calculate 100% Completion Count for Courses.
        $params["completionstart"] = 100.00;
        $params["completionend"] = 100.00;
        $params = array_merge($params, $rpm->inparams);
        $completion100 = $DB->get_records_sql($completionsql, $params);

        $params ["completedactivities"] = 1;
        $params = array_merge($params, $rpm->inparams);
        $completiononemodule = $DB->get_records_sql($completionmodulesql, $params);
        foreach ($courses as $course) {
            $values = array(
                "completed50" => 0,
                "completed100" => 0,
                "completiononemodule" => 0
            );

            if (isset($completion50[$course->id])) {
                $values["completed50"] = $completion50[$course->id]->usercount;
            }

            if (isset($completion100[$course->id])) {
                $values["completed100"] = $completion100[$course->id]->usercount;
            }

            if (isset($completiononemodule[$course->id])) {
                $values["completiononemodule"] = $completiononemodule[$course->id]->usercount;
            }
            $courseenageresp = self::get_engagement($course, $cohortid, $values);
            if ($courseenageresp) {
                $engagedata[] = $courseenageresp;
            }
        }
        return $engagedata;
    }

    /**
     * Get Course Engagement for a course
     * @param [int] $courseid Courese ID to get course engagement
     * @return [object]
     */
    public static function get_engagement($course, $cohortid, $values) {
        global $CFG, $DB;

        // Create engagement object.
        $engagement = new stdClass();

        // Get only enrolled students.
        $enrolledstudents = \report_elucidsitereport\utility::get_enrolled_students($course->id);
        /* If cohort filter is there then select only cohort users */
        if ($cohortid) {
            foreach ($enrolledstudents as $key => $user) {
                $cohorts = cohort_get_user_cohorts($user->id);
                if (!array_key_exists($cohortid, $cohorts)) {
                    unset($enrolledstudents[$key]);
                }
            }
        }

        // Generate course url.
        $courseurl = new moodle_url($CFG->wwwroot . "/course/view.php", array("id" => $course->id));

        // Get course name with course url.
        $engagement->coursename = html_writer::link(
            $courseurl,
            $course->fullname,
            array(
                "class" => "text-dark text-decoration-none"
            )
        );

        // Generate enrolments link.
        $engagement->enrolment = self::get_course_engagement_link(
            "enrolment",
            $course,
            count($enrolledstudents)
        );

        // Generate visits link.
        $engagement->visited = self::get_course_engagement_link(
            "visited",
            $course,
            count(self::get_course_visites($course->id, $cohortid))
        );

        // Generate activity started link.
        $engagement->activitystart = self::get_course_engagement_link(
            "activitystart",
            $course,
            $values["completiononemodule"]
        );

        // Generate completed 50% of course link.
        $engagement->completedhalf = self::get_course_engagement_link(
            "completedhalf",
            $course,
            $values["completed50"]
        );

        // Generate course completion link.
        $engagement->coursecompleted = self::get_course_engagement_link(
            "coursecompleted",
            $course,
            $values["completed100"]
        );

        // Return engagement object.
        return $engagement;
    }

    /**
     * Get Engagement Attributes
     * @param [object] $course Course Object
     * @param [object] $user Users List
     */
    public static function get_course_engagement_link($attrname, $course, $val) {
        return html_writer::link("javascript:void(0)", $val,
            array(
                "class" => "modal-trigger text-dark text-decoration-none",
                "data-courseid" => $course->id,
                "data-coursename" => $course->fullname,
                "data-action" => $attrname
            )
        );
    }

    /**
     * Get HTML table for userslist
     * @param [int] $courseid Course Id
     * @param [string] $action Action for users list
     * @return [string] HTML table of users list
     */
    public static function get_userslist_table($courseid, $action, $cohortid) {
        $table = new html_table();
        $table->attributes = array (
            "class" => "modal-table",
            "style" => "min-width: 100%;",
        );

        // Get userslist to display.
        $data = self::get_userslist($courseid, $action, $cohortid);

        $table->head = $data->head;
        if (!empty($data->data)) {
            $table->data = $data->data;
        }
        return html_writer::table($table);
    }

    /**
     * Get Users list
     * @param [int] $courseid Course ID
     * @param [string] $action Action to get Users Data
     * @return [array] Users Data Array
     */
    public static function get_userslist($courseid, $action, $cohortid) {
        $course = get_course($courseid);

        switch($action) {
            case "enrolment":
                $usersdata = self::get_enrolled_users($course, $cohortid);
                ;
                break;
            case "visited":
                $usersdata = self::get_visited_users($course, $cohortid);
                ;
                break;
            case "activitystart":
                $usersdata = self::get_users_started_an_activity($course, $cohortid);
                break;
            case "completedhalf":
                $usersdata = self::get_users_completed_half_courses($course, $cohortid);
                break;
            case "coursecompleted":
                $usersdata = self::get_users_completed_courses($course, $cohortid);
                break;
        }
        return $usersdata;
    }

    /**
     * Get Enrolled users in a course
     * @param [object] $course Course Object
     * @return [array] Array of users list
     */
    public static function get_enrolled_users($course, $cohortid) {
        $coursecontext = context_course::instance($course->id);
        $users = course_progress_block::rep_get_enrolled_users($coursecontext, 'moodle/course:isincompletionreports');

        $usersdata = new stdClass();
        $usresdata->head = array(
            get_string("name", "report_elucidsitereport"),
            get_string("email", "report_elucidsitereport")
        );

        $userdata->data = array();
        foreach ($users as $user) {
            /* If cohort filter is there then get only users from cohort */
            if ($cohortid) {
                $cohorts = cohort_get_user_cohorts($user->id);
                if (!array_key_exists($cohortid, $cohorts)) {
                    continue;
                }
            }

            $usresdata->data[] = array(
                fullname($user),
                $user->email,
            );
        }
        return $usresdata;
    }

    /**
     * Get Visited users in a course
     * @param [object] $course Course Object
     * @param [object] $cohortid Cohort Id
     * @return [array] Array of users list
     */
    public static function get_visited_users($course, $cohortid) {
        $users = self::get_course_visites($course->id, $cohortid);
        $usersdata = new stdClass();
        $userdata->head = array(
            get_string("name", "report_elucidsitereport"),
            get_string("email", "report_elucidsitereport")
        );

        $userdata->data = array();
        foreach ($users as $user) {
            /* If cohort filter is there then get only users from cohort */
            if ($cohortid) {
                $cohorts = cohort_get_user_cohorts($user->id);
                if (!array_key_exists($cohortid, $cohorts)) {
                    continue;
                }
            }

            $user = core_user::get_user($user->userid);
            $userdata->data[] = array(
                fullname($user),
                $user->email,
            );
        }
        return $userdata;
    }

    /**
     * Get users who have completed an activity
     * @param [object] $course Course Object
     * @return [array] Array of users list
     */
    public static function get_users_started_an_activity($course, $cohortid) {
        $coursecontext = context_course::instance($course->id);
        $enrolledusers = course_progress_block::rep_get_enrolled_users($coursecontext, 'moodle/course:isincompletionreports');
        $users = self::users_completed_a_module($course, $enrolledusers, $cohortid);
        $usersdata = new stdClass();
        $userdata->head = array(
            get_string("name", "report_elucidsitereport"),
            get_string("email", "report_elucidsitereport")
        );

        $userdata->data = array();
        foreach ($users as $user) {
            /* If cohort filter is there then get only users from cohort */
            if ($cohortid) {
                $cohorts = cohort_get_user_cohorts($user->id);
                if (!array_key_exists($cohortid, $cohorts)) {
                    continue;
                }
            }

            $userdata->data[] = array(
                fullname($user),
                $user->email,
            );
        }
        return $userdata;
    }

    /**
     * Get users who have completed half of the course
     * @param [object] $course Course Object
     * @return [array] Array of users list
     */
    public static function get_users_completed_half_courses($course, $cohortid) {
        $coursecontext = context_course::instance($course->id);
        $enrolledusers = course_progress_block::rep_get_enrolled_users($coursecontext, 'moodle/course:isincompletionreports');
        $users = self::users_completed_half_modules($course, $enrolledusers, $cohortid);

        $usersdata = new stdClass();
        $userdata->head = array(
            get_string("name", "report_elucidsitereport"),
            get_string("email", "report_elucidsitereport")
        );

        $userdata->data = array();
        foreach ($users as $user) {
            /* If cohort filter is there then get only users from cohort */
            if ($cohortid) {
                $cohorts = cohort_get_user_cohorts($user->id);
                if (!array_key_exists($cohortid, $cohorts)) {
                    continue;
                }
            }

            $userdata->data[] = array(
                fullname($user),
                $user->email,
            );
        }
        return $userdata;
    }

    /**
     * Get users who have completed the course
     * @param [object] $course Course Object
     * @return [array] Array of users list
     */
    public static function get_users_completed_courses($course, $cohortid) {
        $coursecontext = context_course::instance($course->id);
        $enrolledusers = course_progress_block::rep_get_enrolled_users($coursecontext, 'moodle/course:isincompletionreports');
        $users = self::users_completed_all_module($course, $enrolledusers, $cohortid);

        $usersdata = new stdClass();
        $userdata->head = array(
            get_string("name", "report_elucidsitereport"),
            get_string("email", "report_elucidsitereport")
        );

        $userdata->data = array();
        foreach ($users as $user) {
            /* If cohort filter is there then get only users from cohort */
            if ($cohortid) {
                $cohorts = cohort_get_user_cohorts($user->id);
                if (!array_key_exists($cohortid, $cohorts)) {
                    continue;
                }
            }

            $userdata->data[] = array(
                fullname($user),
                $user->email,
            );
        }
        return $userdata;
    }



    /**
     * Get Header for report
     * @return [type] [description]
     */
    public static function get_header_report() {
        $header = array(
            get_string("coursename", "report_elucidsitereport"),
            get_string("enrolments", "report_elucidsitereport"),
            get_string("visits", "report_elucidsitereport"),
            get_string("activitystart", "report_elucidsitereport"),
            get_string("completedhalf", "report_elucidsitereport"),
            get_string("coursecompleted", "report_elucidsitereport")
        );
        return $header;
    }

    /**
     * Get Exportable data for Course Engage Page
     * @param $filter [string] Filter to get data from specific range
     * @return [array] Array of exportable data
     */
    public static function get_exportable_data_report() {
        $cohortid = optional_param("cohortid", 0, PARAM_INT);
        $export[] = self::get_header_report();

        $data = self::get_courseengage($cohortid);
        foreach ($data as $key => $val) {
            $row = array();
            foreach ($val as $k => $v) {
                $row[] = strip_tags($v);
            }
            $export[] = $row;
        }
        return $export;
    }
}
