define([
    'jquery',
    'core/templates',
    'core/fragment',
    'core/modal_factory',
    'core/modal_events',
    'core/str',
    'report_elucidsitereport/variables',
    'report_elucidsitereport/common'
], function(
    $,
    Templates,
    Fragment,
    ModalFactory,
    ModalEvents,
    str,
    V
) {
    function init(CONTEXTID) {
        var PageId = "#wdm-lpstats-individual";
        var LpSelect = "#wdm-lp-select";
        var LpTable = PageId + " .table";
        var loader = PageId + " .loader";
        var filterSection = $("#wdm-userfilter .row .col-md-6:first-child");
        var LpDropdown = $(PageId).find("#wdm-lp-dropdown");
        var Table = null;

        /**
         * Learning program export detailed report button
         * @type {[type]}
         */
        var lpExportDetail = $("#wdm-export-detail-lpsreports");
        var lpListModal = null;

        /**
         * Plugin Component
         * @type {String}
         */
        var component = 'report_elucidsitereport';

        /**
         * Get translation to use strings
         * @type {object}
         */
        var translation = str.get_strings([
            {key: 'lpdetailedreport', component: component}
        ]);

        // Varibales for cohort filter
        var cohortId = 0;

        $(document).ready(function() {
            filterSection.html(LpDropdown.html());
            $(document).find(LpSelect).select2();
            $(document).find(LpSelect).show();
            LpDropdown.remove();

            var lpid = $(document).find(LpSelect).val();
            addLpStatsTable(lpid, cohortId);

            /* Select cohort filter for active users block */
            $(V.cohortFilterItem).on('click', function() {
                cohortId = $(this).data('cohortid');
                $(V.cohortFilterBtn).html($(this).text());
                V.changeExportUrl(cohortId, V.exportUrlLink, V.cohortReplaceFlag);
                addLpStatsTable(lpid, cohortId);
            });

            $(document).find(LpSelect).on("change", function() {
                $(LpTable).hide();
                $(loader).show();

                lpid = $(document).find(LpSelect).val();
                V.changeExportUrl(lpid, V.exportUrlLink, V.filterReplaceFlag);
                addLpStatsTable(lpid, cohortId);
            });

            /* Export Detailed Report */
            lpExportDetail.on('click', function() {
                exportDetailedReport(lpExportDetail);
            })
        });

        /**
         * Export Detailed Report
         */
        function exportDetailedReport(trigger) {
            // If modal already exist then show modal
            if (lpListModal) {
                lpListModal.show();
            } else {
                // When translation is redy then create modal
                translation.then(function() {
                    // Create Learning Program Modal
                    ModalFactory.create({
                        title : M.util.get_string(
                            'lpdetailedreport', component
                        )
                    }, trigger).done(function(modal) {
                        // Get modal root
                        var root = modal.getRoot();
                        
                        // Set global Modal
                        lpListModal = modal;
                        root.on(ModalEvents.cancel, function() {
                            modal.hide();
                        });

                        // Set Modal Body
                        modal.setBody(Templates.render(
                            'report_elucidsitereport/lpdetailedreport', {
                                sesskey : $(PageId).data('sesskey'),
                                formaction : M.cfg.wwwroot + "/report/elucidsitereport/download.php" 
                            }
                        ));

                        // Show learning program modal
                        modal.show();
                    });
                });
            }
        }

        /**
         * Add Lp stats table in learning program page
         * @param {int} lpid     Learning Program ID
         * @param {int} cohortId Cohort ID
         */
        function addLpStatsTable(lpid, cohortId) {
            if (Table) {
                Table.destroy();
                $(LpTable).hide();
                $(loader).show();
            }

            var fragment = Fragment.loadFragment(
                'report_elucidsitereport',
                'lpstats',
                CONTEXTID,
                {
                    lpid : lpid,
                    cohortid : cohortId
                }
            );

            fragment.done(function(response) {
                var context = JSON.parse(response);
                Templates.render('report_elucidsitereport/lpstatsinfo', context)
                .then(function(html, js) {
                    Templates.replaceNode(LpTable, html, js);
                }).fail(function(ex) {
                    console.log(ex);
                }).always(function() {
                    $(LpTable).show();
                    Table = $(LpTable).DataTable({
                        dom : "<'pull-left'f><t><p>",
                        oLanguage : {
                            sEmptyTable : "No Users are enrolled in any Learning Programs"
                        },
                        responsive : true
                    });
                    $(loader).hide();
                });
            });
        }
    }

    return {
        init : init
    };
	
});