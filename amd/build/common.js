define(["jquery","core/notification","core/fragment","core/modal_factory","core/modal_events","core/templates","core/str","report_elucidsitereport/variables","report_elucidsitereport/selectors","report_elucidsitereport/templateselector","report_elucidsitereport/jspdf","report_elucidsitereport/select2","report_elucidsitereport/jquery.dataTables","report_elucidsitereport/dataTables.bootstrap4"],(function(e,t,a,o,n,r,d,i,l,s,c){var u=null,f="#scheduletab",m=f+" input#esr-sendtime",p='<div class="w-full text-center"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></div>',h='<div class="alert alert-danger"><b>ERROR:</b> Error while scheduling email<div>',g='<div class="alert alert-success"><b>Success:</b> Email scheduled successfully<div>',b='<div class="alert alert-danger"><b>ERROR:</b> Email deletion failed<div>';function v(t,a){var o=a.getRoot().find("#esr-shceduled-emails");return e(document).on("click",'[aria-controls="listemailstab"]',(function(){e(window).resize()})),o.DataTable({ajax:{url:i.requestUrl,type:i.requestType,data:{action:"get_scheduled_emails_ajax",sesskey:e(t).data("sesskey"),data:JSON.stringify({blockname:e(t).attr("data-blockname"),href:e(t).attr("href"),region:e(t).attr("data-region")})}},scrollY:"300px",scrollX:!0,scrollCollapse:!0,language:{searchPlaceholder:"Search shceduled email",emptyTable:"There is no scheduled emails"},order:[[1,"asc"]],columns:[{data:"esrtoggle",orderable:!1},{data:"esrname",orderable:!0},{data:"esrcomponent",orderable:!0},{data:"esrnextrun",orderable:!0},{data:"esrfrequency",orderable:!0},{data:"esrmanage",orderable:!1}],responsive:!0,bInfo:!1,lengthChange:!1,paging:!1})}function y(t){var a="#wdm-elucidsitereport > div";t<780?e(a).addClass("col-lg-12"):e(a).removeClass("col-lg-12"),e(a).find(".table.dataTable").DataTable().draw()}e(document).ready((function(){y(e("#page-admin-report-elucidsitereport-index .page-content").width()),e(window).on("resize",(function(){y(i.pluginPage.width())})),e(document).on("click",'.download-links button[value="pdf"]',(function(t){t.preventDefault(),e(document).find("#cover-spin")&&e("body").append('<div id="cover-spin"></div>'),e(document).find("#cover-spin").show(0);var a=e(this).closest("form");e.ajax({url:a.attr("action"),type:"POST",data:{type:e(this).val(),block:a.find('input[name="block"]').val(),filter:a.find('input[name="filter"]').val(),cohortid:a.find('input[name="cohortid"]').val(),region:a.find('input[name="region"]').val()}}).done((function(e){e=JSON.parse(e);var t=new c("p","pt","a4"),a={top:40,bottom:30,left:10,width:"100%"};t.setFontSize(10);t.fromHTML(e.data.html,a.left,a.top,{width:a.width,elementHandlers:{"#bypassme":function(e,t){return!0}}},(function(a){t.save(e.data.filename)}),a)})).always((function(){e(document).find("#cover-spin").hide()}))})),e(document).on("click",'.download-links button[value="email"]',(function(r){r.preventDefault();var d=this;o.create({type:o.types.SAVE_CANCEL,title:i.getEmailModalHeader(e(d).data("blockname"),0),body:a.loadFragment("report_elucidsitereport","email_dialog",e(d).data("contextid"),{blockname:e(d).data("blockname")})},e(this)).done((function(a){var o=a.getRoot();o.on(n.hidden,(function(){a.destroy()})),o.on(n.save,(function(){!function(a,o){e.ajax({url:a.href,type:"POST",data:o.find("form").serialize()}).done((function(a){(a=e.parseJSON(a)).error?t.addNotification({message:a.errormsg,type:"error"}):t.addNotification({message:"Email has been sent",type:"info"})})).fail((function(){t.addNotification({message:"Failed to send the email",type:"error"})}))}(d,o)})),a.setSaveButtonText("Send"),a.show()}))})),e(document).on("click",'.download-links button[value="emailscheduled"]',(function(a){a.preventDefault();var l=this,s=i.getScheduledEmailFormContext();o.create({title:i.getEmailModalHeader(e(l).data("blockname"),1),body:r.render("report_elucidsitereport/email_schedule_tabs",s)},e(this)).done((function(a){var o=a.getRoot();a.modal.addClass("modal-lg"),o.on(n.bodyRendered,(function(){o.find("#esr-blockname").val(e(l).data("blockname")),o.find("#esr-region").val(e(l).data("region")),u=v(l,a)})),o.on(n.hidden,(function(){a.destroy()})),function(a,o,n){o.on("click","#scheduletab .dropdown a.dropdown-item",(function(){!function(t){var a=e(t).data("value"),o=e(t).text(),n=e(t).closest(".dropdown").find("button.dropdown-toggle");n.text(o),n.data("value",a)}(this)})),o.on("click","#scheduletab .dropdown.duration-dropdown a.dropdown-item",(function(){!function(t,a){var o=e(t).data("value");e(t).text();a.find("#scheduletab input#esr-sendduration").val(o),e("#scheduletab .dropdown:not(.duration-dropdown) button.dropdown-toggle").hide();var n=null;switch(o){case 1:n=e("#scheduletab .dropdown.weekly-dropdown button.dropdown-toggle");break;case 2:n=e("#scheduletab .dropdown.monthly-dropdown button.dropdown-toggle");break;default:n=e("#scheduletab .dropdown.daily-dropdown button.dropdown-toggle")}n.show();var r=n.data("value");e(m).val(r)}(this,o)})),o.on("click","#scheduletab .dropdown:not(.duration-dropdown) a.dropdown-item",(function(){o.find(m).val(e(this).data("value"))})),o.on("click","#listemailstab .esr-email-sched-setting",(function(){!function(t,a){var o=e(t).data("id"),n=e(t).data("blockname"),r=e(t).data("region");e.ajax({url:i.requestUrl,type:i.requestType,sesskey:e(t).data("sesskey"),data:{action:"get_scheduled_email_detail_ajax",sesskey:e(t).data("sesskey"),data:JSON.stringify({id:o,blockname:n,region:r})}}).done((function(t){t.error?console.log(t):(!function(t,a,o){var n=null,r=null;e.each(t.data,(function(t,a){if("object"==typeof a)o.find("#esr-blockname").val(a.blockname),o.find("#esr-region").val(a.region);else if("esrduration"===t){var d='[aria-labelledby="durationcount"] .dropdown-item[data-value="'+a+'"]';n=a,o.find(d).click()}else if("esrtime"===t)r=a;else if("esremailenable"===t){var i=e('input[name="'+t+'"]');a?i.prop("checked",!0):i.prop("checked",!1)}else e('[name="'+t+'"]').val(a)}));var d='.dropdown-item[data-value="'+r+'"]',i=null;switch(n){case"1":i=e(".weekly-dropdown");break;case"2":i=e(".monthly-dropdown");break;default:i=e(".daily-dropdown")}i.find(d).click()}(t,0,a),a.find('[data-plugin="tabs"] .nav-link, [data-plugin="tabs"] .tab-pane').removeClass("active show"),a.find('[aria-controls="scheduletab"], #scheduletab').addClass("active show"))})).fail((function(e){console.log(e)}))}(this,o)})),o.on("click","#listemailstab .esr-email-sched-delete",(function(a){var r=this;d.get_strings([{key:"confirmemailremovaltitle",component:"report_elucidsitereport"},{key:"confirmemailremovalquestion",component:"report_elucidsitereport"},{key:"yes",component:"moodle"},{key:"no",component:"moodle"}]).done((function(d){t.confirm(d[0],d[1],d[2],d[3],e.proxy((function(){!function(t,a,o){var n=e(t).data("id"),r=e(t).data("blockname"),d=e(t).data("region"),l=a.find(".esr-form-error");l.html(p).show(),e.ajax({url:i.requestUrl,type:i.requestType,sesskey:e(t).data("sesskey"),data:{action:"delete_scheduled_email_ajax",sesskey:e(t).data("sesskey"),data:JSON.stringify({id:n,blockname:r,region:d})}}).done((function(e){e.error?l.html(b):(u&&u.destroy(),u=v(t,o),l.html('<div class="alert alert-success"><b>Success:</b> Email deleted successfully<div>'))})).fail((function(e){l.html(b),console.log(e)})).always((function(){l.delay(3e3).fadeOut("slow")}))}(r,o,n)}),a.currentTarget))}))})),o.on("change","#listemailstab [id^='esr-toggle-']",(function(){!function(t,a,o){var n=e(t).data("id"),r=e(t).data("blockname"),d=e(t).data("region");e.ajax({url:i.requestUrl,type:i.requestType,sesskey:e(t).data("sesskey"),data:{action:"change_scheduled_email_status_ajax",sesskey:e(t).data("sesskey"),data:JSON.stringify({id:n,blockname:r,region:d})}}).done((function(e){e.error||(u&&u.destroy(),u=v(t,o),errorBox.html(g))}))}(this,0,n)})),function(t,a,o){a.on("click",'[data-action="save"]',(function(){var n=a.find(".esr-form-error");if(n.html(p).show(),function(e,t){var a=e.find('[name="esrname"]').val(),o=e.find('[name="esrrecepient"]').val();if(""==a||""==o)return t.html('<div class="alert alert-danger"><b>ERROR:</b> Name and Recepient Fields can not be empty<div>').show(),!1;if(!/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/g.test(o))return t.html('<div class="alert alert-danger"><b>ERROR:</b> Invalid email adderesses space not allowed<div>').show(),!1;return!0}(a.find("form"),n)){var r=i.getUrlParams(t.href,"filter"),d=i.getUrlParams(t.href,"cohortid");e.ajax({url:M.cfg.wwwroot+"/report/elucidsitereport/download.php?format=emailscheduled&filter="+r+"&cohortid="+d,type:"POST",data:a.find("form").serialize()}).done((function(a){(a=e.parseJSON(a)).error?(n.html(h),console.log(a.error)):(u&&u.destroy(),u=v(t,o),n.html(g))})).fail((function(e){n.html(h),console.log(e)})).always((function(){n.delay(3e3).fadeOut("slow")}))}})),a.on("click",'[data-action="cancel"]',(function(){a.find('[name^=esr]:not(.d-none):not([id="esr-toggle-"])').val(""),a.find("#esr-id").val(-1)}))}(a,o,n)}(l,o,a),a.show()}))})),e("#wdm-elucidsitereport").removeClass("d-none")})),e(document).on("click",l.blockSettingsBtn,(function(t){t.preventDefault(),console.log(t.currentTarget),console.log(e(t.currentTarget).data("context")),o.create({title:"Edit Block Setting",body:r.render(s.blockEditSettings,{})}).done((function(e){var t=e.getRoot();t.on(n.bodyRendered,(function(){console.log("Done!")})),t.on(n.hidden,(function(){e.destroy()})),e.show()}))}))}));