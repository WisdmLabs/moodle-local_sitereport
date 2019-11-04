define(["jquery","core/chartjs","report_elucidsitereport/defaultconfig","report_elucidsitereport/variables","report_elucidsitereport/flatpickr"],function(a,l,n,i){var s=n.activeUsersBlock,d=n.getPanel("#activeusersblock"),e=n.getPanel("#activeusersblock","body"),p=n.getPanel("#activeusersblock","title"),c=(n.getPanel("#activeusersblock","footer"),d+" .dropdown-menu[aria-labelledby='filter-dropdown']"),u=c+" .dropdown-item",g=d+" #filter-dropdown.dropdown-toggle",h=d+" #flatpickrCalender",m=e+" .ct-chart",f=e+" .loader",b=d+" button#filter-dropdown",C=p+" .refresh",v=d+i.exportUrlLink,k=null,y=p+" input.form-control.input",w=null;return{init:function(e){function o(e){a(m).hide(),a(f).show(),e=e||"weekly",a.ajax({url:n.requestUrl,data:{action:"get_activeusers_graph_data_ajax",sesskey:a(d).data("sesskey"),data:JSON.stringify({filter:e})}}).done(function(e){s.graph.data=e.data,s.graph.labels=e.labels}).fail(function(e){console.log(e)}).always(function(){t=function(){t&&t.destroy();return l.defaults.global.defaultFontFamily=s.graph.fontFamily,l.defaults.global.defaultFontStyle=s.graph.fontStyle,t=new l(s.ctx,{type:s.graph.type,data:function(){return{labels:s.graph.labels,datasets:[{label:s.graph.labelName.activeUsers,data:s.graph.data.activeUsers,backgroundColor:s.graph.backgroundColor.activeUsers,borderColor:s.graph.borderColor.activeUsers,pointBorderColor:s.graph.borderColor.activeUsers,pointBackgroundColor:s.graph.borderColor.activeUsers,pointStyle:s.graph.pointStyle},{label:s.graph.labelName.enrolments,data:s.graph.data.enrolments,backgroundColor:s.graph.backgroundColor.enrolments,borderColor:s.graph.borderColor.enrolments,pointBorderColor:s.graph.borderColor.enrolments,pointBackgroundColor:s.graph.borderColor.enrolments,pointStyle:s.graph.pointStyle},{label:s.graph.labelName.completionRate,data:s.graph.data.completionRate,backgroundColor:s.graph.backgroundColor.completionRate,borderColor:s.graph.borderColor.completionRate,pointBorderColor:s.graph.borderColor.completionRate,pointBackgroundColor:s.graph.borderColor.completionRate,pointStyle:s.graph.pointStyle}]}}(),options:s.graph.options})}(),console.log(e),i.changeExportUrl(e,v,i.filterReplaceFlag),a(p+" #updated-time > span.minute").html(0),setInterval(r,6e4),a(C).removeClass("refresh-spin"),a(f).hide(),a(m).fadeIn("slow"),w("activeUsers")})}function r(){a(p+" #updated-time > span.minute").html(parseInt(a(p+" #updated-time > span.minute").text())+1)}w=e,a(document).ready(function(){a(g).on("click",function(){a(c).addClass("show")}),a(y).ready(function(){var e=a(y).attr("placeholder");a(y).val(e)}),a(document).click(function(e){a(e.target).hasClass("dropdown-menu")||a(e.target).parents(".dropdown-menu").length||a(c).removeClass("show")}),a(u+":not(.custom)").on("click",function(){k=a(this).attr("value"),a(c).removeClass("show"),a(b).html(a(this).text()),o(k),a(h).val("Custom"),a(y).val("Custom")}),a(C).on("click",function(){a(this).addClass("refresh-spin"),o(k)}),a(h).flatpickr({mode:"range",altInput:!0,altFormat:"d/m/Y",dateFormat:"Y-m-d",maxDate:"today",appendTo:document.getElementById("activeUser-calendar"),onOpen:function(e){a(c).addClass("withcalendar")},onClose:function(){a(c).removeClass("withcalendar"),a(c).removeClass("show"),function(){k=a(h).val();var e=a(y).val();k.includes("to")&&(n.changeExportUrl(k,v,i.filterReplaceFlag),a(b).html(e),a(h).val(""),o(k))}()}})});var t=o()}}});