"use strict";$(document).ready(function(){var t=$("#contracts-active-table").DataTable({dom:"<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",lengthMenu:[[50,75,100,-1],[50,75,100,"All"]],buttons:[{extend:"copy",className:"btn-sm"},{extend:"csv",title:"contracts_active",className:"btn-sm"},{extend:"pdf",orientation:"landscape",title:"contracts_active",className:"btn-sm"},{extend:"print",className:"btn-sm"}],order:[[0,"desc"]],aoColumnDefs:[{bSearchable:!1,aTargets:[6]}]}),e=$("#contracts-inactive-table").DataTable({dom:"<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",lengthMenu:[[50,75,100,-1],[50,75,100,"All"]],buttons:[{extend:"copy",className:"btn-sm"},{extend:"csv",title:"contracts_inactive",className:"btn-sm"},{extend:"pdf",title:"contracts_inactive",className:"btn-sm"},{extend:"print",className:"btn-sm"}],order:[[0,"desc"]],aoColumnDefs:[{bSearchable:!1,aTargets:[6]}]});$(".contracts-active-body p.yellow").html("<p>There are "+t.rows().count()+" results for a total of "+number_format(t.column(5).data().sum(),2,".",",")+" ISK</p>"),$("#contracts-active table_filter input").keyup(function(){$(".contracts-active-body p.yellow").html("There are "+t.rows({filter:"applied"}).count()+" results for a total of "+number_format(t.column(5,{filter:"applied"}).data().sum(),2,".",",")+" ISK")}),$(".contracts-inactive-body p.yellow").html("<p>There are "+e.rows().count()+" results for a total of "+number_format(e.column(5).data().sum(),2,".",",")+" ISK</p>"),$("#contracts-inactive table_filter input").keyup(function(){$(".contracts-inactive-body p.yellow").html("There are "+e.rows({filter:"applied"}).count()+" results for a total of "+number_format(e.column(5,{filter:"applied"}).data().sum(),2,".",",")+" ISK")})});