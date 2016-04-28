﻿$(function () {
    var deliveryMethod = "";
    var paymentMethod = "";

    $("#delivery").on('click', function () {
        $("#deliveryInfoDiv").show();
        $("#pickup").on('click', function () {
            $("#deliveryInfoDiv").hide();
        })

    })

    $("#creditCard").on('click', function () {
        $("#creditCardInfoDiv").show();
        $("#cash").on('click', function () {
            $("#creditCardInfoDiv").hide();
        })

    })

    $('#pickup').on('click', function () {
        deliveryMethod = "Pickup";
    })

    $('#delivery').on('click', function () {
        deliveryMethod = "Delivery";
    })

    $('#cash').on('click', function () {
        paymentMethod = "Cash";
    })

    $('#creditCard').on('click', function () {
        paymentMethod = "Credit Card";
    })

    $("#orderSubmitBtn").on('click', function () {
        var discount = parseFloat($('.discount').val());

        discount = discount || 0;
        $.post("/home/AddOrder", {
            customerId: $('#customerIdCheckout').val(),
            requiredDate: $('#requiredDate').val(),
            deliveryOpt: deliveryMethod,
            deliveryFirstName: $('#deliveryFirstName').val(),
            deliveryLastName: $('#deliveryLastName').val(),
            deliveryAddress: $('#deliveryAddress').val(),
            deliveryCity: $('#deliveryCity').val(),
            deliveryState: $('#deliveryState').val(),
            deliveryZip: $('#deliveryZip').val(),
            phone: $('#phone').val(),
            creditCard: $('#creditCardNumber').val(),
            expiration: $('#expiration').val(),
            securityCode: $('#securityCode').val(),
            paymentMethod: paymentMethod,
            discount: discount,
        },
            function (orderId) {
                $('#orderTable').find('tr').not(':first').each(function () {
                    var product = $(this);
                    var productId = product.data('id');
                    var price = product.data('price');
                    var quantity = $(this).find('input.q').val();

                    $.post("/home/AddOrderDetails", {
                        orderId: orderId,
                        productId: productId,
                        unitPrice: price,
                        quantity: quantity
                    }, function () { });
                })
            })
    });

    $(".categorybtn").on('click', function () {
        var c = $(this).data("category");
        $.post("/home/GetProductsByCategory", { categoryId: c }, function (products) {
            $(".productbtn").remove();
            products.forEach(function (product) {
                var productName = product.ProductName.toString();
                $("#productsInnerDiv").append("<button class=" + '"btn productbtn"' + "data-id=" + product.Id + " data-content=" + '"' + productName + '"' + " data-price=" + product.Price + " data-inStock=" + product.InStock + "><img src=" + "/Uploads/" + product.Image + "></button>")
            });
        })
    })

    $("#productsInnerDiv").on('click', '.productbtn', function () {
        var exists = false;
        var p = $(this);
        var id = p.data("id");
        var productName = p.data("content");
        var inStock = p.data("inStock");
        var price = p.data("price");
        var row = "<tr data-price=" + price + " data-id=" + id + "><td><button class=" + '"btn btn-danger delete"' + ">X</button></td><td>" + productName + "</td><td><input class=" + '"input input-sm q"' + "v-model=" + '"quantity"' + " type=" + '"number"' + " value=" + '"1"' + "min=" + '"1"' + " /></td><td class=" + '"price"' + ">$" + price + "</td></tr>";
        $('#orderTable').find('tr').not(':first').each(function () {
            if ($(this).data('id') == id) {
                var quantity = $(this).find('input.q').val();
                $(this).find('input.q').val(parseInt(quantity) + 1);
                exists = true;
            }
        })
        if (!exists) {
            $("#orderTable").append(row);
        }
        var total = 0;
        var itemCount = 0;
        $('#orderTable').find('tr').not(':first').each(function () {
            var quantity = $(this).find('input.q').val();
            itemCount += (parseInt(quantity));
            var price = $(this).data('price')
            if (quantity === undefined) {
                quantity === 0;
            }
            var t = (parseFloat(quantity) * parseFloat(price));
            total += t;
            $(this).find('.price').text(t);
            $('#totalItems').text("Total items: " + itemCount);
        });
        if (total === NaN) {
            $('#total').text("Total: $" + 0);
        }
        else {
            if (getDiscount() < 1) {
                var d = total * getDiscount();
                $('#total').text("Total: $" + (total - d));
            }
            else {
                $('#total').text("Total: $" + (total - getDiscount()));
            }
        }
    })

    $("#orderTable").on('click', '.delete', function () {
        var i = $(this).closest('tr').index();
        $("tr").eq(i).remove();
        var total = 0;
        var itemCount = 0;
        $('#orderTable').find('tr').not(':first').each(function () {
            var quantity = $(this).find('input.q').val();
            itemCount += (parseInt(quantity));
            var price = $(this).data('price')
            if (quantity === undefined) {
                quantity === 0;
            }
            var t = (parseFloat(quantity) * parseFloat(price));
            total += t;
            $(this).find('.price').text(t);
            $('#totalItems').text("Total items: " + itemCount);
        });
        if (total === NaN) {
            $('#total').text("Total: $" + 0);
        }
        else {
            if (getDiscount() < 1) {
                var d = total * getDiscount();
                $('#total').text("Total: $" + (total - d));
            }
            else {
                $('#total').text("Total: $" + (total - getDiscount()));
            }
        }
    })

    $("#orderTable").on('input', function () {
        var total = 0;
        var itemCount = 0;
        $('#orderTable').find('tr').not(':first').each(function () {
            var quantity = $(this).find('input.q').val();
            itemCount += (parseInt(quantity));
            if (quantity === "")
            { quantity = 1; }
            var price = $(this).data('price')
            if (quantity === undefined) {
                quantity = 1;
            }

            var t = (parseFloat(quantity) * parseFloat(price));
            total += t;
            $(this).find('.price').text(t);
            $('#totalItems').text("Total items: " + itemCount);
        });
        if (total === NaN) {
            $('#total').text("Total: $" + 0);
        }
        else {
            if (getDiscount() < 1) {
                var d = total * getDiscount();
                $('#total').text("Total: $" + (total - d));
            }
            else {
                $('#total').text("Total: $" + (total - getDiscount()));
            }
        }
    });

    $('#refresh').on('click', function () {
        var total = 0;
        var itemCount = 0;
        $('#orderTable').find('tr').not(':first').each(function () {
            var quantity = $(this).find('input.q').val();
            itemCount += (parseInt(quantity));
            var price = $(this).data('price')
            if (quantity === undefined) {
                quantity === 0;
            }
            var t = (parseFloat(quantity) * parseFloat(price));
            total += t;
            $(this).find('.price').text(t);
        });
        $('#totalItems').text("Total items: " + itemCount);
        if (total === NaN) {
            $('#total').text("Total: $" + 0);
        }
        else {
            if (getDiscount() < 1) {
                var d = total * getDiscount();
                $('#total').text("Total: $" + (total - d));
            }
            else {
                $('#total').text("Total: $" + (total - getDiscount()));
            }
        }
    });

    $('#searchInput').on('input', function () {
        $('.customers').remove();
        var s = $('#searchInput').val().toString();
        $.post("/home/Search", { search: s }, function (customers) {
            if (s === "") {
                $('.customers').remove();
            }
            else {
                customers.forEach(function (customer) {
                    $('#searchTable').append("<tr class=" + '"customers"' + "><td>" + customer.FirstName + "</td><td>" + customer.LastName + "</td><td>" + customer.Address + "</td><td>" + customer.Phone + "</td><td>" + customer.Caterer + "</td><td><button class=" + '"' + "btn btn-info select" + '"' + " data-first=" + '"' + customer.FirstName + '"' + "  data-last=" + '"' + customer.LastName + '"' + "  data-add=" + '"' + customer.Address + '"' + "  data-phone=" + '"' + customer.Phone + '"' + " data-id=" + '"' + customer.Id + '"' + " data-caterer=" + '"' + customer.Caterer + '"' + " >" + "Select" + "</button></td></tr>");
                })
            }
        })
    });

    $('#searchCustomerModal').on('click', '.select', function () {
        var fistName = $(this).data('first');
        var lastName = $(this).data('last');
        var address = $(this).data('add');
        var phone = $(this).data('phone');
        var customerId = $(this).data('id');
        var caterer = $(this).data('caterer');
        if (caterer) {
            caterer = .20;
        }
        else {
            caterer = "";
        }

        $('#customerHeader').text("");
        $('#customerAddress').text("");
        $('#customerPhone').text("");
        $('#customerId').val("");
        $('#customerIdCheckout').val("");
        $('#discountInput').val("");

        $('#customerHeader').append(fistName + " " + lastName);
        $('#customerAddress').append(address);
        $('#customerPhone').append(phone);
        $('#customerId').val(customerId);
        $('#searchCustomerModal').modal('toggle');
        $('.customers').remove();
        $('#searchInput').val("");
        $('#customerIdCheckout').val(customerId);
        $('#discountInput').val(caterer);
    });

    function getDiscount() {
        var discount = $("#totalDivInner").find('.discount').val();
        if (discount === "") {
            return 0;
        }
        else {
            return (parseFloat(discount));
        }
    }

    $('#searchInput').on('input', function () {
        $('.history').remove();
        var s = $('#searchInput').val().toString();
        $.post("/home/HistorySearch", { search: s }, function (ordersHistory) {
            if (s === "") {
                $('.history').remove();
            }
            else {
                ordersHistory.forEach(function (ordersHistory) {
                    var paidHtml = "<td></td>";
                    var orderDate = ConvertJsonDate(ordersHistory.orderDate);
                    var requiredDate = ConvertJsonDate(ordersHistory.requiredDate);

                    if (ordersHistory.paid) {
                        paidHtml = "<td><span style=" + '"color: green"' + ">Paid</span></td>";
                    }
                    else {
                        paidHtml = "<td><span style=" + '"color: red"' + ">Not Paid</span></td>";
                    }

                    $('#historyTable').append("<tr class=" + '"history"' + "><td>" + ordersHistory.lastName + " " + ordersHistory.firstName + "</td><td>" + orderDate + "</td><td>" + requiredDate + "</td><td>" + ordersHistory.deliveryOpt + "</td><td></td><td></td>" + paidHtml + " <td><button class=" + '"btn btn-info viewDetailsBtn"' + ">View Details</button><button class=" + '"btn btn-success paymentBtn"' + ">Payment</button></td></tr>");
                })
            }
        })

        $('#historyTable').on('click', '.viewDetailsBtn', function () {
            $('#orderDetailsModal').modal('show');
        })

    });

    $('.viewDetailsBtn').on('click', function () {
        var ordersId = $(this).data('orderid');
        var customersId = $(this).data('customerid');

        $.post("/home/GetOrderHistory", { customerId: ordersId, orderId: customersId }, function (ordersHistory) {
            ordersHistory.orderedProducts.forEach(function (orderedProducts) {
                alert("Works!!!!")
                $('#table').append("<tr><td>" + orderedProducts.productName + "</td><td>" + orderedProducts.unitPrice + "</td><td>" + orderedProducts.quantity + "</td></tr>")
            })
        })
    })



    function ConvertJsonDate(jsonDate) {
        var jsonDate = jsonDate.toString();
        var value = new Date
                    (
                         parseInt(jsonDate.replace(/(^.*\()|([+-].*$)/g, ''))
                    );
        var date = value.getMonth() +
                                 1 +
                               "/" +
                   value.getDate() +
                               "/" +
               value.getFullYear();
        return date;
    }


})