/* Índice lateral: un punto por sección, marca la que está en pantalla y cambia de tono sobre fondos oscuros. */
(function () {
  const secciones = [...document.querySelectorAll("main > section")];
  const dots = document.getElementById("dots");
  secciones.forEach((s, i) => {
    if (!s.id) s.id = "s" + i;
    const li = document.createElement("li");
    li.innerHTML = `<a href="#${s.id}" aria-label="${s.dataset.title || "Sección " + (i + 1)}" title="${s.dataset.title || ""}"></a>`;
    dots.appendChild(li);
  });
  const enlaces = [...dots.querySelectorAll("a")];
  const oscura = (s) => s.classList.contains("dark") || s.classList.contains("shot") || s.classList.contains("close");

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = secciones.indexOf(e.target);
      enlaces.forEach((a, k) => a.setAttribute("aria-current", k === i));
      dots.classList.toggle("on-dark", oscura(e.target));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  secciones.forEach((s) => io.observe(s));
})();
