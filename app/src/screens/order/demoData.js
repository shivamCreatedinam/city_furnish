export const service_request_type = [
    {
        "name": "Cancel Order",
        "datatype": "listvalues",
        "value": "cancellation",
        "attribute": [
            {
                "name": "Description1",
                "datatype": "text",
                "value": "description",
                "attribute": [

                ]
            },
            {
                "name": "Description2",
                "datatype": "text",
                "value": "description",
                "attribute": [

                ]
            },
            {
                "name": "Cancellation Reason",
                "datatype": "listvalues",
                "value": "cancellation_reason",
                "attribute": [
                    "Wrong Items Selected",
                    "Late Delivery",
                    "Want To Buy Items",
                    "Items Not Required Anymore",
                    "Other"
                ]
            },
            {
                "name": "Extension Tenure(Months)",
                "datatype": "listvalues",
                "value": "get_tenure",
                "attribute": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12
                ]
            },
            {
                "name": "Preferred Date",
                "datatype": "date",
                "value": "chose_date",
                "attribute": [

                ]
            }
        ]
    },
    {
        "name": "Extend Tenure",
        "datatype": "listvalues",
        "value": "full_extension",
        "attribute": [
            {
                "name": "Extension Tenure(Months)",
                "datatype": "listvalues",
                "value": "get_tenure",
                "attribute": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12
                ]
            }
        ]
    },
    {
        "name": "Request Order Pickup",
        "datatype": "listvalues",
        "value": "request_pickup",
        "attribute": [
            {
                "name": "Pickup Type",
                "datatype": "listvalues",
                "value": "pickup_reason",
                "attribute": [
                    "Partial",
                    "Full"
                ]
            },
            {
                "name": "Pickup Reason",
                "datatype": "listvalues",
                "value": "pickup_reason",
                "attribute": [
                    "Products not needed anymore",
                    "Did not like products",
                    "Faced problem in service",
                    "Faced problems with products",
                    "Switching to other provider",
                    "Want to purchase things now",
                    "Moving to other city",
                    "Moving out of country",
                    "Other"
                ]
            },
            {
                "name": "Preferred Date",
                "datatype": "date",
                "value": "chose_date",
                "attribute": [

                ]
            }
        ]
    },
    {
        "name": "Repair",
        "datatype": "listvalues",
        "value": "repair",
        "attribute": {
            "name": "Preferred Date",
            "datatype": "date",
            "value": "requested_date",
            "attribute": [

            ]
        }
    },
    {
        "name": "Upgrade",
        "datatype": "listvalues",
        "value": "upgrade",
        "attribute": [

        ]
    },
    {
        "name": "Installation",
        "datatype": "listvalues",
        "value": "installation",
        "attribute": {
            "name": "Preferred Date",
            "datatype": "date",
            "value": "requested_date",
            "attribute": [

            ]
        }
    },
    {
        "name": "Relocation",
        "datatype": "listvalues",
        "value": "relocation",
        "attribute": [

        ]
    },
    {
        "name": "Buy",
        "datatype": "listvalues",
        "value": "buy",
        "attribute": [

        ]
    },
    {
        "name": "Change Bill Cycle",
        "datatype": "listvalues",
        "value": "change_bill_cycle",
        "attribute": {
            "name": "Align Bill Cycle to 1st day of Month",
            "datatype": "checkbox",
            "value": "allign_bill_cycle_check",
            "attribute": [

            ]
        }
    },
    {
        "name": "Redeem Coins",
        "datetype": "listvalues",
        "value": "redeem_coins",
        "attribute": {
            "name": "Amount",
            "datatype": "number",
            "value": "cf_coins",
            "allowed_amount": 0
        }
    },
    {
        "name": "Order Transfer",
        "datatype": "listvalues",
        "value": "order_transfer",
        "attribute": [
            {
                "name": "Name",
                "datatype": "text",
                "value": "name",
                "attribute": [

                ]
            },
            {
                "name": "Email",
                "datatype": "text",
                "value": "email",
                "attribute": [

                ]
            },
            {
                "name": "Phone",
                "datatype": "number",
                "value": "phone",
                "attribute": [

                ]
            }
        ]
    },
    {
        "name": "Cancel Mandate",
        "datatype": "listvalues",
        "value": "cancel_mandate",
        "attribute": [

        ]
    },
]