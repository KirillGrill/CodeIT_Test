jQuery(function($) {

    //получение информации о компаниях от сервера
    var informationFromServer = $.ajax({
        type: 'GET',
        url: 'http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList',
        async: false,
        success: function (data) {

            informationFromServer = data;
        }
    }).responseJSON;

    //получение новостей от сервера
    var newsFromServer = $.ajax({
        type: 'GET',
        url: 'http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList',
        async: false,
        success: function (data) {

            newsFromServer = data;
        }
    }).responseJSON;


    //общее количество компаний
    var numberOfCompaniesFromServer = informationFromServer.list.length;
    const numberOfCompaniesHTML = $("#numberOfCompanies");
    numberOfCompaniesHTML.html(numberOfCompaniesFromServer);

    //список компаний
    const listOfCompanies = $("#listOfCompanies");
    var holderCompanys = ``;
    for (var i = 0; i < numberOfCompaniesFromServer; ++i) {
        holderCompanys += `<div id="${i}" class="company">${informationFromServer.list[i].name}</div>`;
    }
    listOfCompanies.html(holderCompanys);

    //список партнеров
    const partners = $("#partners");
    const news = $("#news");
    const listOfPartners = $("#listOfPartners");
    const stockPercent = $("#stockPercent");
    var id = 0;
    listOfCompanies.on('click', function (event) {

        $(`#${id}`).removeClass('click');
        id =  event.target.id;

        event.target.className += ' click';

        news.attr("hidden", true);
        partners.attr("hidden", false);

        var holderPartners = ``;
        var holderPercent = ``;
        for (var i = 0; i < informationFromServer.list[+(event.target.id)].partners.length; ++i) {
            holderPartners += `<li class="partner">${informationFromServer.list[+(event.target.id)].partners[i].name}</li>`;
            holderPercent += `<li class="percent">${informationFromServer.list[+(event.target.id)].partners[i].value}%</li>`;
        }
        listOfPartners.html(holderPartners);
        stockPercent.html(holderPercent);
    });

    //закрытие окна партнеров
    const closeButton = $("#closeButton");
    closeButton.on('click', function () {
        news.attr("hidden", false);
        partners.attr("hidden", true);
        $(`#${id}`).removeClass('click');
    })

    //получаем информацию странах компаний и преобразуем её в нужную для подачи в диаграмму форму
    var arrOfCountries = [];
    for(var i = 0; i < informationFromServer.list.length; ++i){
        arrOfCountries[i] = informationFromServer.list[i].location.name;
    }

    var result = arrOfCountries.reduce(function(acc, el) {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
    }, {});

    //диаграмма
    const locationDiagram = document.getElementById("locationDiagram");
    const countriesInDiagram = document.getElementById("countriesInDiagram");
    locationDiagram.width = 200;
    locationDiagram.height = 200;

    var countriesOfCompanies = result;

    function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }

    var Piechart = function(options){
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;

        this.draw = function(){
            var total_value = 0;
            var color_index = 0;
            for (var categ in this.options.data){
                var val = this.options.data[categ];
                total_value += val;
            }

            var start_angle = 0;
            for (categ in this.options.data){
                val = this.options.data[categ];
                var slice_angle = 2 * Math.PI * val / total_value;

                drawPieSlice(
                    this.ctx,
                    this.canvas.width/2,
                    this.canvas.height/2,
                    Math.min(this.canvas.width/2,this.canvas.height/2),
                    start_angle,
                    start_angle+slice_angle,
                    this.colors[color_index%this.colors.length]
                );

                start_angle += slice_angle;
                color_index++;
            }

            start_angle = 0;
            for (categ in this.options.data){
                val = this.options.data[categ];
                slice_angle = 2 * Math.PI * val / total_value;
                var pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
                var labelX = this.canvas.width/2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
                var labelY = this.canvas.height/2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle/2);

                if (this.options.doughnutHoleSize){
                    var offset = (pieRadius * this.options.doughnutHoleSize ) / 2;
                    labelX = this.canvas.width/2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
                    labelY = this.canvas.height/2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle/2);
                }

                var labelText = Math.round(100 * val / total_value);
                this.ctx.fillStyle = "white";
                this.ctx.font = "bold 20px Arial";
                this.ctx.fillText(labelText+"%", labelX,labelY);
                start_angle += slice_angle;
            }

            if (this.options.legend){
                color_index = 0;
                var legendHTML = "";
                for (categ in this.options.data){
                    legendHTML += `<div id="${categ}" class="countriesInDiagramPointer"><span style='display:inline-block;width:20px;background-color:`+this.colors[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
                }
                this.options.legend.innerHTML = legendHTML;
            }
        }
    };

    var diagram = new Piechart(
        {
            canvas:locationDiagram,
            data:countriesOfCompanies,
            colors:["#fde23e","#f16e23", "#57d9ff","#937e88","#990099", "#dc3912"],
            legend:countriesInDiagram
        }
    );
    diagram.draw();

    //страница компаний которые относятся к определенной стране
    const countriesInDiagramm = $("#countriesInDiagram");
    const locationDiagramm = $("#locationDiagram");
    const companiesOfCountry = $("#companiesOfCountry");
    const wrapCompaniesByLocation = $("#wrapCompaniesByLocation");
    const titelCompaniesByLocation = $("#titelCompaniesByLocation");
    const backArrow = $("#backArrow");
    const nameOFCountry = $("#nameOFCountry");
    countriesInDiagramm.on('click', function (event) {

        if(event.target.id === "countriesInDiagram"){
            return false;
        }

        locationDiagramm.attr("hidden", true);
        countriesInDiagramm.attr("hidden", true);
        wrapCompaniesByLocation.attr("hidden", true);
        companiesOfCountry.attr("hidden", false);
        backArrow.attr("hidden", false);
        nameOFCountry.attr("hidden", false);

        nameOFCountry.html(`${event.target.id}`);

        var holderCompanies = ``;
        for (var i = 0; i < numberOfCompaniesFromServer; ++i) {
            if(informationFromServer.list[i].location.name === event.target.id) {
                holderCompanies += `<div class="company2">${informationFromServer.list[i].name}</div>`;
            }
        }
        companiesOfCountry.html(holderCompanies);
    });

    //закрытие окна партнеров
    backArrow.on('click', function () {
        locationDiagramm.attr("hidden", false);
        countriesInDiagramm.attr("hidden", false);
        wrapCompaniesByLocation.attr("hidden", false);
        companiesOfCountry.attr("hidden", true);
        backArrow.attr("hidden", true);
        nameOFCountry.attr("hidden", true);
        titelCompaniesByLocation.html("Companies by location");
    })

    //новости
    //var parseDate = new Date(newsFromServer.list[i].date * 1000).format("dd.mm.yyyy");
    const newsSlider = $("#newsSlider");
    var holderNews = ``;
    for (var i = 0; i < newsFromServer.list.length; ++i) {
        holderNews += `<li id="news${i}" class="oneNews" hidden>
                            <div class="wrapNews">
                                <img id="imgNews" class="imgNews" src="${newsFromServer.list[i].img}">
                                <div class="titleLink">
                                    <a id="titleLink" type="text" href="${newsFromServer.list[i].link}">Title</a>
                                </div>
                                <p id="description" class="description">${newsFromServer.list[i].description}</p>
                                <div class="author">
                                    <label id="author">${newsFromServer.list[i].author}</label>
                                </div>
                                <div class="date">
                                    <label id="date">${new Date(newsFromServer.list[i].date * 1000).toLocaleDateString("en-US").split('/').join('.')}</label>
                                </div>
                            </div>
                        </li>`;
    }
    newsSlider.html(holderNews);

    var newsNumber = 0;
    $(`#news${newsNumber}`).attr("hidden", false);

    const rightButton = $("#rightButton");
    rightButton.on('click', function () {

        $(`#news${newsNumber}`).attr("hidden", true);
        if(newsNumber === newsFromServer.list.length-1){
            newsNumber = 0;
        }
        $(`#news${++newsNumber}`).attr("hidden", false);

    });

    const leftButton = $("#leftButton");
    leftButton.on('click', function () {

        $(`#news${newsNumber}`).attr("hidden", true);
        --newsNumber;
        if(newsNumber === newsFromServer.list.length){
            newsNumber = 0;
        }
        if(newsNumber === -1){
           newsNumber = newsFromServer.list.length-1;
        }
        $(`#news${newsNumber}`).attr("hidden", false);

    })


});