import { MouseEvent } from "react";

export function MouseMove(e: MouseEvent, cardsFlex: HTMLDivElement | null) {
  if (!cardsFlex) return;

  const rect = cardsFlex.getBoundingClientRect(),
    x = e.clientX - rect.left;
  const style = window.getComputedStyle(cardsFlex);
  const widthpx = parseInt(style.width, 10);

  const cardStyle = window.getComputedStyle(cardsFlex.children[0]);
  const widthCard = parseInt(cardStyle.width, 10);

  for (let i = 0; i < cardsFlex.children.length; i++) {
    const el = cardsFlex.children[i] as HTMLElement;
    const final = x - widthpx / 2 - widthCard * (i - 1);
    el.style.backgroundPositionX = `${final}px`;
  }
}

export function Init(cardsFlex: HTMLDivElement | null) {
  if (!cardsFlex) return;

  const cardStyle = window.getComputedStyle(cardsFlex.children[0]);
  const widthCard = parseInt(cardStyle.width, 10);

  for (let i = 0; i < cardsFlex.children.length; i++) {
    const el = cardsFlex.children[i] as HTMLDivElement;
    const final = -widthCard * (i - 1);
    el.style.backgroundPositionX = `${final}px`;
    setTimeout(() => {
      el.style.transition = "linear 0.4s background-position-x";
    });
  }
}
