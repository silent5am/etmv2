$(function() {
    let totalValue = 0;
    // Sparkline charts
    const sparklineCharts = function() {
        $(".sparkline").sparkline($(".sparkline").data('profit'), {
            type: 'line',
            lineColor: '#FFFFFF',
            lineWidth: 3,
            fillColor: '#404652',
            height: 47,
            width: '100%'
        });
    };

    let sparkResize;
    // Resize sparkline charts on window resize
    $(window).resize(() => {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineCharts, 100);
    });
    // Run sparkline
    sparklineCharts();
    
    // Run toastr notification with Welcome message
    setTimeout(function() {
        toastr.options = {
            "positionClass": "toast-bottom-right",
            "closeButton": true,
            "progressBar": true,
            "showEasing": "swing",
            "timeOut": "6000"
        };
        toastr.success(`<strong>Welcome to Eve Trade Master!</strong> <br/><small>
        Hope you enjoy the new features. Make sure to report any bugs you find.
        Donations are always welcome, too!</small>`);
    }, 1600);

    drawPieChart();

    // load pie chart
    function drawPieChart() {
        const url_req = base + 'Dashboard/getPieChart/' + charID + '/' + aggr;
        $.ajax({
            dataType: "json",
            url: url_req,
            global: false,
            success: (result) => {
                if (result.chart && result.data) {
                    FusionCharts.ready(function () {
                        var pieChart = new FusionCharts({
                            type: 'pie2d',
                            renderAt: 'pie',
                            width: '100%',
                            height: '300',
                            dataFormat: 'json',
                            dataSource: result
                        });
                        pieChart.render();
                    });
                }
            }
        });
    }
    
    $('.table-interval').text(interval);
    // datatables
    var table = $('#profits-table').DataTable({
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4 text-right'f>>tp",
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "All"]],
        buttons: [],
        order: [],
        deferRender: true,
        processing: true,
        serverSide: true,
        ajax : {
            type: 'GET',
            url: base + 'Dashboard/getProfitTable/' + charID + '/' + interval + '/' + aggr,
            dataSrc: (json) => {
                let return_data = [];
                totalValue = json.recordsSum;
                for (let i = 0; i < json.data.length; i++) {
                    return_data.push({
                        item_name: '<img class="pr-5" src="' + json.data[i].url + '">' + json.data[i].item_name,
                        system_name: json.data[i].system_name,
                        sell_time: json.data[i].sell_time,
                        quantity: number_format(json.data[i].quantity, 0, '.', ',' ),
                        profit_total: number_format(json.data[i].profit_total, 2, '.', ',' ),
                        margin: '<a class= "btn btn-default btn-xs">' + number_format(json.data[i].margin, 2, '.', ',' ) + '</a>',
                    });
                }
                updateTableTotals();
                return return_data;
            }
        },
        initComplete: function(settings, json) { 
            let info = this.api().page.info();
        },
        columns: [
            { data: "item_name" },
            { data: "system_name" },
            { data: "sell_time" },
            { data: "quantity" },
            { data: "profit_total" },
            { data: "margin" }
        ],
        aoColumnDefs: [{
            bSearchable: false,
            aTargets: [3]
        }, { targets: 'no-sort', 
            orderable: false 
        }],
        fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (parseFloat(aData.profit_total) > 0) {
                $(nRow).addClass('success');
            } else if (parseFloat(aData.profit_total) < 0) {
                $(nRow).addClass('danger');
            }
        },
        autoWidth: false
    });

    $('.dropdown-interval a').on('click', function(e) {
        e.preventDefault();
        if ($(this).attr('data-id') != interval) {
            interval = $(this).attr('data-id');
            const url = base + 'Dashboard/getProfitTable/' + charID + '/' + interval + '/' + aggr;

            table.ajax.url(url).load();
            $('.table-interval').text(interval);
        }
    });

    function updateTableTotals() {
        setTimeout(function() {
            $('.profits-body .input-sm').trigger('keyup');
        });
    }

    // filters
    $("#profits-table_filter input").keyup(function() {
        let info = table.page.info();
        $(".profits-body p.yellow").html("There are " + info.recordsTotal + " results for a total value of " + 
            number_format(totalValue, 2, '.', ',' ) + " ISK");
    }); 
});