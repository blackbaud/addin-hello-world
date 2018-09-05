(function () {

  var initialArgs;
  
  // BBSkyAddinClient is global here.
  var client = new BBSkyAddinClient.AddinClient({
    callbacks: {
      init: function(args) {

        initialArgs = args;
        
        $('#environmentId').text(args.envId);
        $('#context').text(JSON.stringify(args.context, null, 2));

        // wire up a click handler for the login button
        $('#getAuthToken').click(getAuthToken);

        // wire up a click handler for the modal button
        $('#showModal').click(showSimpleModal);

        // wire up a click handler for the help button
        $('#openHelp').click(openHelp);

        // wire up a click handler for the navigation button
        $('#invokeNavigation').click(invokeNavigation);

        // inform the host page that the add-in is ready to be shown
        args.ready({ showUI: true, title: 'My Custom Tile' });
      }
    }
  });

  function getAuthToken() {
    $('#authToken').hide();
    $('#authTokenValue').text('');

    client.getAuthToken().then(function(token) {
      $('#authTokenValue').text(token);
      $('#authToken').show();
    });
  }

  function showModal(url, context) {
    $('#modalResults').hide();
    $('#modalContextReturned').text('');

    // launch the modal and pass it some context
    client.showModal({
      url: url,
      context: context
    }).modalClosed.then(function(context) {
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

  function invokeNavigation() {
    client.navigate({ url: 'https://renxt.blackbaud.com/home' });
  }

  function openHelp() {
    client.openHelp({ helpKey: 'bb-constituents.html' });
  }
  
}());