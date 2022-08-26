export function changeBackgroundColor(darkMode: boolean) {
  let root = document.documentElement;

  if (darkMode) {
    root.style.setProperty('--main-bg-color', '#aaa');
  } else {
    root.style.setProperty('--main-bg-color', '#f1f1f1');
  }
}
