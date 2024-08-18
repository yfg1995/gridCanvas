import { Grid } from "./Grid";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");

  if (grid) {
    new Grid({ wrap: ".grid" });
  }
});
