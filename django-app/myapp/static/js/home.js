$(document).ready(function() {
    function changeNavbarImage(imagePath) {
        $('#navbar-image').attr('src', imagePath);
    }

    function loadPage(page, addToHistory = true) {
        $.ajax({
            url: page + '/',
            method: 'GET',
            success: function(data) {
                $('#content').html($(data).find('#content').html());
                if (addToHistory) {
                    history.pushState({ page: page }, '', page);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading page:', error);
            }
        });
    }

    $('#start-link').click(function(e) {
        e.preventDefault();
        changeNavbarImage(staticUrl + 'images/image.png');
        loadPage('start');
    });
    $('#pong-link').click(function(e) {
        e.preventDefault();
        changeNavbarImage(staticUrl + 'images/pong.png');
        loadPage('pong');
    });
    $('#chat-link').click(function(e) {
        e.preventDefault();
        changeNavbarImage(staticUrl + 'images/chat.png');
        loadPage('chat');
    });
    $('#dashboard-link').click(function(e) {
        e.preventDefault();
        changeNavbarImage(staticUrl + 'images/dashboard.png');
        loadPage('dashboard');
    });
    $('#friends-link').click(function(e) {
        e.preventDefault();
        changeNavbarImage(staticUrl + 'images/friends.png');
        loadPage('friends');
    });

    // Initial load
    loadPage('start', false);

    // Handle browser back/forward button
    window.onpopstate = function(event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        }
    };
});
