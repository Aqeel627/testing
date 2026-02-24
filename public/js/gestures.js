document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  false,
);

document.addEventListener("touchstart", function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
});

document.addEventListener(
  "dblclick",
  function (event) {
    event.preventDefault();
  },
  { passive: false },
);
