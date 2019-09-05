define(["jquery","core/chartjs","report_elucidsitereport/defaultconfig","report_elucidsitereport/variables","report_elucidsitereport/flatpickr"],function(b,v,k,y){return{init:function(){var o=k.activeUsersBlock,r=k.getPanel("#activeusersblock"),e=k.getPanel("#activeusersblock","body"),a=k.getPanel("#activeusersblock","title"),t=(k.getPanel("#activeusersblock","footer"),r+" .dropdown-menu[aria-labelledby='filter-dropdown']"),l=t+" .dropdown-item",n=r+" #filter-dropdown.dropdown-toggle",s=r+" #flatpickrCalender",d=e+" .ct-chart",i=e+" .loader",p=r+" button#filter-dropdown",c=a+" .refresh",u=r+y.exportUrlLink,g=null,h=a+" input.form-control.input";function m(e){b(d).addClass("d-none"),b(i).removeClass("d-none"),b.ajax({url:k.requestUrl,data:{action:"get_activeusers_graph_data_ajax",sesskey:b(r).data("sesskey"),data:JSON.stringify({filter:e})}}).done(function(e){o.graph.data=e.data,o.graph.labels=e.labels}).fail(function(e){console.log(e)}).always(function(){C=function(){C&&C.destroy();return v.defaults.global.defaultFontFamily=o.graph.fontFamily,v.defaults.global.defaultFontStyle=o.graph.fontStyle,C=new v(o.ctx,{type:o.graph.type,data:function(){return{labels:o.graph.labels,datasets:[{label:o.graph.labelName.activeUsers,data:o.graph.data.activeUsers,backgroundColor:o.graph.backgroundColor.activeUsers,borderColor:o.graph.borderColor.activeUsers,pointBorderColor:o.graph.borderColor.activeUsers,pointBackgroundColor:o.graph.borderColor.activeUsers,pointStyle:o.graph.pointStyle},{label:o.graph.labelName.enrolments,data:o.graph.data.enrolments,backgroundColor:o.graph.backgroundColor.enrolments,borderColor:o.graph.borderColor.enrolments,pointBorderColor:o.graph.borderColor.enrolments,pointBackgroundColor:o.graph.borderColor.enrolments,pointStyle:o.graph.pointStyle},{label:o.graph.labelName.completionRate,data:o.graph.data.completionRate,backgroundColor:o.graph.backgroundColor.completionRate,borderColor:o.graph.borderColor.completionRate,pointBorderColor:o.graph.borderColor.completionRate,pointBackgroundColor:o.graph.borderColor.completionRate,pointStyle:o.graph.pointStyle}]}}(),options:o.graph.options})}(),y.changeExportUrl(e,u,y.filterReplaceFlag),b(a+" #updated-time > span.minute").html(0),setInterval(f,6e4),b(c).removeClass("refresh-spin"),b(i).addClass("d-none"),b(d).removeClass("d-none")})}function f(){b(a+" #updated-time > span.minute").html(parseInt(b(a+" #updated-time > span.minute").text())+1)}b(document).ready(function(){b(n).on("click",function(){b(t).addClass("show")}),b(h).ready(function(){var e=b(h).attr("placeholder");b(h).val(e)}),b(document).click(function(e){b(e.target).hasClass("dropdown-menu")||b(e.target).parents(".dropdown-menu").length||b(t).removeClass("show")}),b(l+":not(.custom)").on("click",function(){g=b(this).attr("value"),b(t).removeClass("show"),b(p).html(b(this).text()),m(g),b(s).val("Custom"),b(h).val("Custom")}),b(c).on("click",function(){b(this).addClass("refresh-spin"),m(g)}),b(s).flatpickr({mode:"range",altInput:!0,altFormat:"d/m/Y",dateFormat:"Y-m-d",maxDate:"today",appendTo:document.getElementById("activeUser-calendar"),onOpen:function(e){b(t).addClass("withcalendar")},onClose:function(){b(t).removeClass("withcalendar"),b(t).removeClass("show"),function(){g=b(s).val();var e=b(h).val();g.includes("to")&&(k.changeExportUrl(g,u,y.filterReplaceFlag),b(p).html(e),b(s).val(""),m(g))}()}})});var C=m()}}});