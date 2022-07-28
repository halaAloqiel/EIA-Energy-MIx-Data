(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "period",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "productName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "activityName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "countryRegionName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "countryRegionTypeName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "unit",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "unitName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "dataFlagDescription",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "value",
            dataType: tableau.dataTypeEnum.float
        }];


        var tableSchema = {
            id: "EIA_Data",
            alias: "Eia energy mix",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.eia.gov/v2/international/data?api_key=6WTzBPJg3WgdViKVmfoAqgUlfQohxgX60ayUe7KP&data[]=value&facets[activityId][]=1&&facets[activityId][]=2&&facets[activityId][]=12&facets[unit][]=QBTU&frequency=annual&start=2018-01-01", function(resp) {
            var feat = resp.response.data,
                tableData = [];
            console.log(feat)

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "period": feat[i].period,
                    "productName": feat[i].productName,
                    "activityName": feat[i].activityName,
                    "countryRegionName": feat[i].countryRegionName,
                    "countryRegionTypeName": feat[i].countryRegionTypeName,
                    "unit": feat[i].unit,
                    "unitName": feat[i].unitName,
                    "dataFlagDescription": feat[i].dataFlagDescription,
                    "value": feat[i].value
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "EIA Energy Mix Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
