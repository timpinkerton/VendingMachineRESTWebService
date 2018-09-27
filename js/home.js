// Global variables
var moneyIn = 0;

const dollar = 100;
const quarter = 25;
const dime = 10;
const nickel = 5;
const penny = 1;

$(document).ready(function () {

    clearAllInputs();
    loadSnacks();

    $('#add-dollar').click(function () {
        moneyIn += dollar;
        $('input#money-in').val("$ " + (moneyIn / dollar).toFixed(2));
        $('input#change-display').val('');
        $('input#messages').val('');
    });

    $('#add-quarter').click(function () {
        moneyIn += quarter;
        $('input#money-in').val("$ " + (moneyIn / dollar).toFixed(2));
        $('input#change-display').val('');
        $('input#messages').val('');
    });

    $('#add-dime').click(function () {
        moneyIn += dime;
        $('input#money-in').val("$ " + (moneyIn / dollar).toFixed(2));
        $('input#change-display').val('');
        $('input#messages').val('');
    });

    $('#add-nickel').click(function () {
        moneyIn += nickel;
        $('input#money-in').val("$ " + (moneyIn / dollar).toFixed(2));
        $('input#change-display').val('');
        $('input#messages').val('');
    });

    $('#make-purchase-button').click(function () {

        var selectedItem = $('input#item').val();

        if (selectedItem == '') {
            $('input#messages').val("You must make a selection");
        } else {
            var selection = $('input#item').val();
            var convertedMoney = moneyIn / dollar;
            makePurchase(convertedMoney, selection);
        }
    });

    $('#change-button').click(function () {
        if (moneyIn === 0) {
            $('input#change-display').val("No Change");
        } else {
            $('input#money-in').val('');
            $('input#messages').val('');
            $('input#item').val('');
            getChange(moneyIn);
            moneyIn = 0;
        }
    });

});

function loadSnacks() {

    $('#snacksDiv').empty();

    var snackList = $('#snacksDiv');

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/items",

        success: function (snackArray) {
            $.each(snackArray, function (index, snack) {
                var id = snack.id;
                var name = snack.name;
                var price = snack.price;
                var quantity = snack.quantity;

                var snack = '<button type="button" onclick="selectItem (' + id + ') " class="btn btn-sm btn-light col-md-3 m-2 selection-button">';
                snack += '<p class="text-left selection-id">' + id + '</p>';
                snack += '<div class="text-center">';
                snack += '<p class="snack-name">' + name + '</p>';
                snack += '<p class="snack-price">$' + price.toFixed(2) + '</p>';
                snack += '<p class="snack-quantity">Quantity Left: ' + quantity + '</p>';
                snack += '</div>';
                snack += '</button>';
                snackList.append(snack);
            });
        },
        error: function () {
            //Error message displayed if the app cannot load the items
            $('input#messages').val('Cannot connect to web server');
        }

    });
}


function getChange(moneyIn) {

    var returnedChange = $('input#change-display');

    var numberOfQuarters = Math.floor(moneyIn / quarter);
    moneyIn -= numberOfQuarters * quarter;

    var numberOfDimes = Math.floor(moneyIn / dime);
    moneyIn -= numberOfDimes * dime;

    var numberOfNickels = Math.floor(moneyIn / nickel);
    moneyIn -= numberOfNickels * nickel;

    var numberOfPennies = Math.floor(moneyIn / penny);
    moneyIn -= numberOfPennies * penny;

    var change = "";

    if (numberOfQuarters > 0) {
        change += numberOfQuarters + " quarter(s) ";
    }

    if (numberOfDimes > 0) {
        change += numberOfDimes + " dime(s) ";
    }

    if (numberOfNickels > 0) {
        change += numberOfNickels + " nickel(s) ";
    }

    if (numberOfPennies > 0) {
        change += numberOfPennies + " pennies";
    }

    returnedChange.val(change);
}


function clearAllInputs() {
    $('input#money-in').val('');
    $('input#messages').val('');
    $('input#item').val('');
    $('input#change-display').val('');
}


function selectItem(id) {
    $('input#messages').val('');
    $('input#change-display').val('');
    $('input#item').val(id);
}


function makePurchase(money, selectionId) {

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/money/" + money + "/item/" + selectionId,

        success: function (data, status) {

            var quartersReturned = data.quarters;
            var dimesReturned = data.dimes;
            var nickelsReturned = data.nickels;
            var penniesReturned = data.pennies;

            var change = "";

            if (quartersReturned > 0) {
                change += quartersReturned + " quarters ";
            }

            if (dimesReturned > 0) {
                change += dimesReturned + " dimes ";
            }

            if (nickelsReturned > 0) {
                change += nickelsReturned + " nickels ";
            }

            if (penniesReturned > 0) {
                change += penniesReturned + " pennies ";
            }

            if (!change) {
                $('input#change-display').val("No Change");
            } else {
                $('input#change-display').val(change);
            }

            //if purchase is successfull, fields are cleared
            $('input#money-in').val('');
            $('input#messages').val('');
            $('input#item').val('');

            //calling loadSnacks() to refresh quantity left after a purchase is made
            loadSnacks();
            $('input#messages').val('Thank You !!!');
            // resetting money to 0
            moneyIn = 0;
        },

        error: function (response) {
            //parsing the JSON response
            var errorMessage = $.parseJSON(response.responseText);
            //accessing the value of the message
            $('input#messages').val(errorMessage.message);
        }
    });

}