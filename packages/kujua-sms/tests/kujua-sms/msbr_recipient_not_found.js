var updates = require('kujua-sms/updates'),
    lists = require('kujua-sms/lists'),
    logger = require('kujua-utils').logger,
    baseURL = require('duality/core').getBaseURL(),
    appdb = require('duality/core').getDBURL(),
    querystring = require('querystring'),
    jsDump = require('jsDump'),
    fakerequest = require('couch-fakerequest'),
    helpers = require('../../test-helpers/helpers'),
    _ = require('underscore')._;


var example = {
    sms_message: {
       from: "+13125551212",
       message: '1!MSBR!2012#1#24#abcdef#1111#bbb#22#8#ccc',
       sent_timestamp: "1-19-12 18:45",
       sent_to: "+15551212",
       type: "sms_message",
       format: "muvuku",
       locale: "en",
       form: "MSBR"
    },
    clinic: {
        "_id": "4a6399c98ff78ac7da33b639ed60f458",
        "_rev": "1-0b8990a46b81aa4c5d08c4518add3786",
        "type": "clinic",
        "name": "Example clinic 1",
        "contact": {
            "name": "Sam Jones",
            "phone": "+17085551212"
        },
        //empty health center should cause recipient_not_found error
        "parent": {
            "type": "health_center",
            "contact": {},
            "parent": {
                "type": "district_hospital",
                "contact": {}
            }
        }
    }
};

var expected_callback = {
    data: {
        type: "data_record",
        form: "MSBR",
        related_entities: {
            clinic: null
        },
        sms_message: example.sms_message,
        from: "+13125551212",
        refid: "abcdef",
        errors: [],
        tasks: [],
        ref_year: "2012",
        ref_month: "1",
        ref_day: 24,
        ref_rc: "abcdef",
        ref_hour: 1111,
        ref_name: "bbb",
        ref_age: 22,
        ref_reason: "TB rouge",
        ref_reason_other: "ccc"
    }
};


/*
 * STEP 1:
 *
 * Run add_sms and expect a callback to add a clinic to a data record which
 * contains all the information from the SMS.
 **/
exports.msbr_recipient_not_found = function (test) {

    test.expect(26);

    // Data parsed from a gateway POST
    var data = {
        from: '+13125551212',
        message: '1!MSBR!2012#1#24#abcdef#1111#bbb#22#8#ccc',
        sent_timestamp: '1-19-12 18:45',
        sent_to: '+15551212'
    };

    // request object generated by duality includes uuid and query.form from
    // rewriter.
    var req = {
        uuid: '14dc3a5aa6',
        query: {form: 'MSBR'},
        method: "POST",
        headers: helpers.headers("url", querystring.stringify(data)),
        body: querystring.stringify(data),
        form: data
    };

    var resp = fakerequest.update(updates.add_sms, data, req);

    var resp_body = JSON.parse(resp[1].body);
    delete resp_body.callback.data.reported_date;
    
    test.same(
        resp_body.callback.options.path,
        baseURL + "/MSBR/data_record/add/clinic/%2B13125551212");

    _.each([
        'ref_year', 'ref_month', 'ref_day', 'ref_rc',
        'ref_hour', 'ref_name', 'ref_age', 'ref_reason',
        'ref_reason_other'
    ], function(attr) {
        test.same(
            resp_body.callback.data[attr],
            expected_callback.data[attr]);
    });

    test.same(
        resp_body.callback.data.sms_message,
        expected_callback.data.sms_message);

    test.same(
        resp_body.callback.data,
        expected_callback.data);

    // form next request from callback data
    var next_req = {
        method: resp_body.callback.options.method,
        body: JSON.stringify(resp_body.callback.data),
        path: resp_body.callback.options.path,
        headers: helpers.headers(
                    'json', JSON.stringify(resp_body.callback.data)),
        query: {form: 'MSBR'}
    };

    step2(test, next_req);

};

//
// STEP 2:
//
// Run data_record/add/clinic and expect a callback to
// check if the same data record already exists.
//
var step2 = function(test, req) {

    var clinic = example.clinic;

    var viewdata = {rows: [
        {
            "key": ["+13125551212"],
            "value": clinic
        }
    ]};

    var resp = fakerequest.list(lists.data_record, viewdata, req);

    var resp_body = JSON.parse(resp.body);

    //
    // For now we do not care for duplicates,
    // so we just check that the data record gets created
    // without merging it with an existing one.
    //
    
    // If no record exists during the merge then we create a new record with
    // POST
    test.same(resp_body.callback.options.method, "POST");
    test.same(resp_body.callback.options.path, appdb);

    // error check
    test.same(
        resp_body.callback.data.errors,
        [{code: 'recipient_not_found',
         message: 'Could not find referral recipient.'}]);

    // the sms_message should not be affected
    test.same(
        resp_body.callback.data.sms_message,
        example.sms_message);

    // the form keys/values should not be affected
    _.each([
        'ref_year', 'ref_month', 'ref_day', 'ref_rc',
        'ref_hour', 'ref_name', 'ref_age', 'ref_reason',
        'ref_reason_other'
    ], function(attr) {
        test.same(
            resp_body.callback.data[attr],
            expected_callback.data[attr]);
    });

    test.same(
        resp_body.callback.data.tasks[0].messages[0].message,
        "Année: 2012, Mois: 1, Jour: 24, Code du RC: abcdef, Heure de départ: 1111, Nom: bbb, Age: 22, Motif référence: TB rouge, Si 'autre', précisez motif référence: ccc"
    );    

    test.done();
};
