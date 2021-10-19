"use strict";

$(document).ready(function () {
  const wrapper = $("#wrapper");
  const news = $("#news");

  let req = inviaRichiesta("GET", "api/elenco");
  req.fail(errore);
  req.done((data) => {
    console.log(data);
    wrapper.empty();
    for (const news of data) {
      wrapper.append(
        $("<span>")
          .addClass("titolo")
          .text(news.titolo)
          .css({ "margin-right": 25 })
      );
      wrapper.append(
        $("<a>")
          .prop("href", "#")
          .text("Leggi")
          .prop("news", news)
          .css({ "margin-right": 25 })
          .on("click", dettagli)
      );
      wrapper.append(
        $("<span>")
          .addClass("nVis")
          .text(`[visualizzato ${news.visualizzazioni} volte]`)
      );
      wrapper.append($("<br/>"));
    }
  });

  function dettagli() {
    const notizia = $(this).prop("news");
    let req = inviaRichiesta("POST", "/api/dettagli", {
      news: notizia,
    });
    req.fail(errore);
    req.done((data) => {
      console.log(data);
      news.html(data.details);
      let titoli = $(".titolo");
      for (let index = 0; index < titoli.length; index++) {
        const element = titoli.eq(index);
        if (element.html() === notizia.titolo) {
          element
            .next()
            .next()
            .text(`[visualizzato ${data.visualizzazioni} volte]`);
          break;
        }
      }
    });
  }
});
