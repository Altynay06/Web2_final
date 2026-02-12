
$(document).ready(function () {
  const list =
    $("#movies-list").length
      ? $("#movies-list")
      : $("#series-list").length
      ? $("#series-list")
      : $("#cartoons-list");

  if (!list.length) return;

  const $input = $("#media-search");
  const $suggestions = $("#search-suggestions");

  const titles = list.find(".media-card h3").map(function () {
    return $(this).text();
  }).get();

  $input.on("keyup", function () {
    const query = $(this).val().toLowerCase().trim();
    $suggestions.empty(); 

    list.find(".media-card").each(function () {
      const title = $(this).find("h3").text().toLowerCase();
      $(this).closest(".col-12").toggle(title.includes(query));
    });

    if (query.length > 0) {
      const matched = titles.filter(t => t.toLowerCase().includes(query));

      matched.slice(0, 5).forEach(title => {
        const item = $("<li>")
          .addClass("list-group-item list-group-item-action")
          .text(title)
          .on("click", function () {
            $input.val(title); 
            $suggestions.empty(); 
            $input.trigger("keyup"); 
          });
        $suggestions.append(item);
      });
    }
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".search-bar").length) {
      $suggestions.empty();
    }
  });
});
