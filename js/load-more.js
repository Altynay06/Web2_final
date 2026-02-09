$(document).ready(function() {
    const $newsContainer = $('#news-container');
    const $loadMoreBtn = $('#load-more-btn');
    const $loadingIndicator = $('#loading-indicator');
    const $noMoreNews = $('#no-more-news');
    const allExtraNews = [
        `<div class="col-12">
            <div class="media-card" style="max-width: 900px; margin: 0 auto;">
                <img src="images/witcher.jpg" alt="The Witcher Season 4" class="img-fluid">
                <div>
                    <h3>The Witcher Season 4: First Look at Liam Hemsworth as Geralt</h3>
                    <p>
                        New set photos confirm Liam Hemsworth taking over the role of Geralt of Rivia for the upcoming fourth season.
                        <a href="https://www.netflix.com/tudum/articles/the-witcher-season-4-liam-hemsworth" target="_blank" class="text-danger text-decoration-none">Read more</a>
                    </p>
                </div>
            </div>
        </div>`,
        `<div class="col-12">
            <div class="media-card" style="max-width: 900px; margin: 0 auto;">
                <img src="images/avatar.jpg" alt="Avatar 3" class="img-fluid">
                <div>
                    <h3>Avatar 3 Title Revealed as 'The Seed Bearer'</h3>
                    <p>
                        James Cameron shares new details about the third installment of the Avatar saga, including the official title.
                        <a href="https://variety.com/2023/film/news/avatar-3-title-the-seed-bearer-not-true-jon-landau-1235825777/" target="_blank" class="text-danger text-decoration-none">Read more</a>
                    </p>
                </div>
            </div>
        </div>`,
        `<div class="col-12">
            <div class="media-card" style="max-width: 900px; margin: 0 auto;">
                <img src="images/dunem.jpg" alt="Dune Messiah" class="img-fluid">
                <div>
                    <h3>Dune Messiah Movie Adaptation Moves Forward with Zendaya</h3>
                    <p>
                        Denis Villeneuve is reportedly fast-tracking the production of 'Dune Messiah', with Zendaya's role expanding significantly.
                        <a href="https://comicbook.com/movies/news/dune-3-messiah-leads-replacing-timothee-chalamet-zendaya/" target="_blank" class="text-danger text-decoration-none">Read more</a>
                    </p>
                </div>
            </div>
        </div>`
    ];

    const newsPerLoad = 2; 
    let currentNewsIndex = 0;
    $loadMoreBtn.on('click', function() {
        $loadingIndicator.show();
        $loadMoreBtn.hide();

        setTimeout(function() {
            
            const endIndex = currentNewsIndex + newsPerLoad;

            const newsBatch = allExtraNews.slice(currentNewsIndex, endIndex);
            
            newsBatch.forEach(function(newsHtml) {
                const $newArticle = $(newsHtml).hide(); 
                $newsContainer.append($newArticle);
                $newArticle.fadeIn(500);
            });
            
            currentNewsIndex = endIndex;

            $loadingIndicator.hide();

            if (currentNewsIndex >= allExtraNews.length) {
                $loadMoreBtn.hide(); 
                $noMoreNews.show();
            } else {
                $loadMoreBtn.show();
            }

        }, 1000); 
    });
});