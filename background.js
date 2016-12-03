var ids = [];
var messages = [];
var latestID;

$(function() {
	main();
	setInterval(main, 20000);
});

// Make a GET request for all the data on the notifications page
function main() {
	$.get('https://twitter.com/i/notifications', function(data) {
	    var htmlData = data;

	    $data = $(htmlData).find('#stream-items-id').eq(0); // appends under body tag in HTML
	    $data.find('.activity-truncated-tweet').remove();
	    $data.find('.activity-supplement').remove();
	    $('body').append($data);

	    for (i = 0; i < $data.find('li.stream-item').length; i++) {
	    	ids[i] = $data.find('li.stream-item').eq(i).attr('data-item-id');
	    	messages[i] = ($($data).find('li.stream-item').eq(i).find('div.stream-item-activity-line').text()).replace(/\n/g, '').trim();
	    }
	    console.log(ids)
	    console.log(messages)

	    // This Code block checks if any notifications are new
	    var newTweets = []; // reinitialized each time main() is called

	    if (latestID == ids[0]) {
	    	// no update
	    } else if (latestID === undefined) {
	    	// this is the first run of browser session
	    	var firstRun = {
	    		type: "basic",
	    		title: "Twitter Notifier",
	    		message: "Check your Twitter account for new Notifications",
	    		iconUrl: "icon.png"
	    	};

	    	chrome.notifications.create(firstRun);
	    	latestID = ids[0];
	    	
	    } else if (latestID != ids[0]) {
	    	for(j = 0; j < ids.length; j++){
	    		if (latestID == ids[j]) {
	    			break; // encountered the message id we saved previously
	    		} else {
	    			if(messages[j] != "") {
	    				// Check if replaced old id, if this is case, then stop
	    				newTweets.push(messages[j]);
	    			}
	    		}
	    	}
	    	latestID = ids[0];
	    }
	    
		if (newTweets.length == 0) {
		    // nothing
		} else {
		    for(i = 0; i < newTweets.length; i++) {
			    var myTweet = {
			        type: "basic",
			        title: "New Twitter Notification - Twitter Notifier",
			        message: newTweets[i],
			        contextMessage: "Twitter Notifier",
			        buttons:[{
			        	title: "Open Link"
			        }],
			        iconUrl: "icon.png"
			    };
			    chrome.notifications.onButtonClicked.addListener(function() { // fired when button "Open Link"is clicked
					window.open('https://twitter.com/i/notifications');
			    });
			    chrome.notifications.create(myTweet);
			}
		}
		console.log(newTweets);
		console.log(latestID);
	});	
}