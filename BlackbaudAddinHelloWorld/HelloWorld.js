(function () {

    var initialArgs,
        showHelloWorld = true;

    // BBSkyAddinClient is global here.
    var client = new BBSkyAddinClient.AddinClient({
        callbacks: {
            init: function (args) {

                initialArgs = args;

                $('#environmentId').text(args.envId);
                $('#context').text(JSON.stringify(args.context, null, 2));

                // wire up a click handler for the login button
                $('#getUserIdentityToken').click(getUserIdentityToken);

                // wire up a click handler for the modal button
                $('#showModal').click(showSimpleModal);

                // wire up a click handler for the modal button
                $('#showAddCustomerModal').click(showAddCustomerModal);

                // wire up a click handler for the help button
                $('#openHelp').click(openHelp);

                // wire up a click handler for the navigation button
                $('#invokeNavigation').click(invokeNavigation);

                $('#helpContent').hide();
                $('#helpContent-exit').click(exitHelp);
                $('#closeSettings').click(function () {
                    // close settings, re-show tile content
                    $('#settingsContent').hide();
                    $('#tileContent').show();
                });

                $("#showHelloWorldChk").prop('checked', true);
                $("#showHelloWorldChk").change(function () {
                    showHelloWorld = this.checked;
                    setWelcomeMessageVisibility();
                });

                // inform the host page that the add-in is ready to be shown
                args.ready({
                    showUI: true,
                    title: 'My Custom Tile',
                    tileConfig: {
                        showHelp: true,
                        showSettings: true,
                        summaryStyle: 'Text',
                        summaryChecked: true
                    }
                });
            },
            helpClick: helpClick,
            settingsClick: settingsClick
        }
    });

    function helpClick() {
        $('#helpContent').show();
    }

    function exitHelp() {
        $('#helpContent').hide();
    }

    function setWelcomeMessageVisibility() {
        if (showHelloWorld) {
            $("#helloWorldContainer").show();
        } else {
            $("#helloWorldContainer").hide();
        }
    }

    function settingsClick() {
        // set settings content height same as tile content so the tile size doesn't jump
        // 100 for min-height
        var tileHeight = $('#tileContent').height() || 100;
        $('#settingsContent').height(tileHeight);

        // show settings, hide tile content
        $('#tileContent').hide();
        $('#settingsContent').show();
    }

    function getUserIdentityToken() {
        $('#userIdentityToken').hide();
        $('#userIdentityTokenValue').text('');

        client.getUserIdentityToken().then(function (token) {
            $('#userIdentityTokenValue').text(token);
            $('#userIdentityToken').show();
        });
    }

    function showModal(url, context) {
        $('#modalResults').hide();
        $('#modalContextReturned').text('');

        // launch the modal and pass it some context
        client.showModal({
            url: url,
            context: context
        }).modalClosed.then(function (context) {
            // Handle when the modal is closed, and show the context returned from the modal
            $('#modalContextReturned').text(JSON.stringify(context, null, 2));
            $('#modalResults').show();
        });
    }

    function showSimpleModal() {
        // start with the context provided to this add-in, and pass an additional value to the modal
        var context = $.extend(true, {}, initialArgs.context);
        context['anotherValue'] = 'this value was passed to the modal';

        showModal('https://blackbaudaddinhelloworld.azurewebsites.net/helloworldmodal.html', context);
    }

    function showAddCustomerModal() {
        // define context for the modal
        var context = {
            firstName: 'John',
            lastName: 'Doe'
        };

        showModal('https://host.nxt.blackbaud.com/addin-modal-demo/add-customer', context);
    }

    function invokeNavigation() {
        client.navigate({ url: 'https://www.blackbaud.com' });
    }

    function openHelp() {
        client.openHelp({ helpKey: 'applications.html' });
    }

}());