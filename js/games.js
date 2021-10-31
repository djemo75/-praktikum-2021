// Environment variables
const apiHost = 'free-to-play-games-database.p.rapidapi.com';
const apiKey = 'a96c9b01c0mshd193539331c30afp1b21a9jsn830f138e192c';
const apiUrl = 'https://free-to-play-games-database.p.rapidapi.com/api';

// Configure the ajax
$.ajaxSetup({
    beforeSend: function (xhr, options) {
        options.url = apiUrl + options.url;
    },
    headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey,
    },
});

const perPage = 30;

let view = 'grid'; // grid/two-columns/list
let allGames = [];
let games = [];
let visibleGames = perPage;

const fetchGames = (params = {}) => {
    $.ajax({
        method: 'GET',
        url: '/games',
        data: params,
    })
        .done(onSuccess)
        .fail(onError);
};

const onSuccess = (response) => {
    visibleGames = perPage; // Clear the pagination
    games = response.slice(0, visibleGames);
    allGames = response;
    $('#games-error').text('');
    renderData();
};

const onError = (response) => {
    games = [];
    allGames = [];
    visibleGames = perPage;
    renderData();
    const error = response?.responseJSON?.message || response?.responseJSON?.status_message || 'Something went wrong';
    $('#games-error').text(error);
};

const renderData = () => {
    $gamesList = $('#games-list');
    $gamesList.empty();
    games.forEach((game) => $gamesList.append(createGameCard(game)));

    if (games.length < allGames.length) {
        $('#btn-show-more').removeClass('d-none'); // Show the button when visible games are less than all games
    } else {
        $('#btn-show-more').addClass('d-none'); // Hide the button when all games are shown
    }
};

const createGameCard = (game) => {
    const $template = $($(`#games-${view}-template`).html());
    $template.find('#game-title').text(game.title);
    $template.find('#game-description').text(game.short_description);
    $template.find('#game-platform').text(game.platform);
    $template.find('#game-image').attr('src', game.thumbnail);
    $template.find('#game-link').attr('href', game.game_url);
    return $template;
};

const getParams = () => {
    const params = {};
    const categoryValue = $('#filter-category').val();
    const sortByValue = $('#sort-by').val();
    const platformValue = $('input[name=game-platform]:checked').val();

    if (platformValue) params.platform = platformValue;
    if (categoryValue) params.category = categoryValue;
    if (sortByValue) params['sort-by'] = sortByValue;

    return params;
};

// Event listeners
$('#btn-show-more').click(() => {
    visibleGames += perPage;
    games = allGames.slice(0, visibleGames);
    renderData();
});

$('#get-games').click(() => fetchGames(getParams()));

$('#grid-view').click((e) => {
    view = 'grid';
    $(e.currentTarget).addClass('btn-secondary').removeClass('btn-outline-secondary');
    $('#list-view').addClass('btn-outline-secondary').removeClass('btn-secondary');
    $('#two-columns-view').addClass('btn-outline-secondary').removeClass('btn-secondary');
    renderData();
});

$('#two-columns-view').click((e) => {
    view = 'two-columns';
    $(e.currentTarget).addClass('btn-secondary').removeClass('btn-outline-secondary');
    $('#list-view').addClass('btn-outline-secondary').removeClass('btn-secondary');
    $('#grid-view').addClass('btn-outline-secondary').removeClass('btn-secondary');
    renderData();
});

$('#list-view').click((e) => {
    view = 'list';
    $(e.currentTarget).addClass('btn-secondary').removeClass('btn-outline-secondary');
    $('#grid-view').addClass('btn-outline-secondary').removeClass('btn-secondary');
    $('#two-columns-view').addClass('btn-outline-secondary').removeClass('btn-secondary');
    renderData();
});

fetchGames(getParams());
