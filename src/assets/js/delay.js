const delay = interval => { // 計時器
  return new Promise((resolve) => {
    setTimeout(resolve,interval);
  });
};
export { delay }