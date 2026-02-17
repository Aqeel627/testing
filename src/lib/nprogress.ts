import NProgress from "nprogress";

NProgress.configure({
  minimum: 0.25,
  easing: "ease",
  speed: 350,
  trickle: false,
  showSpinner: false,
});

export default NProgress;
