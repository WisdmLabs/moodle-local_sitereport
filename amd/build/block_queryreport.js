define(["jquery","report_elucidsitereport/defaultconfig","core/templates","report_elucidsitereport/select2"],(function(e,t,n){e(document).ready((function(){e("#ed_rpm").select2({multiple:!0,closeOnSelect:!1}),e("#ed_lps").select2({multiple:!0,closeOnSelect:!1}),e("#ed_courses").select2({multiple:!0,closeOnSelect:!1}),selectedLps=["0"],e("#ed_lps").on("change",(function(s){e("div[class^='lp']").show(),e("#ed_courses").html("");var o=[];if(e(s.currentTarget).find("option:selected").each((function(t,n){o[t]=e(n).val()})),JSON.stringify(selectedLps)!==JSON.stringify(o)){switch(oldIndex=selectedLps.indexOf("0"),newIndex=o.indexOf("0"),!0){case-1==oldIndex&&newIndex>-1:o=["0"],selectedLps=o,e("#ed_lps").select2("val",o);break;case oldIndex>-1&&newIndex>-1:o.splice(newIndex,1),selectedLps=o,e("#ed_lps").select2("val",o)}selectedLps=o,e.ajax({url:t.requestUrl,type:t.requestType,dataType:t.requestDataType,data:{action:"get_customqueryreport_data_ajax",sesskey:M.cfg.sesskey,data:JSON.stringify({lpids:o})}}).done((function(t){e("#ed_courses").html("");var s={courses:t};n.render("report_elucidsitereport/customquery_options",s).then((function(t,s){n.replaceNodeContents(e("#ed_courses"),t,s)}))})).fail((function(e){})),o.length||e("div[class^='lp']").hide()}})),selectedRPM=["0"],e("#ed_rpm").on("change",(function(s){e("div[class^='rpm']").show(),e("#ed_lps").html(""),e("#ed_courses").html("");var o=[];if(e(s.currentTarget).find("option:selected").each((function(t,n){o[t]=e(n).val()})),JSON.stringify(selectedRPM)!==JSON.stringify(o)){switch(oldIndex=selectedRPM.indexOf("0"),newIndex=o.indexOf("0"),!0){case-1==oldIndex&&newIndex>-1:o=["0"],selectedRPM=o,e("#ed_rpm").select2("val",o);break;case oldIndex>-1&&newIndex>-1:o.splice(newIndex,1),selectedRPM=o,e("#ed_rpm").select2("val",o)}selectedRPM=o,e.ajax({url:t.requestUrl,type:t.requestType,dataType:t.requestDataType,data:{action:"get_customqueryreport_rpm_data_ajax",sesskey:M.cfg.sesskey,data:JSON.stringify({rpmids:o})}}).done((function(t){e("#ed_lps").html(""),e("#ed_courses").html("");var s="report_elucidsitereport/customquery_lpoptions",o={lps:t.lps};if(t.lps.length>0&&n.render(s,o).then((function(t,s){n.appendNodeContents(e("#ed_lps"),t,s)})),t.courses.length>0){s="report_elucidsitereport/customquery_options",o={courses:t.courses};n.render(s,o).then((function(t,s){n.appendNodeContents(e("#ed_courses"),t,s)}))}})).fail((function(e){console.log(e)})),o.length||(e("div[class^='rpm']").hide(),e("div[class^='lp']").hide())}}));var s=["0"];e("#ed_courses").on("change",(function(t){var n=[];if(e(t.currentTarget).find("option:selected").each((function(t,s){n[t]=e(s).val()})),JSON.stringify(s)!==JSON.stringify(n)){switch(oldIndex=s.indexOf("0"),newIndex=n.indexOf("0"),!0){case-1==oldIndex&&newIndex>-1:s=n=["0"],e("#ed_courses").select2("val",n);break;case oldIndex>-1&&newIndex>-1:n.splice(newIndex,1),s=n,e("#ed_courses").select2("val",n)}s=n}}));var o=t.getPanel("#customQueryReportBlock");let c=e(o).find("#customQueryReportsForm");const l=function(t,n,s,c){e(o).find(t).flatpickr({mode:n,altInput:!0,altFormat:"d/m/Y",dateFormat:"Y-m-d",maxDate:c,defaultDate:s,onClose:i,onReady:i})},i=function(t,n,s){const o=t[0].getTime()/1e3;switch(!0){case e(s.element).is("#customqueryenrollstart"):c.find("input[name=enrolstartdate]").val(o);break;case e(s.element).is("#customqueryenrollend"):c.find("input[name=enrolenddate]").val(o);break;case e(s.element).is("#customquerycompletionstart"):c.find("input[name=completionstartdate]").val(o);break;case e(s.element).is("#customquerycompletionend"):c.find("input[name=completionenddate]").val(o)}};function d(t){const n=jQuery("#ed_courses > option:selected").length,s=c.serializeArray(),l={};var i;e.each(s,(function(e,t){l[t.name]=t.value})),n<1?(e(".coursealert").show(),setTimeout((function(){e(".coursealert").hide()}),3e3),t.preventDefault()):l.enrolstartdate>l.enrolenddate||""==l.enrolstartdate&&""!==l.enrolenddate||""!==l.enrolstartdate&&""==l.enrolenddate?(e(".enroldatealert").show(),setTimeout((function(){e(".enroldatealert").hide()}),3e3),t.preventDefault()):l.completionstartdate>l.completionenddate||""==l.completionstartdate&&""!==l.completionenddate||""!==l.completionstartdate&&""==l.completionenddate?(e(".completiondatealert").show(),setTimeout((function(){e(".completiondatealert").hide()}),3e3),t.preventDefault()):(i=[],e(o).find("input[type=checkbox]:checked").each((function(e,t){i.push(t.id)})),c.find("input[name=reporttype]").val("queryReport"),c.find("input[name=checkedFields]").val(i),function(){var t,n,s;t=e(o).find("#ed_rpm").val(),c.find("input[name=reportingmanagers]").val(t),n=e(o).find("#ed_lps").val(),c.find("input[name=lps]").val(n),s=e(o).find("#ed_courses").val(),c.find("input[name=courses]").val(s)}())}l("#customqueryenrollstart, #customquerycompletionstart","single",(new Date).setDate((new Date).getDate()-90),"today"),l("#customqueryenrollend, #customquerycompletionend","single","today","today"),e(document).on("click","#customqueryenrollstart ~ button.input-search-close",(function(){e("#customqueryenrollstart ~ input.form-control").val(""),c.find("input[name=enrolstartdate]").val("")})),e(document).on("click","#customqueryenrollend ~ button.input-search-close",(function(){e("#customqueryenrollend ~ input.form-control").val(""),c.find("input[name=enrolenddate]").val("")})),e(document).on("click","#customquerycompletionstart ~ button.input-search-close",(function(){e("#customquerycompletionstart ~ input.form-control").val(""),c.find("input[name=completionenddate]").val("")})),e(document).on("click","#customquerycompletionend ~ button.input-search-close",(function(){e("#customquerycompletionend ~ input.form-control").val(""),c.find("input[name=completionstartdate]").val("")})),e("#customQueryReportDownload").click((function(e){d(e)})),e("[data-hide]").on("click",(function(){e(this).closest("."+e(this).attr("data-hide")).hide()})),e('.reportfields a[class^="unselect-"]').on("click",(function(){e(this).closest(".reportfields").find('input[type="checkbox"]:not(:disabled)').prop("checked",!1),e(this).hide().siblings('a[class^="select-"]').show()})),e('.reportfields a[class^="select-"]').on("click",(function(){e(this).closest(".reportfields").find('input[type="checkbox"]:not(:disabled)').prop("checked",!0),e(this).hide().siblings('a[class^="unselect-"]').show()})),e(o).find(".checkbox-custom").on("click",(function(){e(this).closest(".reportfields").find('input[type="checkbox"]').length==e(this).closest(".reportfields").find('input[type="checkbox"]:checked').length?e(this).closest(".reportfields").find('a[class^="select-"]').hide().siblings('a[class^="unselect-"]').show():e(this).closest(".reportfields").find('a[class^="unselect-"]').hide().siblings('a[class^="select-"]').show()}))}))}));