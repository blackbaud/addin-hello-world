(function () {

    // BBSkyAddinClient is global here.
    var client = new BBSkyAddinClient.AddinClient({
        callbacks: {
            init: function (args) {

                // show the context values provided to the flyout
                $('#environmentId').text(args.envId);
                $('#context').text(JSON.stringify(args.context, null, 2));
            },
            flyoutNextClick: function () {
                // show toast for next button clicked
                client.showToast({
                    message: "Next button was clicked"
                });
            },
            flyoutPreviousClick: function () {
                // show toast for previous button clicked
                client.showToast({
                    message: "Previous button was clicked"
                });
            }
         }
    });
}());
